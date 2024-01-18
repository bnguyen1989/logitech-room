import { Fragment } from 'react';

import CaretRight from '../../icons/CaretRight.js';
import { IconWrapper, Label, Wrapper } from './breadcrumbs.styles.js';

export interface BreadcrumbsProps {
  path: Array<{
    label: string;
    url: string;
  }>;
}

const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { path } = props;
  return (
    <Wrapper>
      {path.map((el, i) => (
        <Fragment key={`breadcrumb-${el.label}`}>
          {!!i && (
            <IconWrapper>
              <CaretRight size="14px" />
            </IconWrapper>
          )}
          <Label>{el.label}</Label>
        </Fragment>
      ))}
    </Wrapper>
  );
};

export default Breadcrumbs;
