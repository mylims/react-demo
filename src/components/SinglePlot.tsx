import { getReactPlotJSON } from 'common-spectrum';
import React, { useEffect, useState } from 'react';
import { PlotObject, PlotObjectType } from 'react-plot';

type PlotState = PlotObjectType & { meta: any[] };
interface SinglePlotProps {
  query: Record<string, unknown>;
  analyses: Array<any>;
}

const dimensions = {
  width: 500,
  height: 400,
  margin: { bottom: 50, left: 80, top: 20, right: 20 },
};
const legend = { position: 'embedded' as const };

export default function SinglePlot({ query, analyses }: SinglePlotProps) {
  const initState: PlotState = {
    content: [],
    meta: [],
    axes: [],
    dimensions: { width: 500, height: 500 },
  };
  const [data, setData] = useState<PlotState>(initState);

  useEffect(() => {
    const plot = getReactPlotJSON(analyses, query, { dimensions });
    setData({ ...plot, legend });
  }, [analyses, query]);
  return <PlotObject plot={data} />;
}
