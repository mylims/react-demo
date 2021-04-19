import React, { useEffect, useState } from 'react';
import { Input, useDebounce } from '../tailwind-ui';

interface InputDebounceProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}
interface InputState {
  value: string;
  trigger: 'props' | 'input';
}
export default function InputDebounce({
  name,
  label,
  value,
  onChange,
}: InputDebounceProps) {
  const [state, setState] = useState<InputState>({ value, trigger: 'props' });

  // Update parent state after 100ms
  const debounced = useDebounce(state, 100);
  useEffect(() => {
    if (debounced.trigger === 'input') onChange(debounced.value);
  }, [onChange, debounced]);

  // The value of the input is the same for the one in the parent
  useEffect(() => {
    setState({ value, trigger: 'props' });
  }, [value]);

  return (
    <Input
      className="m-2 w-44"
      name={name}
      label={label}
      placeholder={label}
      value={state.value}
      onChange={(e) => {
        setState({ value: e.currentTarget.value, trigger: 'input' });
      }}
    />
  );
}
