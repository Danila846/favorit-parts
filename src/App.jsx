import React from 'react';
import BrandStep from './components/BrandStep';
import OffersStep from './components/OffersStep';

export default function App() {
  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <h1 className="h3 mb-4">Подбор автозапчастей</h1>
      <BrandStep />
      <OffersStep />
    </div>
  );
}
