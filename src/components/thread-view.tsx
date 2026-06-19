import { useEffect, useRef, useState } from 'react';
import { Box, Text, useFocus, useFocusManager, useInput } from 'ink';
import { ScrollList, type ScrollListRef } from 'ink-scroll-list';
import type { ForumThread, Thread, ThreadReply } from '@/api/types';
import type { NmbxdClient } from '@/api/client';
import { useTheme } from '@/theme';
import { stripHtmlTags } from '@/utils';

type ThreadViewProps = {
  id?: string;
  thread: ForumThread;
  client: NmbxdClient;
  tips?: boolean;
};

type ThreadItem = Thread | ThreadReply;

export default function ThreadView({
  id,
  thread,
  client,
  tips,
}: ThreadViewProps) {
  const theme = useTheme();
  const focusId = id ?? 'thread-view';
  const { isFocused } = useFocus({ id: focusId, autoFocus: false });
  const { focus } = useFocusManager();
  const listRef = useRef<ScrollListRef>(null);
  const [replyItems, setThreadItems] = useState<ThreadItem[]>([]);
  const [replyCount, setReplyCount] = useState(0);
  const [tipsCount, setTipsCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isTipsVisible, setTipsVisible] = useState(tips ?? true);

  const removeTips = (replies: ThreadItem[]) =>
    replies.filter((reply) => reply.user_hash !== 'Tips');

  useEffect(() => {
    focus(focusId);
  });

  useEffect(() => {
    setReplyCount(
      replyItems.filter((reply) => reply.user_hash !== 'Tips').length,
    );
    if (isTipsVisible) {
      setTipsCount(
        replyItems.filter((reply) => reply.user_hash === 'Tips').length,
      );
    }
  }, [replyItems]);

  useEffect(() => {
    setSelectedIndex(0);
    setPage(1);
    client
      .getThread(thread.id, 1)
      .then((data) => {
        let replies = data.Replies;
        if (!isTipsVisible) {
          replies = removeTips(replies);
        }

        setThreadItems([data, ...replies]);
      })
      .catch(() => {
        setThreadItems([]);
      });
  }, [thread]);

  useEffect(() => {
    if (page === 1 || replyCount === thread.ReplyCount) {
      return;
    }

    setIsLoading(true);
    client
      .getThread(thread.id, page)
      .then((data) => {
        setThreadItems((previous) => {
          const existingIds = new Set(previous.map((reply) => reply.id));
          let newReplies = data.Replies.filter(
            (reply) => !existingIds.has(reply.id),
          );
          if (!isTipsVisible) {
            newReplies = removeTips(newReplies);
          }

          return [...previous, ...newReplies];
        });
      })
      .catch(() => {
        // Keep existing data on error
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [page]);

  useInput(
    (_input, key) => {
      if (key.upArrow) {
        setSelectedIndex((previous) => Math.max(previous - 1, 0));
      }

      if (key.downArrow) {
        setSelectedIndex((previous) =>
          Math.min(previous + 1, replyItems.length - 1),
        );
        if (
          selectedIndex === replyItems.length - 1 &&
          !isLoading &&
          replyCount < (thread.ReplyCount ?? Infinity)
        ) {
          setPage((previousPage) => previousPage + 1);
        }
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
          No.{thread.id}
        </Text>
        <Text bold color={theme.header}>
          {selectedIndex + 1} / {(thread.ReplyCount ?? 0) + 1 + tipsCount}
        </Text>
      </Box>
      <ScrollList ref={listRef} selectedIndex={selectedIndex}>
        {replyItems.map((item, index) => {
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
