import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { SidebarLayout } from './components/tailwind-ui';
import { Title, paths } from './components/Title';

import IVCurve from './views/IVCurve';
import SamplesTable from './views/SamplesTable';

export default function App() {
  return (
    <Router>
      <SidebarLayout>
        <SidebarLayout.Sidebar>
          <div className="flex flex-col flex-grow mt-5">
            <nav className="flex-1 px-2 space-y-1 bg-white">
              <ul>
                {Object.keys(paths).map((key) => (
                  <li
                    key={key}
                    className="flex items-center w-full py-2 text-sm font-medium rounded-md cursor-pointer group hover:text-neutral-900 hover:bg-neutral-100 text-neutral-600"
                  >
                    <Link to={key}>{paths[key] || 'Demo'}</Link>
                  </li>
                ))}
              </ul>
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
            <Route path="/*">
              <IVCurve />
            </Route>
          </Switch>
        </SidebarLayout.Body>
      </SidebarLayout>
    </Router>
  );
}
