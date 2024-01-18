import 'styled-components';

import { Theme } from './theme.js';

declare module 'styled-components' {
  export type DefaultTheme = Theme;
}
