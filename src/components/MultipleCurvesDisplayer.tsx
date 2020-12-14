import React, { useEffect, useState } from 'react';
import { fromMulChannelCap, getReactPlotJSON } from 'iv-spectrum';
import { Legend, LineSeries, Plot, XAxis, YAxis } from 'react-plot';
import { schemeRdYlBu } from 'd3-scale-chromatic';

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

export default function MultipleCurvesDisplayer({ textList }: MultipleProps) {
  const [data, setData] = useState<PlotDataType>({
    series: [],
  });
  useEffect(() => {
    const analyses = textList.map((text) => fromMulChannelCap(text));
    setData(
      getReactPlotJSON(analyses, {
        xLabel: 'Vd',
        xUnits: 'V',
        yLabel: 'Id',
        yUnits: 'mA',
      }),
    );
  }, [textList]);

  const colorScheme = schemeRdYlBu[11].concat().reverse();

  return (
    <Plot
      width={600}
      height={500}
      colorScheme={colorScheme}
      margin={{ bottom: 50, left: 80, top: 20, right: 90 }}
    >
      {data.series.map((val) => (
        <LineSeries
          key={val.label}
          data={{ x: val.x, y: val.y }}
          label={val.label}
          lineStyle={{ strokeWidth: '3px' }}
        />
      ))}
      <XAxis label={data.axes?.x.label} showGridLines />
      <YAxis
        paddingTop={0.05}
        paddingBottom={0.05}
        label={data.axes?.y.label}
        showGridLines
        labelSpace={50}
      />
      <Legend position="right" />
    </Plot>
  );
}
