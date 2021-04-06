import React, { useEffect, useState } from 'react';
import { Input, useDebounce } from '../tailwind-ui';

interface InputDebounceProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function InputDebounce({
  name,
  label,
  value,
  onChange,
}: InputDebounceProps) {
  const [state, setState] = useState(value);

  // Update parent state after 100ms
  const debounced = useDebounce(state, 100);
  useEffect(() => {
    if (debounced !== value && Number(debounced) !== Number(value)) {
      onChange(debounced);
    }

    // Each time that value gets updated it was triggered
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, debounced]);

  // The value of the input is the same for the one in the parent
  useEffect(() => {
    setState(value);
  }, [value]);

  return (
    <Input
      className="m-2 w-44"
      name={name}
      label={label}
      placeholder={label}
      value={state}
      onChange={(e) => setState(e.currentTarget.value)}
    />
  );
}
