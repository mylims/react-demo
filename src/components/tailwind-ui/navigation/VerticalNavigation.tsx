import clsx from 'clsx';
import React, { ReactNode } from 'react';

import { useOnOff } from '../hooks/useOnOff';

export type VerticalNavigationRenderOptionCallback<T> = (
  children: ReactNode,
  option: Omit<VerticalNavigationOption<T>, 'renderOption'> & {
    isSelected: boolean;
  },
) => ReactNode;
export interface VerticalNavigationGroupOption<T> {
  type: 'group';
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  options: VerticalNavigationOption<T>[];
}

export interface VerticalNavigationOption<T> {
  type: 'option';
  id: string;
  value: T;
  label?: ReactNode;
  icon?: ReactNode;
  renderOption?: VerticalNavigationRenderOptionCallback<T>;
}

export type VerticalNavigationOptions<T> =
  | VerticalNavigationGroupOption<T>
  | VerticalNavigationOption<T>;

export interface VerticalNavigationProps<T> {
  options: Array<VerticalNavigationOptions<T>>;
  selected: VerticalNavigationOption<T> | undefined;
  onSelect: SelectOptionCallback<T>;
}

type SelectOptionCallback<T> = (selected: VerticalNavigationOption<T>) => void;

export function VerticalNavigation<T>(
  props: VerticalNavigationProps<T>,
): JSX.Element {
  const { onSelect, selected, options } = props;

  const opts = options.map((element) => {
    if (element.type === 'option') {
      return {
        ...element,
        label: element.label || element.value,
      };
    }
    return element;
  });

  return (
    <div className="flex flex-col flex-grow mt-5">
      <nav className="flex-1 px-2 space-y-1 bg-white">
        {opts.map((element) => {
          if (element.type === 'option') {
            return (
              <Navigation
                key={element.id}
                onSelect={() => onSelect(element)}
                element={element}
                selected={selected}
                offset={false}
                renderOption={element.renderOption}
              />
            );
          } else {
            return (
              <NavigationGroup
                key={element.id}
                element={element}
                selected={selected}
                onSelect={onSelect}
              />
            );
          }
        })}
      </nav>
    </div>
  );
}

interface NavigationProps<T> {
  element: VerticalNavigationOption<T>;
  selected: VerticalNavigationOption<T> | undefined;
  onSelect: () => void;
  offset: boolean;
  renderOption?: VerticalNavigationRenderOptionCallback<T>;
}

interface NavigationGroupProps<T> {
  element: VerticalNavigationGroupOption<T>;
  selected?: VerticalNavigationOption<T>;
  onSelect: SelectOptionCallback<T>;
}

function NavigationGroup<T>(props: NavigationGroupProps<T>): JSX.Element {
  const { element, selected, onSelect } = props;
  const [isOpen, , , toggle] = useOnOff(
    element.options.some((element) => element === selected),
  );
  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={toggle}
        className="flex items-center w-full py-2 pl-2 pr-1 text-sm font-medium bg-white rounded-md text-neutral-600 group hover:text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {element.icon && (
          <div className="w-6 h-6 mr-3 text-neutral-400 group-hover:text-neutral-600">
            {props.element.icon}
          </div>
        )}

        {element.label}
        <svg
          className={clsx(
            'ml-auto h-5 w-5 transform group-hover:text-neutral-400 transition-colors ease-in-out duration-150',
            isOpen ? 'text-neutral-500 rotate-90' : 'text-neutral-300',
          )}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
        </svg>
      </button>
      {isOpen
        ? element.options.map((element) => (
            <Navigation
              key={element.id}
              element={element}
              selected={selected}
              onSelect={() => onSelect(element)}
              offset
              renderOption={element.renderOption}
            />
          ))
        : null}
    </div>
  );
}

function Navigation<T>(props: NavigationProps<T>): JSX.Element {
  const isSelected =
    props.selected !== undefined &&
    props.element.value === props.selected.value;
  const item = (
    <span
      onClick={props.onSelect}
      className={clsx(
        'group w-full flex items-center py-2 text-sm font-medium rounded-md cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 text-neutral-600',
        isSelected ? 'bg-neutral-100' : 'bg-white',
        props.offset ? 'pl-11' : 'pl-2',
      )}
    >
      {props.element.icon && (
        <div className="w-6 h-6 mr-3 text-neutral-400 group-hover:text-neutral-600">
          {props.element.icon}
        </div>
      )}
      {props.element.label}
    </span>
  );
  const toRender = props.renderOption
    ? props.renderOption(item, {
        ...props.element,
        isSelected,
      })
    : item;
  return <div className="space-y-1">{toRender}</div>;
}
