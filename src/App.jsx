import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';

const PinewoodDerby = lazy(() => import('./pages/PinewoodDerby/PinewoodDerby'));
const Wrestling = lazy(() => import('./pages/Wrestling/Wrestling'));

export default function App() {
  return (
    <Suspense fallback={<div style={{ background: '#0d0f14', minHeight: '100vh' }} />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/pinewood-derby" element={<PinewoodDerby />} />
        <Route path="/projects/big-ten-wrestling-2026" element={<Wrestling />} />
      </Routes>
    </Suspense>
  );
}
