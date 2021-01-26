import React, { useEffect, useMemo, useState } from 'react';
import { fromMulChannelCap, getReactPlotJSON } from 'iv-spectrum';
import { PlotObject } from 'react-plot';
import { schemeRdYlBu } from 'd3-scale-chromatic';

interface MultipleProps {
  textList: string[];
}

export default function MultipleCurvesDisplayer({ textList }: MultipleProps) {
  const [data, setData] = useState<Record<string, any> | null>(null);
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
  const plot = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      colorScheme,
      dimentions: {
        ...data.dimentions,
        width: 700,
        heigth: 500,
        margin: { bottom: 50, left: 80, top: 20, right: 120 },
      },
      legend: { position: 'right' },
    };
  }, [data, colorScheme]);
  console.log(plot);
  return plot && <PlotObject plot={plot} />;
}
