import { FC } from 'react';

import { TrackRecordsClock } from '@components/track-records-clock';
import { Portal } from '@components/portal';
import { TimePctgIcon } from '@components/time-pctg-icon';
import { msgLog } from '@utils/logging';

import { useProfilePage } from './hooks';

import styles from './profile.module.scss';

export const ProfilePage: FC = () => {
  const { rowData } = useProfilePage();
  msgLog('Rendering');

  const elems = rowData.map(
    ({ elems, track, carClass, qualiPctg, racePctg }) => {
      const clockElem = (
        <Portal
          container={elems.trackName}
          key={`${track.trackId}.${carClass}`}
          createWrapper={clockPortalWrapper}
        >
          <TrackRecordsClock
            track={track}
            carClass={carClass}
            style="profileBests"
          />
        </Portal>
      );
      const qualiElem = qualiPctg && (
        <Portal
          container={elems.qualiTime}
          key={`${track.trackId}.${carClass}.quali`}
        >
          <TimePctgIcon pctg={qualiPctg} />
        </Portal>
      );
      const raceElem = racePctg && (
        <Portal
          container={elems.raceTime}
          key={`${track.trackId}.${carClass}.race`}
        >
          <TimePctgIcon pctg={racePctg} />
        </Portal>
      );

      return (
        <>
          {clockElem}
          {qualiElem}
          {raceElem}
        </>
      );
    }
  );

  return <>{elems}</>;
};

function clockPortalWrapper(
  container: HTMLElement,
  wrapper?: HTMLElement
): HTMLElement {
  let w = wrapper;
  if (!w) {
    w = document.createElement('div');
    w.className = styles.portalClock;
  }
  container.insertAdjacentElement('afterbegin', w);
  return w;
}
