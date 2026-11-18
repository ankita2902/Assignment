'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Matches from './Matches';

const THRESHOLD = 110;

export default function Discover() {
  const [view, setView] = useState('swipe'); // 'swipe' | 'matches'
  const [cards, setCards] = useState(null);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [exit, setExit] = useState(null);
  const [match, setMatch] = useState(null);
  const busy = useRef(false);
  const start = useRef(null);

  const loadFeed = useCallback(() => fetch('/api/feed').then((r) => r.json()).then((d) => setCards(d.profiles)), []);
  useEffect(() => { loadFeed(); }, [loadFeed]);

  const top = cards?.[0];

  const swipe = useCallback(async (action) => {
    if (!top || busy.current || match) return;
    busy.current = true;
    setExit(action);
    const req = fetch('/api/swipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: top.id, action }),
    }).then((r) => r.json()).catch(() => null);
    await new Promise((r) => setTimeout(r, 300)); // let fly-out animation play
    const res = await req;
    if (!res || (res.error && res.error !== 'Already swiped')) await loadFeed(); // resync on failure
    else setCards((c) => c.slice(1));
    setExit(null);
    setDrag({ x: 0, y: 0, active: false });
    busy.current = false;
    if (res?.match) setMatch(res.profile);
  }, [top, match, loadFeed]);

  useEffect(() => {
    const onKey = (e) => {
      if (view !== 'swipe') return;
      if (e.key === 'ArrowRight') swipe('like');
      if (e.key === 'ArrowLeft') swipe('pass');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [swipe, view]);

  const onDown = (e) => {
    if (busy.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, active: true });
  };
  const onMove = (e) => {
    if (!start.current) return;
    setDrag({ x: e.clientX - start.current.x, y: (e.clientY - start.current.y) * 0.3, active: true });
  };
  const onUp = () => {
    if (!start.current) return;
    start.current = null;
    if (Math.abs(drag.x) > THRESHOLD) swipe(drag.x > 0 ? 'like' : 'pass');
    else setDrag({ x: 0, y: 0, active: false });
  };

  const x = exit ? (exit === 'like' ? 700 : -700) : drag.x;
  const style = {
    transform: `translate(${x}px, ${drag.y}px) rotate(${x / 18}deg)`,
    transition: drag.active ? 'none' : 'transform .3s ease',
  };
  const likeOp = Math.min(1, Math.max(0, x) / THRESHOLD);
  const passOp = Math.min(1, Math.max(0, -x) / THRESHOLD);

  return (
    <div className="discover">
      <header className="seg">
        <button className={view === 'swipe' ? 'on' : ''} onClick={() => setView('swipe')}>Swipe</button>
        <button className={view === 'matches' ? 'on' : ''} onClick={() => setView('matches')}>Matches</button>
      </header>

      {view === 'matches' ? <Matches active={view === 'matches'} /> : (
        <>
          <div className="stack">
            {cards === null && <p className="muted">Loading…</p>}
            {cards && cards.length === 0 && (
              <div className="empty">
                <div style={{ fontSize: 56 }}>🎉</div>
                <h2>You're all caught up</h2>
                <p className="muted">No more profiles right now. Check back later!</p>
                <button className="ghost" onClick={() => setView('matches')}>View matches</button>
                <button className="ghost" onClick={() => fetch('/api/reset', { method: 'POST' }).then(loadFeed)}>Reset demo data</button>
              </div>
            )}
            {cards?.[1] && <Card p={cards[1]} className="behind" />}
            {top && (
              <Card p={top} style={style} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
                <span className="stamp like" style={{ opacity: likeOp }}>LIKE</span>
                <span className="stamp nope" style={{ opacity: passOp }}>NOPE</span>
              </Card>
            )}
          </div>
          {top && (
            <div className="actions">
              <button className="btn pass" aria-label="Pass" onClick={() => swipe('pass')}>✕</button>
              <button className="btn like" aria-label="Like" onClick={() => swipe('like')}>♥</button>
            </div>
          )}
        </>
      )}

      {match && (
        <div className="overlay">
          <h1>It's a match!</h1>
          <img src={match.photo} alt={match.name} />
          <p>You and {match.name} liked each other.</p>
          <button className="primary" onClick={() => { setMatch(null); setView('matches'); }}>View matches</button>
          <button className="ghost light" onClick={() => setMatch(null)}>Keep swiping</button>
        </div>
      )}
    </div>
  );
}

function Card({ p, className = '', children, ...rest }) {
  return (
    <div className={`card ${className}`} {...rest}>
      <img src={p.photo} alt={p.name} draggable={false} />
      {children}
      <div className="info">
        <h2>{p.name}, {p.age}</h2>
        <div className="place">📍 {p.place}</div>
        <p>{p.bio}</p>
        <div className="tags">{p.interests.map((i) => <span key={i}>{i}</span>)}</div>
      </div>
    </div>
  );
}
