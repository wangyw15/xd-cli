import { useEffect, useRef, useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import { ScrollList, ScrollListRef } from 'ink-scroll-list';
import { NmbxdClient } from '@/api/client';
import type { ForumInfo, ForumThread } from '@/api/types';

type ForumViewProps = {
  id?: string;
  forum: ForumInfo;
  client: NmbxdClient;
};

export default function ForumView({ id, forum, client }: ForumViewProps) {
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
      borderColor={isFocused ? 'whiteBright' : 'gray'}
      flexDirection="column"
    >
      <Box justifyContent="space-between">
        <Text bold>{forum.showName || forum.name}</Text>
        <Text>第 {page} 页</Text>
      </Box>
      <ScrollList ref={listRef} selectedIndex={selectedIndex}>
        {threads.map((thread, index) => {
          const isSelected = index === selectedIndex;
          return (
            <Box
              width="100%"
              key={thread.id}
              borderStyle="round"
              borderColor={isSelected ? 'blue' : undefined}
            >
              <Box flexDirection="column" paddingBottom={1}>
                <Box flexDirection="row">
                  <Text>
                    {thread.user_hash} {thread.now} [{thread.ReplyCount}]
                  </Text>
                </Box>
                {thread.sage === 1 ? (
                  <Box>
                    <Text color="red">SAGE</Text>
                  </Box>
                ) : undefined}
                <Box paddingTop={1}>
                  <Text>{thread.content}</Text>
                </Box>
              </Box>
            </Box>
          );
        })}
      </ScrollList>
    </Box>
  );
}
