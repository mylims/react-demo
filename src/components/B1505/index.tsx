import React, { useEffect, useMemo, useState } from 'react';
import { fromB1505 } from 'iv-spectrum';
import { Analysis, getReactPlotJSON } from 'common-spectrum';
import { AxisProps, PlotObject, PlotObjectType } from 'react-plot';
import produce from 'immer';

import { Variables } from './Variables';
import { Table } from './Table';

interface B1505Props {
  content: string[];
  defaultQuery: QueryType;
  scale: 'linear' | 'log';
}
interface QueryType {
  xLabel: string;
  xUnits: string;
  yLabel: string;
  yUnits: string;
}

const margin = { bottom: 50, left: 90, top: 20, right: 400 };
const options = {
  enforceGrowing: true,
  series: { displayMarker: false },
  dimensions: { width: 950, height: 500, margin },
};
const INITIAL_SELECTED_RANGE = 5;

function listVariables(analyses: Analysis[]) {
  let list: Record<string, string> = {};
  for (const analysis of analyses) {
    const variables = analysis.spectra[0].variables;
    for (const key in variables) {
      const { label, units = '' } = variables[key];
      const { name = label } = separateNameUnits(label);
      list[name] = units;
    }
  }
  return list;
}

export function separateNameUnits(val: string) {
  const query = /(?<name>.+)\s\[(?<units>.+)\]/.exec(val);
  return { name: query?.groups?.name, units: query?.groups?.units };
}

export default function B1505({ content, defaultQuery, scale }: B1505Props) {
  const [data, setData] = useState<PlotObjectType | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [query, setQuery] = useState<QueryType>(defaultQuery);
  const [files, setFiles] = useState<Analysis[][]>([]);
  const [xAxis, setXAxis] = useState<Partial<AxisProps>>({ scale: 'linear' });
  const [yAxis, setYAxis] = useState<Partial<AxisProps>>({
    labelSpace: scale === 'log' ? 60 : 52,
    scale,
  });
  const [logFilter, setLogFilter] = useState<string | undefined>(undefined);

  const optionsVariables = useMemo(
    () =>
      Object.keys(variables).map((val: string) => {
        const label = val.replace(/(?<label>.+) \[(?<units>.+)\]/, '$<label>');
        return { label, value: label };
      }),
    [variables],
  );

  // Creates the data plot from the analyses
  useEffect(() => {
    const { xLabel, yLabel } = query;
    const parserOptions = { xLabel, yLabel, scale };
    const parsed = content.map((text) => fromB1505(text, parserOptions));

    const analyses = parsed.reduce((acc, curr) => acc.concat(curr), []);
    let data = getReactPlotJSON(analyses, query, {
      ...options,
      xAxis,
      yAxis,
    });

    // Hidde all series except for the N first ones
    data.series = data.series.map((series, index) => ({
      ...series,
      hidden: index >= INITIAL_SELECTED_RANGE,
    }));

    setFiles(parsed);
    setData({ legend: { position: 'right' }, ...data });
    setVariables(listVariables(analyses));
  }, [content, query, defaultQuery, scale, xAxis, yAxis]);

  const filteredData: PlotObjectType | null = useMemo(() => {
    if (!data) return data;
    let series = data.series.filter(({ hidden }) => !hidden);
    if (scale === 'log') {
      switch (logFilter) {
        case 'abs': {
          series = series.map(({ data: series, ...other }) => ({
            ...other,
            data: series.map(({ x, y }) => ({ x, y: Math.abs(y) })),
          }));
          break;
        }
        case 'remove':
        default: {
          series = series.map(({ data: series, ...other }) => ({
            ...other,
            data: series.filter(({ y }) => y > 0),
          }));
          break;
        }
      }
    }
    return { ...data, series };
  }, [data, logFilter, scale]);

  // Data validation
  if (!data || !filteredData) return null;
  if (data.series.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <span>Your data is empty</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col mx-10">
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
          axis={xAxis}
          onChangeAxis={(val) => setXAxis(val)}
          logScale={false}
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
          axis={yAxis}
          onChangeAxis={(val) => setYAxis(val)}
          logScale={true}
          logFilter={logFilter}
          onChangeLog={(val) => setLogFilter(val)}
        />
      </div>
      <PlotObject plot={filteredData} />
      <Table
        files={files}
        content={content}
        data={data}
        onLabelChange={(label, index) =>
          setData(
            produce(data, (draft) => {
              draft.series[index].label = label;
            }),
          )
        }
        onHiddenChange={(hidden, index) =>
          setData(
            produce(data, (draft) => {
              draft.series[index].hidden = hidden;
            }),
          )
        }
        bulkHiddenChange={(hidden) => {
          setData(
            produce(data, (draft) => {
              draft.series.forEach((series) => (series.hidden = hidden));
            }),
          );
        }}
      />
    </div>
  );
}
