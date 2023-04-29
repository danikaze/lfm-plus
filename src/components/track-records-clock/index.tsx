import { FC, useMemo } from 'react';
import { clsx } from 'clsx';

import { TrackData } from '@store/types';
import { CarClass } from '@utils/lfm';
import { Portal } from '@components/portal';

import styles from './track-records-clock.module.scss';
import { Times, useTrackRecordsClock } from './hooks';
import { Position } from '@components/position';

export interface Props {
  track: TrackData;
  carClass: CarClass;
  style: 'trackRecords' | 'profileBests';
}

interface TableProps {
  label: string;
  times: Times[];
}

export const TrackRecordsClock: FC<Props> = (props) => {
  const { clockRef, label, times, isTableVisible, showTable, hideTable } =
    useTrackRecordsClock(props);
  if (!times) return null;

  const table = useMemo(
    () =>
      isTableVisible && (
        <Portal>
          <Position
            relativeTo={clockRef}
            anchor="nw"
            side="se"
            className={styles.timeTablePosition}
            offsetX={-32}
            offsetY={-29}
          >
            <TrackRecordsTable label={label} times={times} />
          </Position>
        </Portal>
      ),
    [label, times, isTableVisible]
  );

  return (
    <>
      <div
        className={clsx(styles.root, styles[props.style])}
        ref={clockRef}
        onMouseEnter={showTable}
        onMouseLeave={hideTable}
      >
        ⏱
      </div>
      {table}
    </>
  );
};

const TrackRecordsTable: FC<TableProps> = ({ label, times }) => {
  const rows = times.map(({ pctg, quali, race }) => (
    <tr key={pctg} className={styles[`pctg-${pctg}`]}>
      <th>{pctg}%</th>
      <td>{quali}</td>
      <td>{race}</td>
    </tr>
  ));

  return (
    <div className={styles.timeTable}>
      <div className={styles.label}>⏱ {label}</div>
      <table>
        <thead>
          <th></th>
          <th>Quali</th>
          <th>Race</th>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};
