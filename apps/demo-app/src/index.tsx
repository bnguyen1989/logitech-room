import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { pages } from './pages.js';

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {pages.map((page) => {
          return (
            <Route path={page.path} element={<page.class />} key={page.path} />
          );
        })}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
