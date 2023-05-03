import { useCallback, useMemo, useRef, useState } from 'react';

import { TrackDataWithRecordsAllClasses } from '@store/types';
import { CarClass } from '@utils/lfm';
import { msToTime, timeToMs } from '@utils/time';
import { MAX_TIMES_PCTG } from '@utils/constants';

import { Props } from '.';

export interface Times {
  pctg: number;
  quali: string | undefined;
  race: string | undefined;
}

export function useTrackRecordsClock({
  track,
  carClass,
}: Omit<Props, 'style'>) {
  const [isTableVisible, setTableVisible] = useState<boolean>(false);
  const clockRef = useRef<HTMLDivElement>(null);
  const label = `${track.trackName} (${track.trackYear})`;
  const times = useMemo(
    () => calculateTimes(track.records, carClass),
    [track, carClass]
  );

  const showTable = useCallback(() => setTableVisible(true), [setTableVisible]);

  const hideTable = useCallback(
    () => setTableVisible(false),
    [setTableVisible]
  );

  return {
    clockRef,
    label,
    times,
    isTableVisible,
    showTable,
    hideTable,
  };
}

function calculateTimes(
  records: TrackDataWithRecordsAllClasses['records'],
  carClass: CarClass
): Times[] | undefined {
  const classRecords = records?.[carClass];
  if (
    !classRecords ||
    Array.isArray(classRecords.qualifying) ||
    Array.isArray(classRecords.race)
  ) {
    return;
  }

  const bestQualiTime = timeToMs(classRecords.qualifying.lap);
  const bestRaceTime = timeToMs(classRecords.race.lap);

  const times: Times[] = [];

  for (let pctg = 100; pctg <= MAX_TIMES_PCTG; pctg++) {
    times.push({
      pctg,
      quali: bestQualiTime ? msToTime(bestQualiTime * (pctg / 100)) : undefined,
      race: bestRaceTime ? msToTime(bestRaceTime * (pctg / 100)) : undefined,
    });
  }

  return times;
}
