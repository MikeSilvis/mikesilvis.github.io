import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: 'var(--space-2xl)', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', marginBottom: 'var(--space-lg)' }}>
        Mike Silvis
      </h1>
      <nav style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
        <Link to="/projects/big-ten-wrestling-2026" style={linkStyle}>Big Ten Wrestling 2026</Link>
        <Link to="/projects/pinewood-derby" style={linkStyle}>Pinewood Derby</Link>
      </nav>
    </div>
  );
}

const linkStyle = {
  color: 'var(--blue2)',
  textDecoration: 'none',
  padding: 'var(--space-sm) var(--space-md)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
};
