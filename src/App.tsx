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
                maxIndex={9}
                xLabel="Vd"
                xUnits="V"
                yLabel="Id_dens"
                yUnits="mA/mm"
              />
            </Route>
            <Route path="/b1505/hemt-breakdown">
              <BaseMultiple
                dirName="HEMT_breakdown"
                maxIndex={8}
                xLabel="Vd"
                xUnits="V"
                yLabel="Id_dens"
                yUnits="mA/mm"
              />
            </Route>
            <Route path="/b1505/capacitance">
              <BaseMultiple
                dirName="capacitance"
                maxIndex={20}
                xLabel="Vd"
                xUnits="V"
                yLabel="C_dens"
                yUnits="pF/mm"
              />
            </Route>
            <Route path="/b1505/mos-capacitance">
              <BaseMultiple
                dirName="MOS_capacitance"
                maxIndex={13}
                xLabel="VBias"
                xUnits="V"
                yLabel="C_dens"
                yUnits="pF/mm"
              />
            </Route>
            <Route path="/b1505/transfer">
              <BaseMultiple
                dirName="transfer"
                maxIndex={14}
                xLabel="Vg"
                xUnits="V"
                yLabel="Id_dens"
                yUnits="mA/mm"
              />
            </Route>
            <Route path="/b1505/noff-transfer">
              <BaseMultiple
                dirName="noff_transfer"
                maxIndex={38}
                xLabel="Vg"
                xUnits="V"
                yLabel="Id_dens"
                yUnits="mA/mm"
              />
            </Route>
            <Route path="/b1505/noff-output">
              <BaseMultiple
                dirName="noff_output"
                maxIndex={11}
                xLabel="Vd"
                xUnits="V"
                yLabel="Id_dens"
                yUnits="mA/mm"
              />
            </Route>
            <Route path="/b1505/f-implant-output">
              <BaseMultiple
                dirName="f_implant_output"
                maxIndex={13}
                xLabel="Vd"
                xUnits="V"
                yLabel="Id_dens"
                yUnits="mA/mm"
              />
            </Route>
            <Route path="/b1505/LPCVD-output">
              <BaseMultiple
                dirName="LPCVD_output"
                maxIndex={20}
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
