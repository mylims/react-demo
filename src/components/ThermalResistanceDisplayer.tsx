import React, { useEffect, useState } from 'react';
import { getReactPlotJSON } from 'common-spectrum';
import { fromPressureSweep } from 'thermal-resistance-sepctrum';
import { PlotObject } from 'react-plot';

interface MultipleProps {
  textList: string[];
}
interface DataType {
  x: number[];
  y: number[];
  label: string;
}
interface PlotDataType {
  axes: { label: string }[];
  series: DataType[];
  meta: Record<string, unknown>[];
}

export default function ThermalResistanceDisplayer({
  textList,
}: MultipleProps) {
  const initState = { series: [], meta: [], axes: [] };
  const [powerData, setPowerData] = useState<PlotDataType>(initState);
  const [ivData, setIvData] = useState<PlotDataType>(initState);

  useEffect(() => {
    const analyses = textList.map((text) => fromPressureSweep(text));
    console.log(analyses);
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
    setPowerData(getReactPlotJSON(analyses, power));
    setIvData(getReactPlotJSON(analyses, iv));
  }, [textList]);

  return (
    <div>
      <div className="flex">
        <ul>
          {powerData.meta.map((val, index) => (
            <li key={index}>{JSON.stringify(val)}</li>
          ))}
        </ul>
      </div>
      <div className="flex">
        <PlotObject plot={powerData} />
        <PlotObject plot={ivData} />
      </div>
    </div>
  );
}
