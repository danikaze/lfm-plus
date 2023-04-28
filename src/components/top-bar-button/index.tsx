import { FC } from 'react';

import styles from './top-bar-button.module.scss';

export const TopBarButton: FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.text}>LFM</div>
      <div className={styles.plus}>+</div>
      <div className={styles.arrow} />
    </div>
  );
};
