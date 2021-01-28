import React from 'react';
import { useLocation } from 'react-router-dom';

export const paths: Record<string, string | undefined> = {
  '/samplestable': '1. Samples table',
  '/ivcurve': '2. Single curve spectra',
  '/multcurve': '3. Superimposed spectra',
  '/thermalresistance': '4. Thermal resistance',
};

export function Title() {
  const location = useLocation();
  return (
    <h1 className="m-4 text-xl font-bold text-primary-500">
      {paths[location.pathname] || 'Demo'}
    </h1>
  );
}
