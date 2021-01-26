import { getReactPlotJSON } from 'common-spectrum';
import React, { useEffect, useState } from 'react';
import { PlotObject } from 'react-plot';

interface SinglePlotProps {
  query: Record<string, unknown>;
  analyses: Array<any>;
}
interface PlotDataType {
  axes: Array<{ label: string }>;
  series: Array<Record<'x' | 'y', number>>;
  meta: Array<Record<string, unknown>>;
  dimentions: Record<string, unknown>;
}

export default function SinglePlot({ query, analyses }: SinglePlotProps) {
  const initState = { series: [], meta: [], axes: [], dimentions: {} };
  const [data, setData] = useState<PlotDataType>(initState);

  useEffect(() => {
    const temp = getReactPlotJSON(analyses, query);
    const richData = {
      ...temp,
      dimentions: {
        ...temp.dimentions,
        width: 500,
        heigth: 400,
        margin: { bottom: 50, left: 80, top: 20, right: 20 },
      },
      legend: { position: 'embedded' },
    };
    setData(richData);
  }, [analyses, query]);
  return <PlotObject plot={data} />;
}
