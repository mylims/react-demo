import React, { useEffect, useState } from 'react';
import { getReactPlotJSON } from 'common-spectrum';
import { fromPressureSweep } from 'thermal-resistance-sepctrum';
import { Legend, LineSeries, Plot, XAxis, YAxis } from 'react-plot';

interface MultipleProps {
  textList: string[];
}
interface DataType {
  x: number[];
  y: number[];
  label: string;
}
interface PlotDataType {
  axes?: { label: string }[];
  series: DataType[];
  meta: Record<string, unknown>[];
}

export default function ThermalResistanceDisplayer({
  textList,
}: MultipleProps) {
  const initState = { series: [], meta: [] };
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
        <Plot
          width={500}
          height={400}
          margin={{ bottom: 50, left: 70, top: 20, right: 120 }}
        >
          {powerData.series.map((val) => (
            <LineSeries
              key={val.label}
              data={{ x: val.x, y: val.y }}
              label={val.label}
              lineStyle={{ strokeWidth: '3px' }}
            />
          ))}
          <XAxis label={powerData.axes?.[0].label} showGridLines />
          <YAxis
            paddingTop={0.05}
            label={powerData.axes?.[1].label}
            showGridLines
            labelSpace={40}
          />
          <Legend position="right" />
        </Plot>
        <Plot
          width={500}
          height={400}
          margin={{ bottom: 50, left: 70, top: 20, right: 120 }}
        >
          {ivData.series.map((val) => (
            <LineSeries
              key={val.label}
              data={{ x: val.x, y: val.y }}
              label={val.label}
              lineStyle={{ strokeWidth: '3px' }}
            />
          ))}
          <XAxis label={ivData.axes?.[0].label} showGridLines />
          <YAxis
            paddingTop={0.05}
            label={ivData.axes?.[1].label}
            showGridLines
            labelSpace={40}
          />
          <Legend position="right" />
        </Plot>
      </div>
    </div>
  );
}
