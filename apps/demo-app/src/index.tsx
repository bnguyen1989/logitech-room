import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { pages } from './pages.js';
import { store } from './store/index.ts';

const rootElement = document.getElementById('root')!;
createRoot(rootElement).render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
        <Routes>
          {pages.map((page) => {
            return (
              <Route
                path={page.path}
                element={<page.class />}
                key={page.path}
              />
            );
          })}
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </Provider>
);
