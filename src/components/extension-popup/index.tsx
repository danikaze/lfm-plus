import { FC } from 'react';
import icon from '@img/icon96.png';

import styles from './extension-popup.module.scss';

export const ExtensionPopup: FC = () => {
  return (
    <div className={styles.root}>
      <h1 className={styles.title}>
        <img src={chrome.runtime.getURL(icon)} />
        LFM+
      </h1>
    </div>
  );
};
