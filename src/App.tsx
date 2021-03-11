import React, { useState } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { SidebarLayout, VerticalNavigation } from './components/tailwind-ui';
import { Title, navigationRoutes } from './components/Title';

import IVCurve from './views/base/IVCurve';
import MultipleCurves from './views/base/MultipleCurves';
import ThermalResistance from './views/base/ThermalResistance';
import SamplesTable from './views/base/SamplesTable';
import BaseMultiple from './views/b1505/BaseMultiple';

export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <Router basename="/">
      <SidebarLayout
        isOpen={open}
        open={() => setOpen(true)}
        close={() => setOpen(false)}
      >
        <SidebarLayout.Sidebar>
          <VerticalNavigation
            selected={undefined}
            options={navigationRoutes}
            onSelect={() => setOpen(false)}
          />
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
              <BaseMultiple
                dirName="breakdown"
                maxIndex={18}
                xLabel="Vd"
                xUnits="V"
                yLabel="Id_dens"
                yUnits="mA/mm"
              />
            </Route>
            <Route path="/b1505/capacitance">
              <BaseMultiple
                dirName="capacitance"
                maxIndex={33}
                xLabel="Vd"
                xUnits="V"
                yLabel="C_dens"
                yUnits="pF/mm"
              />
            </Route>
            <Route path="/b1505/transfer">
              <BaseMultiple
                dirName="transfer"
                maxIndex={52}
                xLabel="Vg"
                xUnits="V"
                yLabel="Id_dens"
                yUnits="mA/mm"
              />
            </Route>
            <Route path="/b1505/output">
              <BaseMultiple
                dirName="output"
                maxIndex={44}
                xLabel="Vd"
                xUnits="V"
                yLabel="Id_dens"
                yUnits="mA/mm"
              />
            </Route>
            <Route path="/b1505/iv">
              <BaseMultiple
                dirName="IV"
                maxIndex={6}
                xLabel="Vd"
                xUnits="V"
                yLabel="Id_dens"
                yUnits="mA/mm"
              />
            </Route>
            <Route path="/b1505/iv-diode">
              <BaseMultiple
                dirName="IV_diode"
                maxIndex={14}
                xLabel="Vd"
                xUnits="V"
                yLabel="Id_dens"
                yUnits="mA/mm"
              />
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
