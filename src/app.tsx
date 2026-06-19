import { useEffect, useReducer, useState } from 'react';
import { Box, useStdout, useApp, useInput, useFocusManager } from 'ink';
import { NmbxdClient } from '@/api/client.js';
import type { Forum, ForumInfo } from '@/api/types';
import ForumList from '@/components/forum-list';
import ForumView from '@/components/forum-view';
import { ThemeProvider, defaultTheme } from '@/theme';

const client = new NmbxdClient();

export default function App() {
  const { stdout } = useStdout();
  const { exit } = useApp();
  const { focus } = useFocusManager();

  const [width, setWidth] = useState(stdout.columns);
  const [height, setHeight] = useState(stdout.rows);
  const [forums, setForums] = useState<Forum[]>([]);
  const [selectedForum, setSelectedForum] = useState<ForumInfo | undefined>(
    undefined,
  );
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  stdout.on('resize', () => {
    setWidth(stdout.columns);
    setHeight(stdout.rows);
  });

  useEffect(() => {
    stdout.write('\x1B[?1049h');
    forceUpdate();

    return () => {
      stdout.write('\x1B[?1049l');
    };
  }, [stdout]);

  useEffect(() => {
    if (selectedForum) {
      focus('forum-view');
    }
  }, [selectedForum, focus]);

  useEffect(() => {
    client.getForumList().then(setForums);
  }, []);

  useInput((input, key) => {
    if (input === 'q' || key.escape) {
      exit();
    }
  });

  return (
    <ThemeProvider value={defaultTheme}>
      <Box
        width={width}
        height={height}
        flexDirection="row"
        backgroundColor={defaultTheme.background}
      >
        <ForumList
          id="forum-list"
          forums={forums}
          onSelectForum={setSelectedForum}
        />
        {selectedForum ? (
          <ForumView id="forum-view" forum={selectedForum} client={client} />
        ) : (
          <Box
            flexGrow={1}
            height="100%"
            borderStyle="round"
            paddingX={1}
            borderColor={defaultTheme.border}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}
