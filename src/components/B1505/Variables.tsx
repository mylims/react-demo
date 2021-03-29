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
}

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
    </div>
  );
}
