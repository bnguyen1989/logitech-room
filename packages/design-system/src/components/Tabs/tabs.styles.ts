import { styled } from 'styled-components';

interface TabWrapperProps {
  selected?: boolean;
}

export const TabsWrapper = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.primaryColor};
`;

export const Tab = styled.div<TabWrapperProps>`
  transform: translateY(1px);

  cursor: pointer;
  width: max-content;
  padding: 10px 2px;
  margin: 0px 15px;

  border-bottom: ${(props) =>
    props.selected ? `2px solid ${props.theme.primaryColor}` : 'none'};

  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.selected ? props.theme.primaryColor : '#666')};

  &:hover {
    color: ${(props) => props.theme.primaryColor};
  }
`;

export const TabContent = styled.div`
  padding: 10px;
`;
