import React, { useEffect, useMemo, useState } from 'react';
import { getReactPlotJSON } from 'iv-spectrum';
import { fromPressureSweep } from 'thermal-resistance-sepctrum';
import SinglePlot from './SinglePlot';

interface MultipleProps {
  textList: string[];
}

const power = {
  xLabel: 'Power',
  xUnits: 'W',
  yLabel: 'Temperature difference',
  yUnits: 'K',
};
const iv = {
  xLabel: 'Voltage',
  xUnits: 'V',
  yLabel: 'Current',
  yUnits: 'mA',
};

export default function ThermalResistanceDisplayer({
  textList,
}: MultipleProps) {
  const [analyses, setAnalyses] = useState<any[] | null>(null);
  const meta: Record<string, any>[] = useMemo(() => {
    if (!analyses) return [];
    const powerData = getReactPlotJSON(analyses, power);
    return powerData.meta;
  }, [analyses]);

  useEffect(() => {
    setAnalyses(textList.map((text) => fromPressureSweep(text)));
  }, [textList]);

  return (
    <div>
      <div className="ml-12">
        <span className="m-4 text-xl font-bold text-primary-500">
          Total thermal resistance
        </span>
        <ul>
          {meta.map(
            (
              { 'Protocol name': name, totalThermalResistance: resistance },
              index,
            ) => (
              <li key={index}>
                <span className="font-semibold">{name}</span>:{' '}
                {parseFloat(resistance.value).toFixed(4)} [{resistance.units}]
              </li>
            ),
          )}
        </ul>
      </div>
      {analyses && (
        <div className="flex">
          <SinglePlot analyses={analyses} query={power} />
          <SinglePlot analyses={analyses} query={iv} />
        </div>
      )}
    </div>
  );
}
