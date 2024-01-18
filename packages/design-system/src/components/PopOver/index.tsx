import type React from 'react';
import { cloneElement, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { createOrGetElement } from '../../utils.js';

export enum PopOverOrientation {
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_CENTER = 'bottom-center',
  BOTTOM_RIGHT = 'bottom-right',
  TOP_LEFT = 'top-left',
  TOP_CENTER = 'top-center',
  TOP_RIGHT = 'top-right'
}

export interface PopOverProps {
  orientation?: PopOverOrientation;
  children: React.ReactElement;
  content?: React.ReactNode | React.ReactNode[];
}

const PopOver = (props: PopOverProps) => {
  const {
    orientation = PopOverOrientation.BOTTOM_LEFT,
    children,
    content
  } = props;
  const modalIdRef = useRef(`tk-popover-${Date.now()}`);
  const elRef = useRef(createOrGetElement(modalIdRef.current));
  const childRef = useRef<HTMLButtonElement>(null);
  const [showPopOver, setShowPopOver] = useState(false);

  useEffect(() => {
    const modalEl = elRef.current;
    return () => modalEl.remove();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (!e) return;
      if (childRef.current?.contains(e.target as Node)) return;
      if (!elRef.current?.contains(e.target as Node)) setShowPopOver(false);
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  const handleTogglePopOver = () => {
    if (!childRef.current) return;
    if (!elRef.current) return;
    const { top, bottom, left, right } =
      childRef.current.getBoundingClientRect();

    if (orientation === PopOverOrientation.BOTTOM_LEFT) {
      elRef.current.style.top = `calc(${bottom}px + 4px)`;
      elRef.current.style.left = `${left}px`;
    } else if (orientation === PopOverOrientation.BOTTOM_CENTER) {
      elRef.current.style.top = `calc(${bottom}px + 4px)`;
      elRef.current.style.left = `${left + (right - left) / 2}px`;
      elRef.current.style.transform = `translateX(-50%)`;
    } else if (orientation === PopOverOrientation.BOTTOM_RIGHT) {
      elRef.current.style.top = `calc(${bottom}px + 4px)`;
      elRef.current.style.left = `${right}px`;
      elRef.current.style.transform = `translateX(-100%)`;
    } else if (orientation === PopOverOrientation.TOP_LEFT) {
      elRef.current.style.top = `calc(${top}px - 4px)`;
      elRef.current.style.transform = `translateY(-100%)`;
      elRef.current.style.left = `${left}px`;
    } else if (orientation === PopOverOrientation.TOP_CENTER) {
      elRef.current.style.top = `calc(${top}px - 4px)`;
      elRef.current.style.transform = `translateX(-50%) translateY(-100%)`;
      elRef.current.style.left = `${left + (right - left) / 2}px`;
    } else if (orientation === PopOverOrientation.TOP_RIGHT) {
      elRef.current.style.top = `calc(${top}px - 4px)`;
      elRef.current.style.left = `${right}px`;
      elRef.current.style.transform = `translateX(-100%) translateY(-100%)`;
    }

    setShowPopOver(!showPopOver);
  };

  return (
    <>
      {cloneElement(children, {
        ref: childRef,
        onClick: handleTogglePopOver
      })}
      {showPopOver && createPortal(content, elRef.current)}
    </>
  );
};

export default PopOver;
