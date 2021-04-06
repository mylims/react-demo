import React from 'react';
import { AxisProps } from 'react-plot';
import { Select, Toggle } from '../tailwind-ui';
import InputDebounce from './InputDebounce';

interface DataSelect {
  label: string;
  value: string;
}
type StateAxis = Partial<AxisProps> & { duplicate: boolean };
interface VariablesProps {
  label: string;
  optionsVariables: DataSelect[];
  name: string;
  onChangeName: (name?: string) => void;
  units: string;
  onChangeUnits: (units: string) => void;
  axis: StateAxis;
  onChangeAxis: (value: StateAxis) => void;
  logScale: boolean;
  logFilter?: string;
  onChangeLog?: (value: string) => void;
}

const logFilters: Record<string, string> = {
  abs: 'Take absolute value',
  remove: 'Remove non-positives',
};

const logOptions: DataSelect[] = Object.keys(logFilters).map((value) => ({
  value,
  label: logFilters[value],
}));

const defaultFilter = 'abs';

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
  logFilter = defaultFilter,
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
        <InputDebounce
          name={`${label}-units`}
          label="Units"
          value={units}
          onChange={(val) => onChangeUnits(val)}
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
        <Toggle
          className="m-2 w-44"
          label="Duplicate axis"
          activated={!!axis.duplicate}
          onToggle={(val) => onChangeAxis({ ...axis, duplicate: val })}
        />
      </div>
      <div className="flex flex-row">
        <InputDebounce
          name={`${label}-min`}
          label="Min value"
          value={axis.min !== undefined ? String(axis.min) : ''}
          onChange={(value) =>
            onChangeAxis({ ...axis, min: value ? Number(value) : undefined })
          }
        />
        <InputDebounce
          name={`${label}-max`}
          label="Max value"
          value={axis.max !== undefined ? String(axis.max) : ''}
          onChange={(value) =>
            onChangeAxis({ ...axis, max: value ? Number(value) : undefined })
          }
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
            onSelect={(selected) =>
              onChangeLog?.(selected?.value || defaultFilter)
            }
          />
        )}
      </div>
    </div>
  );
}
