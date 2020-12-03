import React from 'react';
import { fromCVd } from 'iv-spectrum';
import { Plot, LineSeries, XAxis, YAxis } from 'react-plot';

import MetaTable from './MetaTable';

interface InfoProps {
  text: string;
}

export default function ExtractedInfo({ text }: InfoProps) {
  const analysis = fromCVd(text);
  const { variables, meta } = analysis.getXYSpectrum({
    xLabel: 'Vd',
    xUnits: 'V',
    yLabel: 'C',
    yUnits: 'fF',
  });

  return (
    <div className="flex flex-wrap justify-center">
      <MetaTable meta={meta} />
      <div className="m-2 shadow sm:rounded-lg">
        <Plot
          width={500}
          height={500}
          margin={{ bottom: 50, left: 80, top: 20, right: 20 }}
        >
          <LineSeries
            data={{ x: variables.x.data, y: variables.y.data }}
            label="Vg = 3V"
          />
          <XAxis
            label={`${variables.x.label} [${variables.x.units}]`}
            showGridLines={true}
          />
          <YAxis
            label={`${variables.y.label} [${variables.y.units}]`}
            showGridLines={true}
            labelSpace={50}
          />
        </Plot>
      </div>
    </div>
  );
}
