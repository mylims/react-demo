import React, { useEffect, useMemo, useState } from 'react';
import { fromB1505 } from 'iv-spectrum';
import { JSGraph } from 'common-spectrum';
import { PlotObject, PlotObjectType } from 'react-plot';
import { Variables } from './Variables';

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

  const optionsVariables = useMemo(
    () => Object.keys(variables).map((label) => ({ label, value: label })),
    [variables],
  );

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
  }, [content, query, defaultQuery]);

  // Data validation
  if (!data) return null;
  if (data.series.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <span>Your data is empty</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col">
        <Variables
          label="X"
          optionsVariables={optionsVariables}
          name={query.xLabel}
          onChangeName={(label = defaultQuery.xLabel) => {
            const xUnits = variables[label] || defaultQuery.xUnits;
            setQuery({ ...query, xLabel: label, xUnits });
          }}
          units={query.xUnits}
          onChangeUnits={(xUnits) => setQuery({ ...query, xUnits })}
        />
        <Variables
          label="Y"
          optionsVariables={optionsVariables}
          name={query.yLabel}
          onChangeName={(label = defaultQuery.yLabel) => {
            const yUnits = variables[label] || defaultQuery.yUnits;
            setQuery({ ...query, yLabel: label, yUnits });
          }}
          units={query.yUnits}
          onChangeUnits={(yUnits) => setQuery({ ...query, yUnits })}
        />
      </div>
      <PlotObject plot={data} />
    </div>
  );
}
