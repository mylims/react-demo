import React, { useEffect, useState } from "react";
import { getReactPlotJSON, fromBreakdown } from "iv-spectrum";
import { PlotObject, PlotObjectType } from "react-plot";

interface B1505Props {
  content: string[];
}

const query = { xLabel: "Vd", xUnits: "V", yLabel: "Id_dens", yUnits: "mA/mm" };
const margin = { bottom: 50, left: 80, top: 20, right: 120 };
const options = {
  legend: { position: "right" },
  series: { displayMarker: false },
  dimentions: { width: 700, height: 500, margin },
};

export default function B1505({ content }: B1505Props) {
  const [data, setData] = useState<PlotObjectType | null>(null);
  useEffect(() => {
    const analyses = content.map((text) => fromBreakdown(text));
    const data = getReactPlotJSON(analyses, query, options);
    setData(data);
  }, [content]);
  return data && <PlotObject plot={data} />;
}
