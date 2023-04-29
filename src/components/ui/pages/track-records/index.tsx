import { FC } from 'react';
import { useTrackRecordsPage } from './hooks';
import { TrackRecordsClock } from '@components/track-records-clock';
import { Portal } from '@components/portal';

export const TrackRecords: FC = () => {
  const { trackElems } = useTrackRecordsPage();

  const elems = trackElems.map(({ elem, track, carClass }) => (
    <Portal container={elem} key={`${track.trackId}.${carClass}`}>
      <TrackRecordsClock
        track={track}
        carClass={carClass}
        style="trackRecords"
      />
    </Portal>
  ));

  return <>{elems}</>;
};
