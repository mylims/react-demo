import React, { useEffect, useState } from 'react';
import { fromBreakdown } from 'iv-spectrum';
import { JSGraph } from 'common-spectrum';
import { PlotObject, PlotObjectType } from 'react-plot';

const { getReactPlotJSON } = JSGraph;
interface B1505Props {
  content: string[];
}

const query = { xLabel: 'Vd', xUnits: 'V', yLabel: 'Id dens', yUnits: 'mA/mm' };
const margin = { bottom: 50, left: 80, top: 20, right: 120 };
const options = {
  series: { displayMarker: false },
  dimentions: { width: 700, height: 500, margin },
};

export default function B1505({ content }: B1505Props) {
  const [data, setData] = useState<PlotObjectType | null>(null);

  // Creates the data plot from the analyses
  useEffect(() => {
    const analyses = content.map((text) => fromBreakdown(text));
    const data = getReactPlotJSON(analyses, query, options);
    setData({ legend: { position: 'right' }, ...data });
  }, [content]);

  if (!data) return null;
  if (data.series.length === 0) return <span>Your data is empty</span>;
  return <PlotObject plot={data} />;
}
