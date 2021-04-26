import React, { useEffect, useMemo, useState } from 'react';
import { fromB1505 } from 'iv-spectrum';
import { Analysis, getReactPlotJSON } from 'common-spectrum';
import { AxisProps, PlotObject, PlotObjectType, Annotation } from 'react-plot';
import produce from 'immer';

import { Variables } from './Variables';
import { Table } from './Table';
import type { ReactPlotOptions } from 'common-spectrum/lib/reactPlot/getReactPlotJSON';
import { ClosestInfoResult } from 'react-plot/lib-esm/types';
import { Button } from '../tailwind-ui';
import ImageInfo from './ImageInfo';

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
interface Hover {
  position: Record<'x' | 'y', number>;
  coordinates: Record<'x' | 'y', number>;
  closest: ClosestInfoResult;
}

const margin = { bottom: 50, left: 90, top: 20, right: 400 };
const options: Partial<ReactPlotOptions> = {
  enforceGrowing: true,
  content: { displayMarker: false },
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

function filterAxis(
  data: PlotObjectType,
  axisName: 'x' | 'y',
  filter: string,
  content: PlotObjectType['content'],
): PlotObjectType['content'] {
  const log =
    (data.axes.find(
      (axis) => axis.id === axisName && axis.type === 'main',
    ) as AxisProps)?.scale === 'log';

  if (log) {
    switch (filter) {
      case 'remove': {
        return content.map((element) => {
          if (element.type === 'annotation') return element;
          const { data: list, ...other } = element;
          return {
            ...other,
            data: list.filter((point) => point[axisName] > 0),
          };
        });
      }
      case 'abs':
      default: {
        return content.map((element) => {
          if (element.type === 'annotation') return element;
          const { data: list, ...other } = element;
          return {
            ...other,
            data: list.map((point) => ({
              ...point,
              [axisName]: Math.abs(point[axisName]),
            })),
          };
        });
      }
    }
  }
  return content;
}

function formatNumber(num: number, scale: 'linear' | 'log' = 'linear') {
  if (scale === 'linear') return num.toFixed(2);
  return num.toExponential(2);
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
  const [hover, setHover] = useState<Hover | null>(null);

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
        id: 'b1505',
        onMouseLeave: () => setHover(null),
        onMouseMove: ({ event, coordinates, getClosest }) => {
          setHover({
            coordinates,
            closest: getClosest('x'),
            position: { x: event.pageX, y: event.pageY },
          });
        },
      },
    });

    if (data.content.length !== content.length) {
      console.warn('Differences in the query', query, {
        data: data.content.length,
        content: content.length,
      });
    }

    if (xDupl) {
      const x = data.axes.find(({ id }) => id === 'x');
      if (x) {
        data.axes.push({
          id: 'x',
          type: 'secondary',
          tickStyle: { display: 'none' },
          tickEmbedded: x.tickEmbedded,
        });
      }
    }
    if (yDupl) {
      const y = data.axes.find(({ id }) => id === 'y');
      if (y) {
        data.axes.push({
          id: 'y',
          type: 'secondary',
          tickStyle: { display: 'none' },
          tickEmbedded: y.tickEmbedded,
        });
      }
    }

    // Hidde all content except for the N first ones
    data.content = data.content.map((content, index) => ({
      ...content,
      hidden: index >= INITIAL_SELECTED_RANGE,
    }));

    setFiles(parsed);
    setData({ legend: { position: 'right' }, ...data });
    setVariables(listVariables(analyses));
  }, [content, query, defaultQuery, scale, xAxis, yAxis]);

  const filteredData: PlotObjectType | null = useMemo(() => {
    if (!data) return data;
    let content = data.content.filter((element) => {
      if (element.type === 'annotation') return true;
      return !element.hidden;
    });
    content = filterAxis(data, 'x', logFilter.x, content);
    content = filterAxis(data, 'y', logFilter.y, content);

    return { ...data, content };
  }, [data, logFilter]);

  // Data validation
  if (!data || !filteredData) return null;
  if (data.content.length === 0) {
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
        <div
          style={{
            position: 'fixed',
            left: hover.position.x + 5,
            top: hover.position.y + 5,
            borderStyle: 'solid',
            padding: '5px',
            backgroundColor: 'white',
          }}
        >
          <b>VALUES</b>
          <div>
            x: {formatNumber(hover.coordinates.x)} [{query.xUnits}]
          </div>
          <div>
            y: {formatNumber(hover.coordinates.y, scale)} [{query.yUnits}]
          </div>
        </div>
      )}
      <PlotObject plot={filteredData}>
        {hover &&
          Object.keys(hover.closest).map((key) => (
            <Annotation.Circle
              key={key}
              cx={hover.closest[key].point.x}
              cy={hover.closest[key].point.y}
              r="3"
            />
          ))}
      </PlotObject>
      <ImageInfo data={data} />
      {hover &&
        Object.keys(hover.closest).map((key) => (
          <div key={key}>
            <b>{hover.closest[key].label}</b>:{' '}
            {formatNumber(hover.closest[key].point.y, scale)} [{query.yUnits}]
          </div>
        ))}
      <Table
        files={files}
        content={content}
        data={data}
        onLabelChange={(label, index) =>
          setData(
            produce(data, (draft) => {
              let element = draft.content[index];
              if (element.type !== 'annotation') element.label = label;
            }),
          )
        }
        onHiddenChange={(hidden, index) =>
          setData(
            produce(data, (draft) => {
              let element = draft.content[index];
              if (element.type !== 'annotation') element.hidden = hidden;
            }),
          )
        }
        bulkHiddenChange={(hidden) => {
          setData(
            produce(data, (draft) => {
              draft.content.forEach((content) => {
                if (content.type !== 'annotation') content.hidden = hidden;
              });
            }),
          );
        }}
      />
    </div>
  );
}
