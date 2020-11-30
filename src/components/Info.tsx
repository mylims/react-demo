import React from 'react';
import { ndParse } from 'ndim-parser';
import { Plot, LineSeries, XAxis, YAxis } from 'react-plot';

interface InfoProps {
  text: string;
}

interface MetaTableProps {
  meta: Record<string, string>;
}

function MetaTable({ meta }: MetaTableProps) {
  return (
    <details>
      <summary>Metadata</summary>
      <table>
        <tbody>
          {Object.keys(meta).map((key) => (
            <tr key={key}>
              <td className="font-medium">{key}</td>
              <td>{meta[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
export default function Info({ text }: InfoProps) {
  const { data, meta } = ndParse(text);

  return (
    <div>
      <MetaTable meta={meta} />
      <Plot
        width={500}
        height={500}
        margin={{ bottom: 50, left: 100, top: 10, right: 10 }}
      >
        <LineSeries data={{ x: data.x.data, y: data.y.data }} label="Vg = 3V" />
        <XAxis label={data.x.label} showGridLines={true} />
        <YAxis label={data.y.label} showGridLines={true} />
      </Plot>
    </div>
  );
}
