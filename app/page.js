'use client';
import { useState } from 'react';
import Discover from '../components/Discover';

export default function Page() {
  const [tab, setTab] = useState('discover');
  return (
    <div className="shell">
      <main className="main">
        {tab === 'home' && <div className="blank" aria-label="Home (blank)" />}
        <div hidden={tab !== 'discover'} style={{ height: '100%' }}>
          <Discover />
        </div>
      </main>
      <nav className="tabbar">
        <button className={tab === 'home' ? 'on' : ''} onClick={() => setTab('home')}>🏠<span>Home</span></button>
        <button className={tab === 'discover' ? 'on' : ''} onClick={() => setTab('discover')}>🔥<span>Discover</span></button>
      </nav>
    </div>
  );
}
