import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadBrands, loadOffers } from '../partsSlice';
import { Loader, ErrorMessage, EmptyMessage } from './Status';

export default function BrandStep() {
  const dispatch = useDispatch();
  const { number, brands, selectedBrand } = useSelector((s) => s.parts);
  const [input, setInput] = useState('');

  const search = (e) => {
    e.preventDefault();
    const value = input.trim();
    if (value) dispatch(loadBrands(value));
  };

  return (
    <section className="mb-4">
      <h2 className="h5">Поиск производителей</h2>

      <form className="input-group mb-3" onSubmit={search}>
        <input
          className="form-control"
          placeholder="Артикул детали, например 7160500039S"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary" disabled={!input.trim() || brands.status === 'loading'}>
          Найти
        </button>
      </form>

      {brands.status === 'loading' && <Loader text="Ищем производителей…" />}
      {brands.status === 'failed' && (
        <ErrorMessage message={brands.error} onRetry={() => dispatch(loadBrands(number))} />
      )}
      {brands.status === 'succeeded' && brands.items.length === 0 && (
        <EmptyMessage text={`По артикулу «${number}» ничего не найдено.`} />
      )}
      {brands.status === 'succeeded' && brands.items.length > 0 && (
        <>
          <p className="text-muted mb-2">Выберите производителя:</p>
          <div className="d-flex flex-wrap gap-2">
            {brands.items.map((brand) => (
              <button
                key={brand}
                className={`btn ${brand === selectedBrand ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => dispatch(loadOffers({ number, brand }))}
              >
                {brand}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
