import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { SidebarLayout } from './components/tailwind-ui';
import Title from './components/Title';

import IVCurve from './views/IVCurve';

export default function App() {
  const itemClass =
    'flex items-center w-full py-2 text-sm font-medium rounded-md cursor-pointer group hover:text-neutral-900 hover:bg-neutral-100 text-neutral-600';
  return (
    <Router>
      <SidebarLayout>
        <SidebarLayout.Sidebar>
          <div className="flex flex-col flex-grow mt-5">
            <nav className="flex-1 px-2 space-y-1 bg-white">
              <ul>
                <li className={itemClass}>
                  <Link to="/ivcurve">IV curve</Link>
                </li>
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
            <Route path="/*">
              <IVCurve />
            </Route>
          </Switch>
        </SidebarLayout.Body>
      </SidebarLayout>
    </Router>
  );
}
