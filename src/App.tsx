import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import IVCurve from './views/IVCurve';

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/ivcurve">
            <IVCurve />
          </Route>
          <Route path="/*">
            <IVCurve />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
