import type React from 'react';
import { cloneElement, useRef, useState } from 'react';

interface ReorderableListProps {
  children: React.ReactElement[];
}

const ReorderableList = (props: ReorderableListProps) => {
  const { children } = props;
  const [sourceIndex, setSourceIndex] = useState<null | number>(null);
  const targetIndexRef = useRef<null | number>(null);
  const isBelowTargetRef = useRef<null | boolean>(null);
  const [order, setOrder] = useState(children.map((_, idx) => idx));

  const getUpdatedOrder = () => {
    if (
      sourceIndex == null ||
      targetIndexRef.current == null ||
      isBelowTargetRef.current == null
    )
      return console.warn(
        'cannot reoder without target, source and isBelowTarget data'
      );
    return order.reduce((output: number[], idx) => {
      if (idx === sourceIndex) return output;
      if (idx === targetIndexRef.current) {
        if (isBelowTargetRef.current)
          return [...output, idx, sourceIndex as number];
        else return [...output, sourceIndex as number, idx];
      }
      return [...output, idx];
    }, []);
  };

  const setInitialState = () => {
    setSourceIndex(null);
    isBelowTargetRef.current = null;
    targetIndexRef.current = null;
  };

  const handleReorderStart = (index: number) => {
    setSourceIndex(index);
  };

  const handleDrag = (e: React.PointerEvent) => {
    if (sourceIndex == null || targetIndexRef.current == null) return;

    // @ts-ignore
    const { top, height } = e.target.getBoundingClientRect();
    const offsetY = top + window.scrollY;
    const halfPoint = offsetY + height / 2;
    const isHalfway = e.pageY - halfPoint > 0;

    if (isHalfway === isBelowTargetRef.current) return;
    isBelowTargetRef.current = isHalfway;
    if (sourceIndex !== targetIndexRef.current) {
      const updatedOrder = getUpdatedOrder();
      if (updatedOrder) setOrder(updatedOrder);
    }
  };

  const handleDragEnter = (index: number) => {
    if (sourceIndex == null) return;
    targetIndexRef.current = index;
  };

  const handleReorderEnd = () => {
    setInitialState();
  };

  return (
    <ul onPointerLeave={handleReorderEnd}>
      {order.map((idx) => {
        return cloneElement(children[idx], {
          key: `reorderableListEl-${idx}`,
          selected: sourceIndex == null ? null : sourceIndex === idx,
          onPointerDown: () => handleReorderStart(idx),
          onPointerEnter: () => handleDragEnter(idx),
          onPointerMove: handleDrag,
          onPointerUp: handleReorderEnd
        });
      })}
    </ul>
  );
};

export default ReorderableList;
