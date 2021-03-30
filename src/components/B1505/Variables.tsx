import React from 'react';
import { AxisProps } from 'react-plot';
import { Input, Select, Toggle } from '../tailwind-ui';

interface DataSelect {
  label: string;
  value: string;
}
interface VariablesProps {
  label: string;
  optionsVariables: DataSelect[];
  name: string;
  onChangeName: (name?: string) => void;
  units: string;
  onChangeUnits: (units: string) => void;
  axis: Partial<AxisProps>;
  onChangeAxis: (value: Partial<AxisProps>) => void;
  logScale: boolean;
  logFilter?: string;
  onChangeLog?: (value?: string) => void;
}

const logFilters: Record<string, string> = {
  remove: 'Remove non-positives',
  abs: 'Take absolute value',
};

const logOptions: DataSelect[] = Object.keys(logFilters).map((value) => ({
  value,
  label: logFilters[value],
}));

export function Variables({
  label,
  optionsVariables,
  name,
  onChangeName,
  units,
  onChangeUnits,
  axis,
  onChangeAxis,
  logScale,
  logFilter = 'remove',
  onChangeLog,
}: VariablesProps) {
  return (
    <div className="flex flex-row flex-wrap items-center my-1 shadow sm:rounded-lg">
      <div className="flex flex-row">
        <div className="m-2 font-bold">{label} axis:</div>
        <Select
          className="m-2 w-44"
          label="Variable"
          options={optionsVariables}
          selected={{ label: name, value: name }}
          onSelect={(selected) => onChangeName(selected?.label)}
        />
        <Input
          className="m-2 w-44"
          name={`${label}-units`}
          label="Units"
          placeholder="Units"
          value={units}
          onChange={(e) => onChangeUnits(e.currentTarget.value)}
        />
      </div>
      <div className="flex flex-row">
        <Toggle
          className="m-2 w-44"
          label="Display grid"
          activated={!!axis.displayGridLines}
          onToggle={(val) => onChangeAxis({ ...axis, displayGridLines: val })}
        />
        <Toggle
          className="m-2 w-44"
          label="Secondary ticks"
          activated={!axis.hiddenSecondaryTicks}
          onToggle={(val) =>
            onChangeAxis({ ...axis, hiddenSecondaryTicks: !val })
          }
        />
        <Toggle
          className="m-2 w-44"
          label="Embed ticks"
          activated={!!axis.tickEmbedded}
          onToggle={(val) => onChangeAxis({ ...axis, tickEmbedded: val })}
        />
      </div>
      <div className="flex flex-row">
        {logScale && (
          <Toggle
            className="m-2 w-44"
            label="Logscale"
            activated={axis.scale === 'log'}
            onToggle={(val) =>
              onChangeAxis({
                ...axis,
                scale: val ? 'log' : 'linear',
                labelSpace: val ? 60 : 52,
              })
            }
          />
        )}
        {logScale && axis.scale === 'log' && (
          <Select
            className="m-2 w-52"
            label="Non-positive values"
            options={logOptions}
            selected={{ label: logFilter, value: logFilter }}
            onSelect={(selected) => onChangeLog?.(selected?.value)}
          />
        )}
      </div>
    </div>
  );
}
