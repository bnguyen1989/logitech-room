import type React from 'react';
import { Children, cloneElement, useState } from 'react';

import CaretDown from '../../icons/CaretDown.js';
import { Wrapper } from './accordion.styles.js';

interface AccordionItemProps {
  selected?: boolean;
  label: string;
  handleSelect?: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
}

export type AccordionItemUserProps = Pick<
  AccordionItemProps,
  'label' | 'onClick' | 'children'
>;

interface AccordionProps {
  children:
    | React.FunctionComponentElement<AccordionItemProps>
    | Array<React.FunctionComponentElement<AccordionItemProps>>;
}

const AccordionItem = (props: AccordionItemProps) => {
  const { selected, handleSelect, label, children } = props;
  return (
    <Wrapper selected={selected}>
      <div onClick={handleSelect}>
        <div>{label}</div>
        <div></div>
        <div>
          <CaretDown
          // style={{
          //   transition: `all 0.3s`,
          //   transform: selected ? 'rotate(180deg)' : 'rotate(0)',
          // }}
          />
        </div>
      </div>
      <div>
        <div>{children}</div>
      </div>
    </Wrapper>
  );
};

export const Accordion = (props: AccordionProps) => {
  const [selected, setSelected] = useState<undefined | number>(undefined);

  const handleSelect = (idx: number) =>
    setSelected(idx === selected ? undefined : idx);

  if (!props.children) return null;

  return (
    <ul>
      {Children.map(props.children, (child, idx) => {
        if (child.type !== AccordionItem) return null;
        return cloneElement(child, {
          selected: selected === idx,
          handleSelect: () => {
            child.props.onClick?.();
            handleSelect(idx);
          }
        });
      })}
    </ul>
  );
};

Accordion.AccordionItem = AccordionItem as React.FC<AccordionItemUserProps>;

export default Accordion;
