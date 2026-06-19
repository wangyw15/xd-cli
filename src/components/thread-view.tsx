import { useEffect, useRef, useState } from 'react';
import { Box, Text, useFocus, useFocusManager, useInput } from 'ink';
import { ScrollList, type ScrollListRef } from 'ink-scroll-list';
import type { ForumThread, Thread, ThreadReply, ThreadBase } from '@/api/types';
import type { NmbxdClient } from '@/api/client';
import { useTheme } from '@/theme';
import { stripHtmlTags } from '@/utils';

type ThreadViewProps = {
  id?: string;
  thread: ForumThread;
  client: NmbxdClient;
};

type ThreadItem = ThreadBase | ThreadReply;

export default function ThreadView({ id, thread, client }: ThreadViewProps) {
  const theme = useTheme();
  const focusId = id ?? 'thread-view';
  const { isFocused } = useFocus({ id: focusId, autoFocus: false });
  const { focus } = useFocusManager();
  const listRef = useRef<ScrollListRef>(null);
  const [threadData, setThreadData] = useState<Thread | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    focus(focusId);
  });

  useEffect(() => {
    setSelectedIndex(0);
    client
      .getThread(thread.id)
      .then(setThreadData)
      .catch(() => {
        setThreadData(undefined);
      });
  }, [client, thread]);

  const items: ThreadItem[] = threadData
    ? [threadData, ...threadData.Replies]
    : [];

  useInput(
    (_input, key) => {
      if (key.upArrow) {
        setSelectedIndex((previous) => Math.max(previous - 1, 0));
      }

      if (key.downArrow) {
        setSelectedIndex((previous) =>
          Math.min(previous + 1, items.length - 1),
        );
      }
    },
    { isActive: isFocused },
  );

  return (
    <Box height="100%" paddingX={1} flexDirection="column">
      <Box
        justifyContent="center"
        backgroundColor={theme.headerBackground}
        paddingBottom={1}
      >
        <Text bold color={theme.header}>No.{thread.id}</Text>
      </Box>
      <ScrollList ref={listRef} selectedIndex={selectedIndex}>
        {items.map((item, index) => {
          const isSelected = index === selectedIndex && isFocused;
          return (
            <Box
              width="100%"
              key={item.id}
              backgroundColor={
                isSelected ? theme.selectedBackground : theme.replyBackground
              }
              flexDirection="column"
              marginBottom={1}
              padding={1}
            >
              <Box flexDirection="row" justifyContent="space-between">
                <Box>
                  <Text color={item.admin > 0 ? theme.admin : theme.foreground}>
                    {item.user_hash}
                  </Text>
                  <Text color={theme.foreground}> {item.now}</Text>
                </Box>
                <Text color={theme.foreground}>No.{item.id}</Text>
              </Box>
              <Box marginTop={1}>
                <Text color={theme.foreground}>
                  {stripHtmlTags(item.content)}
                </Text>
              </Box>
            </Box>
          );
        })}
      </ScrollList>
    </Box>
  );
}
