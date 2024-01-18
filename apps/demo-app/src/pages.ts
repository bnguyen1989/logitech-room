import { AirConditionerDemo } from './pages/demos/air-conditioner/AirConditionerDemo.js';
import { CarConfiguratorDemo } from './pages/demos/car-configurator/CarConfiguratorDemo.js';
import { EamesChairDemo } from './pages/demos/eames-chair/EamesChairDemo.js';
import { MalleVendomeCaseViewer } from './pages/demos/malle-vendome/MalleVendomeCaseViewer.js';
import { PageNotFoundPage } from './pages/errors/PageNotFoundPage.js';
import { Home } from './pages/Home.js';

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
    title: 'Home',
    path: '/',
    class: Home,
    special: true
  },
  {
    path: 'demos/eames-chair',
    title: 'Eames Chair',
    class: EamesChairDemo
  },
  {
    path: 'demos/malle-vendome',
    title: 'Malle Vendome Clickable Animations',
    class: MalleVendomeCaseViewer
  },
  {
    path: 'demos/car-configurator',
    title: 'Car Configurator',
    class: CarConfiguratorDemo
  },
  {
    path: 'demos/air-conditioner',
    title: 'Air Conditioner',
    class: AirConditionerDemo
  },
  {
    title: '404',
    path: '*',
    class: PageNotFoundPage,
    special: true
  }
];
