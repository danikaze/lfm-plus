import { useMemo, MouseEventHandler } from 'react';
import type {
  ClickablePopupMenuItem,
  PopupMenuItem,
  PopupMenuSeparator,
  Props,
} from '.';

export type ProcessedPopupMenuItem =
  | PopupMenuSeparator
  | (Omit<ClickablePopupMenuItem, 'onClick'> & {
      onClick: MouseEventHandler<HTMLDivElement>;
    });

export function usePopupMenu({ items, onClose }: Props) {
  const processedItems = useMemo(() => processItems(items, onClose), [items]);

  const closeMenu = useMemo<MouseEventHandler<HTMLElement> | undefined>(
    () => (ev) => {
      ev.stopPropagation();
      onClose();
    },
    [onClose]
  );

  return {
    processedItems,
    closeMenu,
  };
}

function processItems(
  items: PopupMenuItem[],
  close: () => void
): ProcessedPopupMenuItem[] {
  return items.map((item) =>
    isSeparator(item)
      ? item
      : {
          ...item,
          onClick: (ev) => {
            ev.stopPropagation();
            item.onClick();
            close();
          },
        }
  );
}

function isSeparator(item: ProcessedPopupMenuItem): item is PopupMenuSeparator {
  return typeof item === 'string';
}
