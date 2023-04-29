import { FC } from 'react';
import { clsx } from 'clsx';

import { PopupMenu, Props as PopupMenuProps } from '@components/popup-menu';
import { PositionRelativeProps } from '@components/position';
import { useTopBarButton } from './hooks';

import styles from './top-bar-button.module.scss';

export interface Props {
  items: PopupMenuProps['items'];
}

export const TopBarButton: FC<Props> = ({ items }) => {
  const { toggleMenu, isMenuOpen, ref } = useTopBarButton();

  const position: Omit<PositionRelativeProps, 'children'> = {
    anchor: 'ne',
    relativeTo: ref,
    side: 's',
  };
  const menu = isMenuOpen && (
    <PopupMenu items={items} position={position} onClose={toggleMenu} />
  );

  const classes = clsx(styles.root, items.length === 0 && styles.disabled);

  return (
    <div className={classes} onClick={toggleMenu} ref={ref}>
      <div className={styles.text}>LFM</div>
      <div className={styles.plus}>+</div>
      <div className={styles.arrow} />
      {menu}
    </div>
  );
};
