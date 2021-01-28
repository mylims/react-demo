import clsx from 'clsx';
import React, { ReactElement } from 'react';

import { OptionField } from '../formik/GroupOptionField';

export interface GroupOptionProps {
  children: ReactElement<OptionProps> | Array<React.ReactElement<OptionProps>>;
}

export interface OptionProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  id: string;
  name: string;
  description: string;
}

export function GroupOption(props: GroupOptionProps): JSX.Element {
  if (Array.isArray(props.children)) {
    const lastChildIndex = props.children.length - 1;
    return (
      <div>
        {props.children.map((option, index) => {
          return (
            <div
              key={option.props.id}
              className={clsx('border border-neutral-200', {
                'rounded-tl-md rounded-tr-md': index === 0,
                'border-b-0': index !== lastChildIndex,
                'rounded-bl-md rounded-br border-b-1': index === lastChildIndex,
              })}
            >
              {option}
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <div className="border border-neutral-200 rounded-tl-md rounded-bl-md rounded-br">
        {props.children}
      </div>
    );
  }
}

GroupOption.Option = (props: OptionProps): JSX.Element => {
  const { label, description, name, id, value, checked, ...otherProps } = props;
  return (
    <label htmlFor={id}>
      <div
        className={clsx('p-4 flex', {
          'bg-primary-50 border-primary-200 z-10': checked,
        })}
      >
        <div className="flex items-center h-5">
          <input
            type="radio"
            name={name}
            value={value}
            id={id}
            className="focus:ring-primary-500 h-4 w-4 text-primary-600 cursor-pointer border-gray-300"
            checked={checked}
            {...otherProps}
          />
        </div>
        <label htmlFor={id} className="ml-3 flex flex-col cursor-pointer">
          <span
            className={clsx('block text-sm font-medium', {
              'text-neutral-900': !checked && !props.disabled,
              'text-primary-900': checked,
              'text-neutral-500': props.disabled,
            })}
          >
            {label}
          </span>
          <span
            className={clsx('block text-sm', {
              'text-neutral-500': !checked,
              'text-primary-700': checked,
            })}
          >
            {description}
          </span>
        </label>
      </div>
    </label>
  );
};

GroupOption.OptionField = OptionField;
