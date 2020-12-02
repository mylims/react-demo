import React from 'react';
import { ndParse } from 'ndim-parser';
import { Plot, LineSeries, XAxis, YAxis } from 'react-plot';
import { formatPrefix } from 'd3-format';

import MetaTable from './MetaTable';

interface InfoProps {
  text: string;
}

export default function Info({ text }: InfoProps) {
  const { data, meta } = ndParse(text);

  return (
    <div className="flex flex-wrap justify-center">
      <MetaTable meta={meta} />
      <div className="m-2 shadow sm:rounded-lg">
        <Plot
          width={500}
          height={500}
          margin={{ bottom: 70, left: 100, top: 10, right: 10 }}
        >
          <LineSeries
            data={{ x: data.x.data, y: data.y.data }}
            label="Vg = 3V"
          />
          <XAxis label={`${data.x.label} [V]`} showGridLines={true} />
          <YAxis
            label={`${data.y.label} [fF]`}
            showGridLines={true}
            tickFormat={formatPrefix(',.00', 1e-13)}
            labelSpace={50}
          />
        </Plot>
      </div>
    </div>
  );
}
