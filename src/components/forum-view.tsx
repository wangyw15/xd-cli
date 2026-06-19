import { useEffect, useRef, useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import { ScrollList, type ScrollListRef } from 'ink-scroll-list';
import type { ForumInfo, ForumThread } from '@/api/types';
import type { NmbxdClient } from '@/api/client';
import { useTheme } from '@/theme';

type ForumViewProps = {
  id?: string;
  forum: ForumInfo;
  client: NmbxdClient;
};

export default function ForumView({ id, forum, client }: ForumViewProps) {
  const theme = useTheme();
  const { isFocused } = useFocus({ id, autoFocus: false });
  const listRef = useRef<ScrollListRef>(null);
  const [page, setPage] = useState(1);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    setPage(1);
    setSelectedIndex(0);
    client
      .showf(Number(forum.id), 1)
      .then(setThreads)
      .catch(() => {
        setThreads([]);
      });
  }, [client, forum]);

  useEffect(() => {
    client
      .showf(Number(forum.id), page)
      .then(setThreads)
      .catch(() => {
        setThreads([]);
      });
  }, [client, forum, page]);

  useInput(
    (_input, key) => {
      if (key.upArrow) {
        setSelectedIndex((previous) => Math.max(previous - 1, 0));
      }

      if (key.downArrow) {
        setSelectedIndex((previous) =>
          Math.min(previous + 1, threads.length - 1),
        );
      }

      if (key.leftArrow) {
        setPage((previous) => Math.max(previous - 1, 1));
      }

      if (key.rightArrow) {
        setPage((previous) => previous + 1);
      }
    },
    { isActive: isFocused },
  );

  return (
    <Box
      flexGrow={1}
      height="100%"
      borderStyle="round"
      paddingX={1}
      borderColor={isFocused ? theme.borderFocused : theme.border}
      backgroundColor={theme.background}
      flexDirection="column"
    >
      <Box
        justifyContent="space-between"
        backgroundColor={theme.headerBackground}
      >
        <Text bold color={theme.header}>
          {forum.showName.length > 0 ? forum.showName : forum.name}
        </Text>
        <Text color={theme.foreground}>第 {page} 页</Text>
      </Box>
      <ScrollList ref={listRef} selectedIndex={selectedIndex}>
        {threads.map((thread, index) => {
          const isSelected = index === selectedIndex;
          return (
            <Box
              width="100%"
              key={thread.id}
              borderStyle="round"
              borderColor={isSelected ? theme.selected : theme.border}
              backgroundColor={theme.replyBackground}
              flexDirection="column"
              paddingBottom={1}
            >
              <Box flexDirection="row" justifyContent="space-between">
                <Text color={theme.foreground}>
                  {thread.user_hash} {thread.now}
                </Text>
                <Text color={theme.foreground}>[{thread.ReplyCount}]</Text>
              </Box>
              {thread.sage === 1 ? (
                <Box>
                  <Text color={theme.sage}>SAGE</Text>
                </Box>
              ) : undefined}
              <Box paddingTop={1}>
                <Text color={theme.foreground}>{thread.content}</Text>
              </Box>
            </Box>
          );
        })}
      </ScrollList>
    </Box>
  );
}
