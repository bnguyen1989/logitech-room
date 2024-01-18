export const defaultTheme = {
  primaryColor: '#1890ff',
  linkColor: '#1890ff'
} as const;

export type Theme = typeof defaultTheme;

const themes: Record<string, Theme> = { default: defaultTheme };

export default themes;
