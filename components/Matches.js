'use client';
import { useEffect, useState } from 'react';

export default function Matches({ active }) {
  const [matches, setMatches] = useState(null);
  useEffect(() => {
    if (active) fetch('/api/matches').then((r) => r.json()).then((d) => setMatches(d.matches));
  }, [active]);

  if (!matches) return <p className="muted center">Loading…</p>;
  if (!matches.length) {
    return (
      <div className="empty">
        <div style={{ fontSize: 56 }}>💌</div>
        <h2>No matches yet</h2>
        <p className="muted">When you and someone else like each other, they'll show up here.</p>
      </div>
    );
  }
  return (
    <div className="grid">
      {matches.map((m) => (
        <div className="mcard" key={m.id}>
          <img src={m.photo} alt={m.name} />
          <div><b>{m.name}, {m.age}</b><small>{m.place}</small></div>
        </div>
      ))}
    </div>
  );
}
