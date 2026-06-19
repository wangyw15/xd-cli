import { useEffect, useReducer, useState } from 'react';
import { Box, useStdout, useApp, useInput, useFocusManager } from 'ink';
import { NmbxdClient } from '@/api/client.js';
import type { Forum, ForumInfo, ForumThread } from '@/api/types';
import ForumList from '@/components/forum-list';
import ForumView from '@/components/forum-view';
import ThreadView from '@/components/thread-view';
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
  const [selectedThread, setSelectedThread] = useState<ForumThread | undefined>(
    undefined,
  );
  const [isForumListVisible, setIsForumListVisible] = useState(true);
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
      if (selectedThread) {
        setSelectedThread(undefined);
        focus('forum-view');
      } else{
        exit();
      }
    }

    if (input === 's') {
      setIsForumListVisible((previous) => !previous);
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
          />
        ) : undefined}
      </Box>
    </ThemeProvider>
  );
}
