import { useEffect, useRef, useState } from 'react';

export interface DropdownProps {
  options: Array<{
    label: string;
    selected: boolean;
    visible: boolean;
    value: any;
  }>;
  onSelect: (value: any) => void;
}

export const Dropdown = (props: DropdownProps) => {
  const [show, setShow] = useState(false);
  const { options, onSelect } = props;

  const ref = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (!e) return;
      if (!ref.current?.contains(e.target as Node)) setShow(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, ref]);

  const label = options.find((opt) => opt.selected)?.label;

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setShow(!show)}
        >
          {label ?? 'Select an option'}
          <svg
            className="-mr-1 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      {show ? (
        <div
          ref={ref}
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {options.map((option, i) => {
              if (!option.visible) return null;
              return (
                <a
                  href="#"
                  className={`${
                    option.selected
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700'
                  } block px-4 py-2 text-sm`}
                  role="menuitem"
                  tabIndex={-1}
                  id={`menu-item-${i}`}
                  onClick={() => onSelect(option.value)}
                >
                  {option.label}
                </a>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
