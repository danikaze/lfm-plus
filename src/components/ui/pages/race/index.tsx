import { FC, useEffect, useMemo } from 'react';

import { Portal } from '@components/portal';
import { TimePctgIcon } from '@components/time-pctg-icon';
import { TrackRecordsClock } from '@components/track-records-clock';

import { useRacePage } from './hooks';

export interface Props {
  eventId: number;
  raceId: number;
}

export const RacePage: FC<Props> = (props) => {
  const { settings, currentSplitData, trackRecords } = useRacePage(props);

  useEffect(() => {
    if (!currentSplitData?.ownSplitElem) return;
    currentSplitData.ownSplitElem.style.setProperty(
      'color',
      settings.ownSplitColor
    );
  }, [settings, currentSplitData?.ownSplitElem]);

  useEffect(() => {
    if (!currentSplitData?.ownNameElem) return;
    currentSplitData.ownNameElem.style.setProperty(
      'color',
      settings.ownNameColor
    );
  }, [settings, currentSplitData?.ownNameElem]);

  const elems = useMemo(() => {
    if (!currentSplitData) return;

    const lapElems = currentSplitData.rows.map(({ user, lapTime }) => {
      const lapElem = lapTime && (
        <Portal container={lapTime.elem} key={`${user?.userId}-lap`}>
          <TimePctgIcon pctg={lapTime.pctg} />
        </Portal>
      );

      return <>{lapElem}</>;
    });

    const carClassClocks = currentSplitData.carClasses.map(
      ({ carClass, elem }) => {
        return (
          trackRecords && (
            <Portal container={elem} key={`${carClass}-clock`}>
              <TrackRecordsClock
                track={trackRecords}
                carClass={carClass}
                style="raceResultClass"
              />
            </Portal>
          )
        );
      }
    );

    return (
      <>
        {lapElems}
        {carClassClocks}
      </>
    );
  }, [currentSplitData]);

  return <>{elems}</>;
};
