import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Title() {
  const location = useLocation();
  const paths: Record<string, string | undefined> = {
    '/ivcurve': 'IV spectra',
  };
  return (
    <h1 className="m-4 text-xl font-bold text-primary-500">
      {paths[location.pathname] || 'Demo'}
    </h1>
  );
}
