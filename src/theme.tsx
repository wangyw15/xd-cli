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
  replyBackground: string;
};

export const defaultTheme: Theme = {
  name: 'default',
  background: '#FFFFEE',
  foreground: '#800000',
  header: '#CC0000',
  headerBackground: '#F0E68C',
  active: '#FF6600',
  selectedBackground: '#e7d0c4',

  forumListHeader: '#cc0000',
  forumListSub: '#0077dd',

  sage: '#D85030',
  link: '#0000EE',
  admin: '#FF0000',
  replyBackground: '#FFF8DC',
};

export const ThemeContext = createContext<Theme>(defaultTheme);

export const useTheme = (): Theme => useContext(ThemeContext);

export const ThemeProvider = ThemeContext.Provider;

// Themes
export const pttTheme: Theme = {
  name: 'ptt',
  background: '#000000',
  foreground: '#999900',
  header: '#ffff66',
  headerBackground: '#0c0a66',
  active: '#FF6600',
  selectedBackground: '#5d5d5d',

  forumListHeader: '#aaaaaa',
  forumListSub: '#aaaaaa',

  sage: '#D85030',
  link: '#0000EE',
  admin: '#FF0000',
  replyBackground: '#111111',
};
