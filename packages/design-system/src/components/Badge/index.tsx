import type React from 'react';
import { cloneElement, useEffect, useRef } from 'react';

import { Wrapper } from './badge.styles.js';

interface BadgeProps {
  children: React.ReactElement;
  label: string | number;
}

const Badge = (props: BadgeProps) => {
  const { label, children } = props;
  const childRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!childRef.current || !badgeRef.current) return;

    const { top, bottom, left, right } =
      childRef.current.getBoundingClientRect();

    const deltaX = Math.abs(left - right);
    const deltaY = Math.abs(top - bottom);

    badgeRef.current.style.position = `absolute`;
    badgeRef.current.style.bottom = `calc(${deltaY}px - 4px)`;
    badgeRef.current.style.left = `calc(${deltaX}px - 4px)`;
  }, [children]);

  return (
    <>
      {cloneElement(children, { ref: childRef })}
      <Wrapper ref={badgeRef}>
        <div>{label}</div>
      </Wrapper>
    </>
  );
};

export default Badge;
