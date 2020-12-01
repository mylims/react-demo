import React from 'react';
import { ndParse } from 'ndim-parser';
import { Plot, LineSeries, XAxis, YAxis } from 'react-plot';
import { formatPrefix } from 'd3-format';

interface InfoProps {
  text: string;
}

interface MetaTableProps {
  meta: Record<string, string>;
}

function MetaTable({ meta }: MetaTableProps) {
  return (
    <div className="p-5 m-2 shadow sm:rounded-lg">
      <div className="text-2xl font-semibold text-blue-500">Metadata</div>
      <table>
        <tbody className="inline-block overflow-auto border-t border-gray-200 h-96">
          {Object.keys(meta).map((key) => (
            <tr key={key}>
              <td className="font-medium">{key}</td>
              <td>{meta[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
