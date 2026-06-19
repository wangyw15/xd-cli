import { createContext, useContext } from 'react';

export type Theme = {
  name: string;
  background: string;
  foreground: string;
  header: string;
  headerBackground: string;
  active: string;
  selectedBackground: string;

  // ForumList
  forumListHeader: string;
  forumListSub: string;

  // ForumView
  sage: string;
  link: string;
  admin: string;
  // po: string;
  replyBackground: string;
};

export const defaultTheme: Theme = {
  name: 'default',
  background: '#FFFFEE',
  foreground: '#800000',
  header: '#CC0000',
  headerBackground: '#F0E68C',
  active: '#FF6600',
  selectedBackground: '#eeaa88',

  forumListHeader: '#cc0000',
  forumListSub: '#0077dd',

  sage: '#D85030',
  link: '#0000EE',
  admin: '#FF0000',
  // po: '#008000',
  replyBackground: '#FFF8DC',
};

export const ThemeContext = createContext<Theme>(defaultTheme);

export const useTheme = (): Theme => useContext(ThemeContext);

export const ThemeProvider = ThemeContext.Provider;
