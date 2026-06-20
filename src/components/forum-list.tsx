import { useEffect, useRef, useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import { ScrollList, type ScrollListRef } from 'ink-scroll-list';
import type { Forum, ForumInfo, Timeline } from '@/api/types';
import { useTheme } from '@/theme';
import { stripHtmlTags } from '@/utils';
import { type NmbxdClient } from '@/api';

type ForumListProps = {
  id?: string;
  client: NmbxdClient;
  onSelect?: (item: ForumInfo | Timeline) => void;
};

type ListItem =
  | { type: 'header'; id: string; name: string }
  | { type: 'forum'; id: string; name: string; forum: ForumInfo }
  | { type: 'timeline'; id: string; name: string; timeline: Timeline };

const buildForumItems = (forums: Forum[]): ListItem[] => {
  const items: ListItem[] = [];
  for (const forum of forums) {
    items.push({ type: 'header', id: `h-${forum.id}`, name: forum.name });
    for (const sub of forum.forums) {
      // Ignore timeline
      if (sub.id === '-1') {
        continue;
      }

      items.push({
        type: 'forum',
        id: `f-${sub.id}`,
        name: sub.showName || sub.name,
        forum: sub,
      });
    }
  }

  return items;
};

const buildTimelineItems = (timelines: Timeline[]): ListItem[] => {
  const items: ListItem[] = [{ type: 'header', id: 'h--1', name: '时间线' }];
  for (const timeline of timelines) {
    items.push({
      type: 'timeline',
      id: `t-${timeline.id}`,
      name: timeline.display_name || timeline.name,
      timeline,
    });
  }

  return items;
};

export default function ForumList({
  id,
  client,
  onSelect: onSelectItem,
}: ForumListProps) {
  const theme = useTheme();
  const { isFocused } = useFocus({ id, autoFocus: true });
  const listRef = useRef<ScrollListRef>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [items, setItems] = useState<ListItem[]>([]);

  useEffect(() => {
    (async () => {
      const forums = await client.getForumList();
      const timelines = await client.getTimelineList();
      setItems([...buildTimelineItems(timelines), ...buildForumItems(forums)]);
    })();
  }, []);

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

      if (key.return) {
        const selected = items[selectedIndex];
        if (selected?.type !== 'header') {
          setActiveIndex(selectedIndex);
          onSelectItem?.(
            selected?.type === 'forum' ? selected.forum : selected.timeline,
          );
        }
      }
    },
    { isActive: isFocused },
  );

  return (
    <Box width="20" height="100%" paddingX={1} flexDirection="column">
      <Box
        justifyContent="center"
        backgroundColor={theme.headerBackground}
        paddingBottom={1}
        width="100%"
      >
        <Text bold color={theme.header}>
          版面
        </Text>
      </Box>
      <ScrollList ref={listRef} selectedIndex={selectedIndex}>
        {items.map((item, index) => {
          const isSelected = index === selectedIndex && isFocused;
          const isActive = index === activeIndex;
          const isHeader = item.type === 'header';

          return (
            <Box
              width="100%"
              backgroundColor={
                isSelected ? theme.selectedBackground : undefined
              }
            >
              <Text
                key={item.id}
                color={
                  isActive
                    ? theme.active
                    : isHeader
                      ? theme.forumListHeader
                      : theme.forumListSub
                }
              >
                {isHeader ? '' : '  '}
                {stripHtmlTags(item.name)}
              </Text>
            </Box>
          );
        })}
      </ScrollList>
    </Box>
  );
}
