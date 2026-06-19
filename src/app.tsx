import { useEffect, useState } from 'react';
import { Box, useStdout, useApp, useInput, useFocusManager } from 'ink';
import { NmbxdClient } from '@/api/client.js';
import type { Forum, ForumInfo, ForumThread } from '@/api/types';
import ForumList from '@/components/forum-list';
import ForumView from '@/components/forum-view';
import ThreadView from '@/components/thread-view';
import { ThemeProvider, defaultTheme, pttTheme } from '@/theme';
import {
  type Configuration,
  DEFAULT_CONFIG,
  getCookie,
  loadConfig,
} from '@/config';

const client = new NmbxdClient();

export default function App() {
  const { stdout } = useStdout();
  const { exit } = useApp();
  const { focus } = useFocusManager();

  const themes = [defaultTheme, pttTheme];

  const [width, setWidth] = useState(stdout.columns);
  const [height, setHeight] = useState(stdout.rows);
  const [forums, setForums] = useState<Forum[]>([]);
  const [selectedForum, setSelectedForum] = useState<ForumInfo | undefined>(
    undefined,
  );
  const [selectedThread, setSelectedThread] = useState<ForumThread | undefined>(
    undefined,
  );
  const [isForumListVisible, setIsForumListVisible] = useState(true);
  const [theme, setTheme] = useState(defaultTheme);
  const [themeIndex, setThemeIndex] = useState(0);
  const [config, setConfig] = useState<Configuration>(DEFAULT_CONFIG);

  stdout.on('resize', () => {
    setWidth(stdout.columns);
    setHeight(stdout.rows);
  });

  useEffect(
    () => () => {
      stdout.write('\u{1B}[?1049l');
    },
    [stdout],
  );

  useEffect(() => {
    if (selectedForum) {
      focus('forum-view');
    }
  }, [selectedForum, focus]);

  useEffect(() => {
    void client.getForumList().then(setForums);
    loadConfig()
      .then((data) => {
        setConfig(data);
        client.setUserhash(getCookie(data)?.cookie);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setTheme(themes[themeIndex]);
  }, [themeIndex]);

  useInput((input, key) => {
    if (input === 'q' || key.escape) {
      if (selectedThread) {
        setSelectedThread(undefined);
        focus('forum-view');
      } else {
        exit();
      }
    }

    if (input === 's') {
      setIsForumListVisible((previous) => !previous);
    } else if (input === 't') {
      setThemeIndex((previous) =>
        previous === themes.length - 1 ? 0 : previous + 1,
      );
    }
  });

  return (
    <ThemeProvider value={theme}>
      <Box
        width={width}
        height={height}
        flexDirection="row"
        backgroundColor={theme.background}
      >
        <Box
          width="100%"
          height="100%"
          display={selectedThread ? 'none' : 'flex'}
        >
          {isForumListVisible ? (
            <ForumList
              id="forum-list"
              forums={forums}
              onSelectForum={setSelectedForum}
            />
          ) : undefined}
          {selectedForum ? (
            <ForumView
              id="forum-view"
              forum={selectedForum}
              client={client}
              onSelectThread={setSelectedThread}
            />
          ) : (
            <Box height="100%" />
          )}
        </Box>
        {selectedThread ? (
          <ThreadView
            id="thread-view"
            thread={selectedThread}
            client={client}
            tips={config.tips}
          />
        ) : undefined}
      </Box>
    </ThemeProvider>
  );
}
