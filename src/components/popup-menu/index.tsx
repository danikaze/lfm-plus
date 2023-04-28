import { FC, ReactNode } from 'react';
import { clsx } from 'clsx';
import { Portal } from '@components/portal';
import { Position, Props as PositionProps } from '@components/position';
import { ProcessedPopupMenuItem, usePopupMenu } from './hooks';

import styles from './popup-menu.module.scss';

export interface Props {
  items: PopupMenuItem[];
  position: Omit<PositionProps, 'children'>;
  className?: string;
  onClose: () => void;
}

export type PopupMenuItem = ClickablePopupMenuItem | PopupMenuSeparator;

export type PopupMenuSeparator = 'separator';

export interface ClickablePopupMenuItem {
  label: ReactNode;
  short?: string;
  disabled?: boolean;
  onClick: () => void;
}

export const PopupMenu: FC<Props> = (props) => {
  const { processedItems, closeMenu } = usePopupMenu(props);
  const options = processedItems.map(renderItem);
  const bg = closeMenu && <div className={styles.bg} onClick={closeMenu} />;
  const positionOptions = {
    ...props.position,
    className: styles.position,
    trackChanges: true,
  } as PositionProps;

  return (
    <Portal>
      {bg}
      <Position {...positionOptions}>
        <div className={clsx(styles.root, props.className)}>{options}</div>;
      </Position>
    </Portal>
  );
};

function renderItem(item: ProcessedPopupMenuItem, index: number): JSX.Element {
  if (isSeparator(item)) {
    return <div className={styles.separator} />;
  }
  const short = item.short && <div className={styles.short}>{item.short}</div>;
  return (
    <div key={index} className={styles.item} onClick={item.onClick}>
      <div className={styles.label}>{item.label}</div>
      {short}
    </div>
  );
}

function isSeparator(item: ProcessedPopupMenuItem): item is PopupMenuSeparator {
  return typeof item === 'string';
}
