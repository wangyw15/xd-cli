import { useEffect, useRef, useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import { ScrollList, type ScrollListRef } from 'ink-scroll-list';
import type { ForumInfo, ForumThread } from '@/api/types';
import type { NmbxdClient } from '@/api/client';
import { useTheme } from '@/theme';
import { stripHtmlTags } from '@/utils';

type ForumViewProps = {
  id?: string;
  forum: ForumInfo;
  client: NmbxdClient;
  onSelectThread?: (forum: ForumThread) => void;
};

export default function ForumView({ id, forum, client, onSelectThread }: ForumViewProps) {
  const theme = useTheme();
  const { isFocused } = useFocus({ id, autoFocus: false });
  const listRef = useRef<ScrollListRef>(null);
  const [page, setPage] = useState(1);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
        setSelectedIndex(0);
        setPage((previous) => Math.max(previous - 1, 1));
      }

      if (key.rightArrow) {
        setSelectedIndex(0);
        setPage((previous) => previous + 1);
      }

      if (key.return) {
        const selected = threads[selectedIndex];
        onSelectThread?.(selected);
      }
    },
    { isActive: isFocused },
  );

  return (
    <Box height="100%" paddingX={1} flexDirection="column">
      <Box
        justifyContent="space-between"
        backgroundColor={theme.headerBackground}
        paddingBottom={1}
      >
        <Text>{' '.repeat(6)}</Text>
        <Text bold color={theme.header}>
          {forum.showName || forum.name}
        </Text>
        <Text color={theme.foreground}>第 {page} 页</Text>
      </Box>
      <ScrollList ref={listRef} selectedIndex={selectedIndex}>
        {threads.map((thread, index) => {
          const isSelected = index === selectedIndex && isFocused;
          return (
            <Box
              width="100%"
              key={thread.id}
              backgroundColor={
                isSelected ? theme.selectedBackground : theme.replyBackground
              }
              flexDirection="column"
              marginBottom={1}
              padding={1}
            >
              <Box flexDirection="row" justifyContent="space-between">
                <Box>
                  <Text color={thread.admin > 0 ? theme.admin : theme.foreground}>
                    {thread.user_hash}
                  </Text>
                  <Text color={theme.foreground}> {thread.now}</Text>
                </Box>
                <Text color={theme.foreground}>[{thread.ReplyCount}]</Text>
              </Box>
              {thread.sage === 1 ? (
                <Box>
                  <Text color={theme.sage}>SAGE</Text>
                </Box>
              ) : undefined}
              <Box marginTop={1}>
                <Text color={theme.foreground}>
                  {stripHtmlTags(thread.content)}
                </Text>
              </Box>
            </Box>
          );
        })}
      </ScrollList>
    </Box>
  );
}
