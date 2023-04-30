import { FC } from 'react';

import { getPctgColor } from '@utils/get-pctg-color';

import styles from './time-pctg-icon.module.scss';

export interface Props {
  pctg: number;
}

export const TimePctgIcon: FC<Props> = ({ pctg }) => {
  const title = `${pctg.toFixed(2)}%`;
  return (
    <div
      title={title}
      className={styles.icon}
      style={{ backgroundColor: getPctgColor(pctg) }}
    />
  );
};
