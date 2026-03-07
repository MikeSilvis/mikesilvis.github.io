import React from 'react';
import { Link } from 'react-router-dom';

export default function PinewoodDerby() {
  return (
    <div style={{ padding: 'var(--space-2xl)', maxWidth: 800, margin: '0 auto' }}>
      <Link to="/" style={{ color: 'var(--text2)', textDecoration: 'none', fontSize: '0.85rem' }}>Back</Link>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', marginTop: 'var(--space-md)' }}>
        Pinewood Derby
      </h1>
    </div>
  );
}
