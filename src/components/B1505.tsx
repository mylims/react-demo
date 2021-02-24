import React, { useEffect, useState } from 'react';
import { fromB1505 } from 'iv-spectrum';
import { JSGraph } from 'common-spectrum';
import { PlotObject, PlotObjectType } from 'react-plot';
import { Input, Select } from './tailwind-ui';

const { getReactPlotJSON } = JSGraph;
interface B1505Props {
  content: string[];
  defaultQuery: QueryType;
}
interface QueryType {
  xLabel: string;
  xUnits: string;
  yLabel: string;
  yUnits: string;
}

const margin = { bottom: 50, left: 90, top: 20, right: 400 };
const options = {
  series: { displayMarker: false },
  dimentions: { width: 950, height: 500, margin },
};

function listVariables(analyses: any[]) {
  let list: Record<string, string> = {};
  for (const analysis of analyses) {
    const variables = analysis.spectra[0].variables;
    for (const key in variables) {
      const { label, units } = variables[key];
      list[label] = units;
    }
  }
  return list;
}

export default function B1505({ content, defaultQuery }: B1505Props) {
  const [data, setData] = useState<PlotObjectType | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [query, setQuery] = useState<QueryType>(defaultQuery);

  // Creates the data plot from the analyses
  useEffect(() => {
    const analyses = content
      .map((text) =>
        fromB1505(text, {
          xLabel: query.xLabel,
          yLabel: query.yLabel,
          scale: 'linear' as const,
        }),
      )
      .reduce((acc, curr) => acc.concat(curr), []);
    const data = getReactPlotJSON(analyses, query, options);
    setData({ legend: { position: 'right' }, ...data });
    setVariables(listVariables(analyses));
  }, [content, query]);

  if (!data) return null;
  if (data.series.length === 0) return <span>Your data is empty</span>;
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row">
        <div className="flex flex-col m-3">
          <Select
            className="w-full"
            label="X variable"
            options={Object.keys(variables).map((label) => ({
              label,
              value: label,
            }))}
            selected={{
              label: query.xLabel,
              value: query.xLabel,
            }}
            onSelect={(selected) => {
              const { label = defaultQuery.xLabel } = selected || {};
              setQuery({
                ...query,
                xLabel: label,
                xUnits: variables[label] || defaultQuery.xUnits,
              });
            }}
          />
          <Input
            className="w-full"
            name="xUnits"
            label="X units"
            placeholder="X units"
            value={query.xUnits}
            onChange={(e) => {
              const { value: xUnits } = e.currentTarget;
              setQuery({ ...query, xUnits });
            }}
          />
        </div>
        <div className="flex flex-col m-3">
          <Select
            className="w-full"
            label="Y variable"
            options={Object.keys(variables).map((label) => ({
              label,
              value: label,
            }))}
            selected={{
              label: query.yLabel,
              value: query.yLabel,
            }}
            onSelect={(selected) => {
              const { label = defaultQuery.yLabel } = selected || {};
              setQuery({
                ...query,
                yLabel: label,
                yUnits: variables[label] || defaultQuery.yUnits,
              });
            }}
          />
          <Input
            className="w-full"
            name="yUnits"
            label="Y units"
            placeholder="Y units"
            value={query.yUnits}
            onChange={(e) => {
              const { value: yUnits } = e.currentTarget;
              setQuery({ ...query, yUnits });
            }}
          />
        </div>
      </div>
      <PlotObject plot={data} />
    </div>
  );
}
