import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { SidebarLayout, VerticalNavigation } from './components/tailwind-ui';
import { Title, navigationRoutes } from './components/Title';

import IVCurve from './views/base/IVCurve';
import MultipleCurves from './views/base/MultipleCurves';
import ThermalResistance from './views/base/ThermalResistance';
import SamplesTable from './views/base/SamplesTable';
import BaseMultiple from './views/b1505/BaseMultiple';

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
            <Route path="/b1505/breakdown">
              <BaseMultiple dirName="breakdown" maxIndex={9} />
            </Route>
            <Route path="/b1505/hemt-breakdown">
              <BaseMultiple dirName="HEMT_breakdown" maxIndex={8} />
            </Route>
            <Route path="/b1505/capacitance">
              <BaseMultiple dirName="capacitance" maxIndex={20} />
            </Route>
            <Route path="/b1505/mos-capacitance">
              <BaseMultiple dirName="MOS_capacitance" maxIndex={13} />
            </Route>
            <Route path="/b1505/transfer">
              <BaseMultiple dirName="transfer" maxIndex={14} />
            </Route>
            <Route path="/b1505/hemt-transfer">
              <BaseMultiple dirName="HEMT_transfer" maxIndex={38} />
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
