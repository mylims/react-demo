import React from 'react';
import { Input, Select } from '../tailwind-ui';

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
}

export function Variables({
  label,
  optionsVariables,
  name,
  onChangeName,
  units,
  onChangeUnits,
}: VariablesProps) {
  return (
    <div className="flex flex-row shadow sm:rounded-lg">
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
  );
}
