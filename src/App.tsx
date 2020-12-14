import React from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { SidebarLayout } from './components/tailwind-ui';
import { Title, paths } from './components/Title';

import IVCurve from './views/IVCurve';
import MultipleCurves from './views/MultipleCurves';
import SamplesTable from './views/SamplesTable';

export default function App() {
  return (
    <Router basename="/">
      <SidebarLayout>
        <SidebarLayout.Sidebar>
          <div className="flex flex-col flex-grow mt-5">
            <nav className="flex-1 px-2 space-y-1 bg-white">
              {Object.keys(paths).map((key) => (
                <Link
                  key={key}
                  to={key}
                  className="flex items-center w-full py-2 text-sm font-medium rounded-md cursor-pointer group hover:text-neutral-900 hover:bg-neutral-100 text-neutral-600"
                >
                  {paths[key] || 'Demo'}
                </Link>
              ))}
            </nav>
          </div>
        </SidebarLayout.Sidebar>
        <SidebarLayout.Header>
          <Title />
        </SidebarLayout.Header>
        <SidebarLayout.Body>
          <Switch>
            <Route path="/ivcurve">
              <IVCurve />
            </Route>
            <Route path="/samplestable">
              <SamplesTable />
            </Route>
            <Route path="/multcurve">
              <MultipleCurves />
            </Route>
            <Route path="/*">
              <IVCurve />
            </Route>
          </Switch>
        </SidebarLayout.Body>
      </SidebarLayout>
    </Router>
  );
}
