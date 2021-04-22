import React, { useEffect, useState } from 'react';
import { fromMulChannelCap } from 'iv-spectrum';
import { getReactPlotJSON } from 'common-spectrum';
import { PlotObject, PlotObjectType } from 'react-plot';
import { schemeRdYlBu } from 'd3-scale-chromatic';
import { ReactPlotOptions } from 'common-spectrum/lib/reactPlot/getReactPlotJSON';

interface MultipleProps {
  textList: string[];
}

const colorScheme = schemeRdYlBu[11].concat().reverse();
const query = { xLabel: 'Vd', xUnits: 'V', yLabel: 'Id', yUnits: 'mA' };
const margin = { bottom: 50, left: 80, top: 20, right: 130 };
const options: ReactPlotOptions = {
  content: { displayMarker: false },
  dimensions: { width: 700, height: 500, margin },
};

export default function MultipleCurvesDisplayer({ textList }: MultipleProps) {
  const [data, setData] = useState<PlotObjectType | null>(null);
  useEffect(() => {
    const analyses = textList.map((text) => fromMulChannelCap(text));
    const data = getReactPlotJSON(analyses, query, options);
    setData({ ...data, colorScheme, legend: { position: 'right' } });
  }, [textList]);

  return data && <PlotObject plot={data} />;
}
