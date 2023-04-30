import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { throttle } from 'throttle-debounce';

import { tracksSelector, userTrackRecordsSelector } from '@store/selectors';
import { TrackDataWithClassRecords, TrackDataWithRecords } from '@store/types';
import { CarClass, SimId, SimNames } from '@utils/lfm';
import { msgLog } from '@utils/logging';
import { findTrack } from '@utils/lfm/find-track';
import { timeToMs } from '@utils/time';
import { getAncestor } from '@utils/get-ancestor';
import { MUTATION_OBSERVER_THROTTLE } from '@utils/constants';

interface RowData {
  elems: {
    trackName: HTMLTableCellElement;
    qualiTime: HTMLTableCellElement;
    raceTime: HTMLTableCellElement;
  };
  track: TrackDataWithRecords;
  carClass: CarClass;
  qualiPctg?: number;
  racePctg?: number;
}

export function useProfilePage() {
  const [rowData, setRowData] = useState<RowData[]>([]);
  const userRecords = useSelector(userTrackRecordsSelector);
  const trackRecords = useSelector(tracksSelector);
  const updateRows = useMemo(
    () =>
      throttle(MUTATION_OBSERVER_THROTTLE, () => {
        setRowData((currentTracks) => {
          const newTracks = selectTrackElems(
            trackRecords.data,
            userRecords.data
          );
          msgLog('newTracks', newTracks);
          return newTracks ?? currentTracks;
        });
      }),
    [userRecords, trackRecords]
  );

  /**
   * Update rendered information on Store change
   */
  useEffect(updateRows, [userRecords.updatedOn, trackRecords.updatedOn]);

  return { rowData };
}

function selectTrackElems(
  allTrackRecords: TrackDataWithRecords[] | undefined,
  userRecords:
    | Partial<Record<CarClass, TrackDataWithClassRecords[]>>
    | undefined
): RowData[] | undefined {
  if (!allTrackRecords || !userRecords) return;

  const simId = selectSimId();
  if (!simId) return;

  const carClass = selectCarClass();
  if (!carClass) return;

  const userTrackRecords = userRecords[carClass];
  if (!userTrackRecords) return;

  return Array.from(
    document.querySelectorAll<HTMLTableRowElement>(
      '.mat-tab-body-wrapper tbody tr'
    )
  ).reduce((res, row) => {
    // get information from the table
    const elems = {
      trackName: row.children[0] as HTMLTableCellElement,
      qualiTime: row.children[2] as HTMLTableCellElement,
      raceTime: row.children[3] as HTMLTableCellElement,
    };
    const trackName = elems.trackName.textContent?.trim();
    const trackYear = Number(row.children[1].textContent);

    if (!trackName || isNaN(trackYear)) {
      return res;
    }

    // get the global records
    const globalTrack = findTrack(allTrackRecords, {
      simId,
      trackName,
      trackYear,
    });
    if (!globalTrack?.records) return res;

    // get the user record from the API data in the Sore
    const userTrackRecord = findTrack(userTrackRecords, {
      simId,
      trackName,
      trackYear,
    });

    // calculate pctg times
    const pctgTimes = getPctgTime(
      globalTrack.records,
      userTrackRecord?.records,
      carClass
    );

    res.push({
      elems,
      carClass,
      track: globalTrack,
      ...pctgTimes,
    });

    return res;
  }, [] as RowData[]);
}

function selectSimId(): SimId | undefined {
  const texts = Array.from(
    document.querySelectorAll(
      '.mat-form-field-infix mat-select .mat-select-value'
    )
  ).map((e) => e.textContent);

  return (
    Object.values(SimId).filter((id) => !isNaN(id as number)) as SimId[]
  ).find((simId) => texts.includes(SimNames[simId]));
}

function selectCarClass(): CarClass | undefined {
  const texts = Array.from(
    document.querySelectorAll(
      '.content .mat-tab-label[aria-selected="true"]  .mat-tab-label-content'
    )
  ).map((e) => e.textContent);

  return Object.values(CarClass).find((carClass) => texts.includes(carClass));
}

function getPctgTime(
  globalRecords: TrackDataWithRecords['records'],
  userRecords: TrackDataWithClassRecords['records'] | undefined,
  carClass: CarClass
): Record<'qualiPctg' | 'racePctg', number> | undefined {
  if (
    !globalRecords ||
    !userRecords ||
    Array.isArray(userRecords.qualifying) ||
    Array.isArray(userRecords.race)
  ) {
    return;
  }

  const carClassGlobalRecords = globalRecords[carClass];
  if (
    !carClassGlobalRecords ||
    Array.isArray(carClassGlobalRecords.qualifying) ||
    Array.isArray(carClassGlobalRecords.race)
  ) {
    return;
  }

  const globalQuali = timeToMs(carClassGlobalRecords.qualifying.lap);
  const globalRace = timeToMs(carClassGlobalRecords.race.lap);
  const userQuali = timeToMs(userRecords.qualifying.lap);
  const userRace = timeToMs(userRecords.race.lap);

  if (!globalQuali || !globalRace || !userQuali || !userRace) return;

  return {
    qualiPctg: 100 * (userQuali / globalQuali),
    racePctg: 100 * (userRace / globalRace),
  };
}
