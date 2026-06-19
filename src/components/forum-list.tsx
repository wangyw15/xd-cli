import { useEffect, useRef, useState } from 'react';
import { Box, Text, useFocus, useInput } from 'ink';
import type { Forum, ForumInfo } from '@/api/types';
import { ScrollList, ScrollListRef } from 'ink-scroll-list';

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

  const findPrevSubIndex = (from: number): number => {
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
        setSelectedIndex((previous) => findPrevSubIndex(previous));
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
      borderColor={isFocused ? 'whiteBright' : 'gray'}
      flexDirection="column"
    >
      <Box justifyContent="center">
        <Text bold>版面</Text>
      </Box>
      <ScrollList ref={listRef} selectedIndex={selectedIndex}>
        {items.map((item, index) => {
          const isSelected = index === selectedIndex;
          const isActive = index === activeIndex;
          if (item.type === 'header') {
            return (
              <Text key={item.id} bold>
                {item.name}
              </Text>
            );
          }

          return (
            <Text
              key={item.id}
              color={isSelected ? 'blue' : isActive ? 'yellow' : undefined}
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
