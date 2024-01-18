import type React from 'react';

import ErrorPage from './ErrorPage.js';

export const PageNotFoundPage: React.FC = () => (
  <ErrorPage errorCode={404} errorMessage="Page Not Found" />
);
