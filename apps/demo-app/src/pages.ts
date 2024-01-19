import { Configurator } from './pages/configurator/Configurator.tsx';
import { PageNotFoundPage } from './pages/errors/PageNotFoundPage.js';

export type ExampleUrl = {
  title: string;
  params: Record<string, string>;
};

export type Page = {
  title: string;
  path: string;
  class: any;
  special?: true;
  examples?: ExampleUrl[];
};

export const pages: Page[] = [
  {
    title: 'Logitech',
    path: '/',
    class: Configurator
  },
  {
    title: '404',
    path: '*',
    class: PageNotFoundPage,
    special: true
  }
];
