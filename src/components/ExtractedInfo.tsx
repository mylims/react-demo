import React, { useMemo, useState } from 'react';
import { fromCVd } from 'iv-spectrum';
import { Plot, LineSeries, XAxis, YAxis } from 'react-plot';

import MetaTable from './MetaTable';
import { Input, Select, Toggle } from './tailwind-ui';

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

  const [variablesState, setVariablesState] = useState({
    xLabel: 'Vd',
    xUnits: 'V',
    yLabel: 'C',
    yUnits: 'fF',
  });
  const [plotState, setPlotState] = useState({
    showGridLines: true,
    showMarkers: false,
  });

  const { variables, meta } = useMemo(
    () => analysis.getXYSpectrum(variablesState) || {},
    [analysis, variablesState],
  );

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
            <LineSeries
              data={{ x: variables.x.data, y: variables.y.data }}
              displayMarker={plotState.showMarkers}
            />
            <XAxis
              label={`${variables.x.label} [${variables.x.units}]`}
              showGridLines={plotState.showGridLines}
            />
            <YAxis
              label={`${variables.y.label} [${variables.y.units}]`}
              showGridLines={plotState.showGridLines}
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
            selected={{
              label: variablesState.xLabel,
              value: variablesState.xLabel,
            }}
            onSelect={(selected) => {
              const { label = 'Vd' } = selected || {};
              setVariablesState({
                ...variablesState,
                xLabel: label,
                xUnits: allVariables[label] || 'V',
              });
            }}
          />
          <Input
            name="xUnits"
            label="X units"
            placeholder="X units"
            value={variablesState.xUnits}
            onChange={(e) => {
              const { value: xUnits = 'V' } = e.currentTarget;
              setVariablesState({ ...variablesState, xUnits });
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
            selected={{
              label: variablesState.yLabel,
              value: variablesState.yLabel,
            }}
            onSelect={(selected) => {
              const { label = 'C' } = selected || {};
              setVariablesState({
                ...variablesState,
                yLabel: label,
                yUnits: allVariables[label] || 'fF',
              });
            }}
          />
          <Input
            name="yUnits"
            label="Y units"
            placeholder="Y units"
            value={variablesState.yUnits}
            onChange={(e) => {
              const { value: yUnits = 'fF' } = e.currentTarget;
              setVariablesState({ ...variablesState, yUnits });
            }}
          />
        </div>
        <div className="p-2 m-2">
          <Toggle
            label="Show grid lines"
            activated={plotState.showGridLines}
            onToggle={() => {
              setPlotState({
                ...plotState,
                showGridLines: !plotState.showGridLines,
              });
            }}
          />
          <Toggle
            label="Show markers"
            activated={plotState.showMarkers}
            onToggle={() => {
              setPlotState({
                ...plotState,
                showMarkers: !plotState.showMarkers,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
