import React, { useMemo, useState } from 'react';
import { fromCapacitance } from 'iv-spectrum';
import { toJcamp } from 'common-spectrum';
import { Plot, LineSeries, Axis } from 'react-plot';

import MetaTable from './MetaTable';
import { Input, Select, Toggle } from './tailwind-ui';
import { VariableType } from 'common-spectrum/lib/types';
import { separateNameUnits } from './B1505';

interface InfoProps {
  text: string;
}

function listVariables(variables: Record<string, VariableType>) {
  let list: Record<string, string> = {};
  for (const key in variables) {
    const { label, units } = variables[key];
    const { name = label } = separateNameUnits(label);
    list[name] = units || '';
  }
  return list;
}

function getData(x: number[] | Float64Array, y: number[] | Float64Array) {
  let data = new Array(x.length);
  for (let i = 0; i <= x.length; i++) {
    data[i] = { x: x[i], y: y[i] };
  }
  return data;
}

export default function ExtractedInfo({ text }: InfoProps) {
  const [analysis, allVariables] = useMemo(() => {
    const [analysis] = fromCapacitance(text);
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
    () => analysis.getXYSpectrum(variablesState) || { variables: {} },
    [analysis, variablesState],
  );

  const jcamp = useMemo(() => toJcamp(analysis), [analysis]);
  const data = useMemo(() => getData(variables.x.data, variables.y.data), [
    variables,
  ]);

  return (
    <>
      <div className="flex flex-wrap justify-center">
        {meta && <MetaTable meta={meta} />}
        <div className="flex flex-wrap">
          <div className="m-2 shadow sm:rounded-lg">
            {variables && (
              <Plot
                width={500}
                height={500}
                margin={{ bottom: 50, left: 90, top: 20, right: 20 }}
              >
                <LineSeries data={data} displayMarker={plotState.showMarkers} />
                <Axis
                  id="x"
                  position="bottom"
                  label={variables.x.label}
                  displayGridLines={plotState.showGridLines}
                />
                <Axis
                  id="y"
                  position="left"
                  label={variables.y.label}
                  displayGridLines={plotState.showGridLines}
                  labelSpace={60}
                />
              </Plot>
            )}
          </div>
          <div className="w-48 m-2 shadow sm:rounded-lg">
            <div className="p-2 m-2">
              <Select
                className="w-full"
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
                className="w-full"
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
                className="w-full"
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
                className="w-full"
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
      </div>
      {jcamp && (
        <div>
          <div className="flex flex-wrap justify-center">
            <div className="p-5 m-2 shadow sm:rounded-lg">
              <div className="text-xl font-semibold border-b text-primary-500">
                Original
              </div>
              <div className="inline-block max-w-2xl overflow-auto font-mono whitespace-pre h-96">
                {text}
              </div>
            </div>
            <div className="p-5 m-2 shadow sm:rounded-lg">
              <div className="text-xl font-semibold border-b text-primary-500">
                JCAMP
              </div>
              <div className="inline-block max-w-2xl overflow-auto font-mono whitespace-pre h-96">
                {jcamp}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
