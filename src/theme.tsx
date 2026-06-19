import { createContext, useContext } from 'react';

export type Theme = {
  name: string;
  background: string;
  foreground: string;
  border: string;
  borderFocused: string;
  header: string;
  headerBackground: string;
  selected: string;
  active: string;
  sage: string;
  link: string;
  admin: string;
  po: string;
  replyBackground: string;
};

export const defaultTheme: Theme = {
  name: 'default',
  background: '#FEFEE2',
  foreground: '#800000',
  border: '#D4A76A',
  borderFocused: '#800000',
  header: '#CC0000',
  headerBackground: '#F0E68C',
  selected: '#0000EE',
  active: '#FF6600',
  sage: '#006600',
  link: '#0000EE',
  admin: '#FF0000',
  po: '#008000',
  replyBackground: '#FFF8DC',
};

export const ThemeContext = createContext<Theme>(defaultTheme);

export const useTheme = (): Theme => useContext(ThemeContext);

export const ThemeProvider = ThemeContext.Provider;
