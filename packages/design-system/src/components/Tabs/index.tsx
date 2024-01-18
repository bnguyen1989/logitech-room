import type React from 'react';
import { Children, useState } from 'react';

import { Tab, TabContent, TabsWrapper } from './tabs.styles.js';

interface TabPaneProps {
  label: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

interface TabsProps {
  children:
    | React.FunctionComponentElement<TabPaneProps>
    | Array<React.FunctionComponentElement<TabPaneProps>>;
}

interface ITabs extends React.FC<TabsProps> {
  TabPane: React.FC<TabPaneProps>;
}

const TabPane = (props: TabPaneProps) => <>{props.children}</>;

export const Tabs: ITabs = ({ children }) => {
  const [selected, setSelected] = useState<undefined | number>(0);

  const handleSelect = (idx: number) => setSelected(idx);

  if (!children) return null;

  return (
    <div>
      <TabsWrapper>
        {Children.map(children, (child, idx) => {
          if (child.type !== TabPane) return null;
          return (
            <Tab
              selected={selected === idx}
              onClick={() => {
                child.props.onClick?.();
                handleSelect(idx);
              }}
            >
              {child.props.label}
            </Tab>
          );
        })}
      </TabsWrapper>
      <TabContent>
        {Children.map(children, (child, idx) => {
          if (child.type !== TabPane) return null;
          if (selected !== idx) return null;
          return child;
        })}
      </TabContent>
    </div>
  );
};

Tabs.TabPane = TabPane;

export default Tabs;
