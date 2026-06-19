import { useRef, useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import { ScrollList, type ScrollListRef } from 'ink-scroll-list';
import type { Forum, ForumInfo } from '@/api/types';
import { useTheme } from '@/theme';
import { stripHtmlTags } from '@/utils';

type ForumListProps = {
  id?: string;
  forums: Forum[];
  onSelectForum?: (forum: ForumInfo) => void;
};

type ListItem =
  | { type: 'header'; id: string; name: string }
  | { type: 'sub'; id: string; name: string; forum: ForumInfo };

const buildItems = (forums: Forum[]): ListItem[] => {
  const items: ListItem[] = [];
  for (const forum of forums) {
    items.push({ type: 'header', id: `h-${forum.id}`, name: forum.name });
    for (const sub of forum.forums) {
      items.push({
        type: 'sub',
        id: `s-${sub.id}`,
        name: sub.showName || sub.name,
        forum: sub,
      });
    }
  }

  return items;
};

export default function ForumList({
  id,
  forums,
  onSelectForum,
}: ForumListProps) {
  const theme = useTheme();
  const { isFocused } = useFocus({ id, autoFocus: true });
  const listRef = useRef<ScrollListRef>(null);
  const items = buildItems(forums);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

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
        if (selected?.type === 'sub') {
          setActiveIndex(selectedIndex);
          onSelectForum?.(selected.forum);
        }
      }
    },
    { isActive: isFocused },
  );

  return (
    <Box width="20" height="100%" paddingX={1} flexDirection="column">
      <Box justifyContent="center" backgroundColor={theme.headerBackground}>
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
