import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadOffers } from '../partsSlice';
import { Loader, ErrorMessage, EmptyMessage } from './Status';

function getPrice(item) {
  const prices = (item.warehouses || []).filter((w) => w.stock > 0).map((w) => w.price);
  const all = (item.warehouses || []).map((w) => w.price);
  const list = prices.length ? prices : all;
  return list.length ? Math.min(...list) : null;
}

const formatPrice = (p) =>
  p === null ? '-' : p.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });

export default function OffersStep() {
  const dispatch = useDispatch();
  const { number, selectedBrand, offers } = useSelector((s) => s.parts);

  if (!selectedBrand) return null;

  return (
    <section>
      <h2 className="h5">
        Аналоги и предложения: {number} / {selectedBrand}
      </h2>

      {offers.status === 'loading' && <Loader text="Загружаем предложения…" />}
      {offers.status === 'failed' && (
        <ErrorMessage
          message={offers.error}
          onRetry={() => dispatch(loadOffers({ number, brand: selectedBrand }))}
        />
      )}
      {offers.status === 'succeeded' && offers.items.length === 0 && (
        <EmptyMessage text="Предложений не найдено." />
      )}
      {offers.status === 'succeeded' && offers.items.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Название</th>
                <th>Производитель</th>
                <th>Артикул</th>
                <th className="text-end">Цена</th>
                <th className="text-end">Остаток</th>
              </tr>
            </thead>
            <tbody>
              {offers.items.map((item, i) => (
                <tr key={`${item.goodsID}-${i}`}>
                  <td>
                    {item.name}
                    {item.isOriginal && <span className="badge bg-success ms-2">искомая</span>}
                  </td>
                  <td>{item.brand}</td>
                  <td>{item.number}</td>
                  <td className="text-end">{formatPrice(getPrice(item))}</td>
                  <td className="text-end">{item.count > 0 ? `${item.count} шт.` : 'нет в наличии'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
