import React, { useEffect, useState } from 'react';
import { fromMulChannelCap } from 'iv-spectrum';
import { getReactPlotJSON } from 'common-spectrum';
import { PlotObject, PlotObjectType } from 'react-plot';
import { schemeRdYlBu } from 'd3-scale-chromatic';

interface MultipleProps {
  textList: string[];
}

const colorScheme = schemeRdYlBu[11].concat().reverse();
const query = { xLabel: 'Vd', xUnits: 'V', yLabel: 'Id', yUnits: 'mA' };
const margin = { bottom: 50, left: 80, top: 20, right: 120 };
const options = {
  legend: { position: 'right' },
  series: { displayMarker: false },
  dimentions: { width: 700, height: 500, margin },
};

export default function MultipleCurvesDisplayer({ textList }: MultipleProps) {
  const [data, setData] = useState<PlotObjectType | null>(null);
  useEffect(() => {
    const analyses = textList.map((text) => fromMulChannelCap(text));
    const data = getReactPlotJSON(analyses, query, options);
    console.log(data);
    setData({ ...data, colorScheme });
  }, [textList]);

  return data && <PlotObject plot={data} />;
}
