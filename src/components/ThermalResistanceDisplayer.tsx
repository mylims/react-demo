import React, { useEffect, useState } from 'react';
import {
  fromPressureSweep,
  getReactPlotJSON,
} from 'thermal-resistance-sepctrum';
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
  axes?: Record<'x' | 'y', { label: string }>;
  series: DataType[];
}

export default function ThermalResistanceDisplayer({
  textList,
}: MultipleProps) {
  const [powerData, setPowerData] = useState<PlotDataType>({ series: [] });
  const [flowData, setFlowData] = useState<PlotDataType>({ series: [] });
  useEffect(() => {
    const analyses = textList.map((text) => fromPressureSweep(text));
    console.log(analyses);
    const power = {
      xLabel: 'Power',
      xUnits: 'W',
      yLabel: 'Temperature difference',
      yUnits: 'K',
    };
    const flow = {
      xLabel: 'Flow Rate',
      xUnits: 'ml/s',
      yLabel: 'Power',
      yUnits: 'W',
    };
    setPowerData(getReactPlotJSON(analyses, power));
    setFlowData(getReactPlotJSON(analyses, flow));
  }, [textList]);

  return (
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
        <XAxis label={powerData.axes?.x.label} showGridLines />
        <YAxis
          paddingTop={0.05}
          label={powerData.axes?.y.label}
          showGridLines
          labelSpace={40}
        />
      </Plot>
      <Plot
        width={500}
        height={400}
        margin={{ bottom: 50, left: 70, top: 20, right: 120 }}
      >
        {flowData.series.map((val) => (
          <LineSeries
            key={val.label}
            data={{ x: val.x, y: val.y }}
            label={val.label}
            lineStyle={{ strokeWidth: '3px' }}
          />
        ))}
        <XAxis label={flowData.axes?.x.label} showGridLines />
        <YAxis
          paddingTop={0.05}
          label={flowData.axes?.y.label}
          showGridLines
          labelSpace={40}
        />
        <Legend position="right" />
      </Plot>
    </div>
  );
}
