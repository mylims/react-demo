import React, { useEffect, useState } from 'react';
import { Input, useDebounce } from '../tailwind-ui';

interface InputDebounceProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}
interface State {
  value: string;
  trigger: 'event' | 'parent';
}

export default function InputDebounce({
  name,
  label,
  value,
  onChange,
}: InputDebounceProps) {
  const [state, setState] = useState<State>({ value, trigger: 'parent' });

  // Update parent state after 100ms
  const debounced = useDebounce(state, 500);
  useEffect(() => {
    if (debounced.trigger === 'event') onChange(debounced.value);
  }, [onChange, debounced]);

  // The value of the input is the same for the one in the parent
  useEffect(() => {
    setState({ value, trigger: 'parent' });
  }, [value]);

  return (
    <Input
      className="m-2 w-44"
      name={name}
      label={label}
      placeholder={label}
      value={state.value}
      onChange={({ currentTarget: { value } }) => {
        setState({ value, trigger: 'event' });
      }}
    />
  );
}
