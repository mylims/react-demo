import React, { useMemo, useState } from 'react';
import { fromCVd } from 'iv-spectrum';
import { Plot, LineSeries, XAxis, YAxis } from 'react-plot';

import MetaTable from './MetaTable';
import { Input, Select } from './tailwind-ui';

interface InfoProps {
  text: string;
}

function listVariables(variables: Record<string, Record<string, string>>) {
  let list: Record<string, string> = {};
  for (const key in variables) {
    const { label, units } = variables[key];
    list[label] = units;
  }
  return list;
}

export default function ExtractedInfo({ text }: InfoProps) {
  const [analysis, allVariables] = useMemo(() => {
    const analysis = fromCVd(text);
    return [analysis, listVariables(analysis.spectra[0].variables)];
  }, [text]);
  const [state, setState] = useState({
    xLabel: 'Vd',
    xUnits: 'V',
    yLabel: 'C',
    yUnits: 'fF',
  });

  const { variables, meta } = analysis.getXYSpectrum(state) || {};

  return (
    <div className="flex flex-wrap justify-center">
      {meta && <MetaTable meta={meta} />}
      <div className="m-2 shadow sm:rounded-lg">
        {variables && (
          <Plot
            width={500}
            height={500}
            margin={{ bottom: 50, left: 80, top: 20, right: 20 }}
          >
            <LineSeries data={{ x: variables.x.data, y: variables.y.data }} />
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
        )}
      </div>
      <div className="w-48 m-2 shadow sm:rounded-lg">
        <div className="p-2 m-2">
          <Select
            label="X variable"
            options={Object.keys(allVariables).map((label) => ({
              label,
              value: label,
            }))}
            selected={{ label: state.xLabel, value: state.xLabel }}
            onSelect={(selected) => {
              const { label = 'Vd' } = selected || {};
              setState({
                ...state,
                xLabel: label,
                xUnits: allVariables[label] || 'V',
              });
            }}
          />
          <Input
            name="xUnits"
            label="X units"
            placeholder="X units"
            value={state.xUnits}
            onChange={(e) => {
              const { value: xUnits = 'V' } = e.currentTarget;
              setState({ ...state, xUnits });
            }}
          />
        </div>

        <div className="p-2 m-2">
          <Select
            label="Y variable"
            options={Object.keys(allVariables).map((label) => ({
              label,
              value: label,
            }))}
            selected={{ label: state.yLabel, value: state.yLabel }}
            onSelect={(selected) => {
              const { label = 'C' } = selected || {};
              setState({
                ...state,
                yLabel: label,
                yUnits: allVariables[label] || 'fF',
              });
            }}
          />
          <Input
            name="yUnits"
            label="Y units"
            placeholder="Y units"
            value={state.yUnits}
            onChange={(e) => {
              const { value: yUnits = 'fF' } = e.currentTarget;
              setState({ ...state, yUnits });
            }}
          />
        </div>
      </div>
    </div>
  );
}
