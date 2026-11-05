import React from 'react';

export function Loader({ text = 'Загрузка…' }) {
  return (
    <div className="d-flex align-items-center gap-2 text-muted py-3">
      <div className="spinner-border spinner-border-sm" role="status" />
      <span>{text}</span>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button className="btn btn-sm btn-outline-danger ms-3" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
}

export function EmptyMessage({ text }) {
  return <div className="alert alert-secondary">{text}</div>;
}
