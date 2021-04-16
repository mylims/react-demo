import React, { useEffect, useMemo, useState } from 'react';
import { fromB1505 } from 'iv-spectrum';
import { Analysis, getReactPlotJSON } from 'common-spectrum';
import { AxisProps, PlotObject, PlotObjectType } from 'react-plot';
import produce from 'immer';

import { Variables } from './Variables';
import { Table } from './Table';
import { ReactPlotOptions } from 'common-spectrum/lib/reactPlot/getReactPlotJSON';
import { ClosestInfo, TrackingResult } from 'react-plot/lib-esm/types';

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
type StateAxis = Partial<AxisProps> & { duplicate: boolean };

const margin = { bottom: 50, left: 90, top: 20, right: 400 };
const options: ReactPlotOptions = {
  enforceGrowing: true,
  series: { displayMarker: false },
  dimensions: { width: 950, height: 500, margin },
  legend: { position: 'right' },
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

function filterAxis(
  data: PlotObjectType,
  axisName: 'x' | 'y',
  filter: string,
  series: PlotObjectType['series'],
): PlotObjectType['series'] {
  const log = data.axes.find(({ id }) => id === axisName)?.scale === 'log';

  if (log) {
    switch (filter) {
      case 'remove': {
        return series.map(({ data: series, ...other }) => ({
          ...other,
          data: series.filter((point) => point[axisName] > 0),
        }));
      }
      case 'abs':
      default: {
        return series.map(({ data: series, ...other }) => ({
          ...other,
          data: series.map((point) => ({
            ...point,
            [axisName]: Math.abs(point[axisName]),
          })),
        }));
      }
    }
  }
  return series;
}

function roundNum(num: number): string {
  return String(Math.round(num * 100) / 100);
}

export default function B1505({ content, defaultQuery, scale }: B1505Props) {
  const [data, setData] = useState<PlotObjectType | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [query, setQuery] = useState<QueryType>(defaultQuery);
  const [files, setFiles] = useState<Analysis[][]>([]);
  const [xAxis, setXAxis] = useState<StateAxis>({
    scale: 'linear',
    tickEmbedded: true,
    duplicate: true,
  });
  const [yAxis, setYAxis] = useState<StateAxis>({
    labelSpace: scale === 'log' ? 60 : 52,
    scale,
    tickEmbedded: true,
    duplicate: true,
  });
  const [logFilter, setLogFilter] = useState<Record<'x' | 'y', string>>({
    x: 'abs',
    y: 'abs',
  });
  const [hover, setHover] = useState<{
    coordinates: TrackingResult['coordinates'];
    closest: Record<string, ClosestInfo>;
  } | null>(null);

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
    const { duplicate: xDupl, ...xAxisPartial } = xAxis;
    const { duplicate: yDupl, ...yAxisPartial } = yAxis;
    let data = getReactPlotJSON(analyses, query, {
      ...options,
      xAxis: xAxisPartial,
      yAxis: yAxisPartial,
      svg: {
        style: {},
        onMouseMove: ({ getClosest, coordinates }) => {
          setHover({ coordinates, closest: getClosest('x') });
        },
        // onMouseLeave: () => setHover(null),
      },
    });

    if (xDupl) {
      const x = data.axes.find(({ id }) => id === 'x');
      if (x) {
        data.axes.push({
          ...x,
          position: 'top',
          label: undefined,
          tickStyle: { display: 'none' },
        });
      }
    }
    if (yDupl) {
      const y = data.axes.find(({ id }) => id === 'y');
      if (y) {
        data.axes.push({
          ...y,
          position: 'right',
          label: undefined,
          tickStyle: { display: 'none' },
        });
      }
    }

    // Hidde all series except for the N first ones
    data.series = data.series.map((series, index) => ({
      ...series,
      hidden: index >= INITIAL_SELECTED_RANGE,
    }));

    setFiles(parsed);
    setData(data);
    setVariables(listVariables(analyses));
  }, [content, query, defaultQuery, scale, xAxis, yAxis]);

  const filteredData: PlotObjectType | null = useMemo(() => {
    if (!data) return data;
    let series = data.series.filter(({ hidden }) => !hidden);
    series = filterAxis(data, 'x', logFilter.x, series);
    series = filterAxis(data, 'y', logFilter.y, series);

    return { ...data, series };
  }, [data, logFilter]);

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
          logScale={true}
          logFilter={logFilter.x}
          onChangeLog={(x) => setLogFilter((prev) => ({ ...prev, x }))}
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
          logFilter={logFilter.y}
          onChangeLog={(y) => setLogFilter((prev) => ({ ...prev, y }))}
        />
      </div>
      {hover && (
        <div>
          {Object.keys(hover.closest).map((key) => (
            <div key={key}>
              <b>{key}: </b>
              <span>{roundNum(hover.closest[key].point.y)}</span>
            </div>
          ))}
        </div>
      )}
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
