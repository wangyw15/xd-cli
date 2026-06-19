import { useEffect, useRef, useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import { ScrollList, type ScrollListRef } from 'ink-scroll-list';
import type { Forum, ForumInfo } from '@/api/types';
import { useTheme } from '@/theme';

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
  const firstSubIndex = items.findIndex((item) => item.type === 'sub');
  const [selectedIndex, setSelectedIndex] = useState(
    firstSubIndex === -1 ? 0 : firstSubIndex,
  );
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (
      items.length > 0 &&
      (selectedIndex >= items.length || items[selectedIndex]?.type !== 'sub')
    ) {
      setSelectedIndex(firstSubIndex === -1 ? 0 : firstSubIndex);
    }
  }, [firstSubIndex, items, selectedIndex]);

  const findNextSubIndex = (from: number): number => {
    for (let index = from + 1; index < items.length; index++) {
      if (items[index]?.type === 'sub') {
        return index;
      }
    }

    return from;
  };

  const findPreviousSubIndex = (from: number): number => {
    for (let index = from - 1; index >= 0; index--) {
      if (items[index]?.type === 'sub') {
        return index;
      }
    }

    return from;
  };

  useInput(
    (_input, key) => {
      if (key.upArrow) {
        setSelectedIndex((previous) => findPreviousSubIndex(previous));
      }

      if (key.downArrow) {
        setSelectedIndex((previous) => findNextSubIndex(previous));
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
    <Box
      width="20%"
      height="100%"
      borderStyle="round"
      paddingX={1}
      borderColor={isFocused ? theme.borderFocused : theme.border}
      flexDirection="column"
    >
      <Box justifyContent="center" backgroundColor={theme.headerBackground}>
        <Text bold color={theme.header}>
          版面
        </Text>
      </Box>
      <ScrollList ref={listRef} selectedIndex={selectedIndex}>
        {items.map((item, index) => {
          if (item.type === 'header') {
            return (
              <Text key={item.id} bold color={theme.foreground}>
                {item.name}
              </Text>
            );
          }

          const isSelected = index === selectedIndex;
          const isActive = index === activeIndex;
          return (
            <Text
              key={item.id}
              color={
                isSelected
                  ? theme.selected
                  : isActive
                    ? theme.active
                    : theme.foreground
              }
            >
              {'  '}
              {item.name}
            </Text>
          );
        })}
      </ScrollList>
    </Box>
  );
}
