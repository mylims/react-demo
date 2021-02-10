import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { SidebarLayout, VerticalNavigation } from './components/tailwind-ui';
import { Title, navigationRoutes } from './components/Title';

import IVCurve from './views/IVCurve';
import MultipleCurves from './views/MultipleCurves';
import ThermalResistance from './views/ThermalResistance';
import SamplesTable from './views/SamplesTable';

export default function App() {
  return (
    <Router basename="/">
      <SidebarLayout>
        <SidebarLayout.Sidebar>
          <VerticalNavigation selected={undefined} options={navigationRoutes} />
        </SidebarLayout.Sidebar>
        <SidebarLayout.Header>
          <Title />
        </SidebarLayout.Header>
        <SidebarLayout.Body>
          <Switch>
            <Route path="/base/ivcurve">
              <IVCurve />
            </Route>
            <Route path="/base/samplestable">
              <SamplesTable />
            </Route>
            <Route path="/base/multcurve">
              <MultipleCurves />
            </Route>
            <Route path="/base/thermalresistance">
              <ThermalResistance />
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
