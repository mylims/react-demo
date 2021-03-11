import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { VerticalNavigationOptions } from './tailwind-ui';

interface Route {
  name: string;
  path: string;
}
export type RoutesType = Record<string, Route[] | undefined>;
export const routes: RoutesType = {
  base: [
    { name: '1. Samples table', path: 'samplestable' },
    { name: '2. Single curve spectra', path: 'ivcurve' },
    { name: '3. Superimposed spectra', path: 'multcurve' },
    { name: '4. Thermal resistance', path: 'thermalresistance' },
  ],
  b1505: [
    { name: 'Breakdown', path: 'breakdown' },
    { name: 'Capacitance', path: 'capacitance' },
    { name: 'Transfer', path: 'transfer' },
    { name: 'Output', path: 'output' },
    { name: 'IV', path: 'iv' },
    { name: 'IV Diode', path: 'iv-diode' },
  ],
};

export const navigationRoutes: VerticalNavigationOptions<string>[] = Object.keys(
  routes,
).map((key) => {
  const subRoutes = routes[key] || [];
  return {
    type: 'group',
    id: key,
    label: key.toUpperCase(),
    options: subRoutes.map(({ name, path }) => ({
      type: 'option',
      id: `${key}-${path}`,
      label: name,
      value: `/${key}/${path}`,
      renderOption: (childen, option) => (
        <Link to={option.value}>{childen}</Link>
      ),
    })),
  };
});

export function useGetTitle() {
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, title, subtitle] = location.pathname.split('/');
  const subRoutes = routes[title] || [];
  const { name } = subRoutes.find(({ path }) => path === subtitle) || {
    name: 'Demo',
  };
  return name;
}

export function Title() {
  const name = useGetTitle();
  return <h1 className="m-4 text-xl font-bold text-primary-500">{name}</h1>;
}
