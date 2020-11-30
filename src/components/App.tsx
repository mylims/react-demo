import React from 'react';
import { Step, Stepper } from './tailwind-ui/navigation/Stepper';

function App() {
  const steps: Array<Step> = [];

  for (let i = 0; i <= 4; i++) {
    steps.push({ label: `steps-${i}`, description: `${i}` });
  }

  return <Stepper steps={steps} current={1} />;
}

export default App;
