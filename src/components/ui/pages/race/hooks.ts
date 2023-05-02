import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useRaceSelector } from '@store/selectors';
import { Race, TrackDataWithRecords, User } from '@store/types';
import { CarClass } from '@utils/lfm';
import { timeToMs } from '@utils/time';
import { useTrackSelector } from '@store/selectors';
import {
  QualiResultsColumns,
  RaceResultsColumns,
} from '@utils/lfm/table-constants';
import {
  getQualiResultFromRaceData,
  getRaceResultFromRaceData,
} from '@utils/lfm/api/selectors';

import { POLL_INTERVAL_MS } from '@utils/constants';
import { msgLog } from '@utils/logging';

import { Props } from '.';

interface SplitData {
  split: number;
  sor?: number;
  rows: RowData[];
}

interface RowData {
  user?: {
    elem: HTMLTableCellElement;
    userId: User['id'];
  };
  lapTime?: {
    elem: HTMLTableCellElement;
    pctg: number;
  };
}

type TabType = 'quali' | 'race' | 'entrylist' | 'other';

export function useRacePage({ raceId }: Props) {
  const [currentTab, setCurrentTab] = useState<TabType | undefined>();
  const [currentSplit, setCurrentSplit] = useState<number | undefined>();
  const [currentSplitData, setCurrentSplitData] = useState<
    SplitData | undefined
  >();
  const race = useSelector(useRaceSelector(raceId));
  const simId = useMemo(() => race?.qualiResults[0]?.simId, [race]);
  const trackFilter = useMemo(
    () => simId && race && { simId, trackId: race?.track.trackId },
    [race]
  );
  const trackRecords = useSelector(useTrackSelector(trackFilter));

  const updateSplitData = useCallback(
    () =>
      setCurrentSplitData((currentData) => {
        msgLog('setCurrentSplitData');
        return getSplitData(trackRecords, race) ?? currentData;
      }),
    [trackRecords, race]
  );

  useEffect(() => {
    let lastTab: TabType;
    const interval = setInterval(() => {
      const newTab = getTabType();
      if (lastTab === newTab) return;
      lastTab = newTab;
      setCurrentTab(newTab);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let lastSplit: number | undefined;
    const interval = setInterval(() => {
      const newSplit = getSplit();
      if (lastSplit === newSplit) return;
      lastSplit = newSplit;
      setCurrentSplit(newSplit);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  /**
   * Update rendered information on Store change
   */
  useEffect(updateSplitData, [trackRecords, race, currentTab, currentSplit]);

  return { currentSplitData };
}

function getSplit(): number | undefined {
  const selector =
    '.mat-tab-body-wrapper .mat-tab-label-container [aria-selected="true"]';
  const elem = document.querySelector(selector);
  const match = /SPLIT (\d+) \((\d+)\)/.exec(elem?.textContent!);
  const split = match ? Number(match[1]) : undefined;
  return isNaN(split!) ? undefined : split;
}

function getSplitData(
  trackRecords: TrackDataWithRecords | undefined,
  race: Race | undefined
): SplitData | undefined {
  if (!trackRecords || !race) return;

  const split = getSplit();
  if (!split) return;

  const carClass = getCarClass(race);
  if (!carClass) return;

  const tabType = getTabType();
  if (tabType === 'other') return;

  const rows =
    tabType === 'quali'
      ? getQualiRowsData(race, trackRecords, carClass)
      : tabType === 'race'
      ? getRaceRowsData(race, trackRecords, carClass)
      : getEntryRowsData();

  return {
    split,
    rows,
    sor: getSplitSoF(race, split),
  };
}

function getQualiRowsData(
  race: Race,
  trackRecords: TrackDataWithRecords,
  carClass: CarClass
): RowData[] {
  const resultRows = Array.from(
    document.querySelectorAll<HTMLTableRowElement>(
      'elastic-qualifying-results-seasons tbody tr'
    )
  );
  if (!resultRows) return [];

  return resultRows.map((row) => {
    const user: RowData['user'] = (() => {
      const elem = row.children[
        QualiResultsColumns.DRIVER_NAME
      ] as HTMLTableCellElement;
      if (!elem) return;

      const userId = Number(
        /(\d+)/.exec(elem.querySelector('a')?.getAttribute('href')!)?.[1]
      );
      if (!userId) return;

      return { elem, userId };
    })();
    if (!user) return {};

    const lapTime: RowData['lapTime'] = (() => {
      const elem = row.children[
        QualiResultsColumns.BEST_LAP
      ] as HTMLTableCellElement;
      const result = getQualiResultFromRaceData(race, user.userId);
      const pctg = getPctgTime(carClass, trackRecords.records, result?.bestLap);

      if (!elem || !pctg) return;
      return { elem, pctg };
    })();

    return {
      user,
      lapTime,
    };
  });
}

function getRaceRowsData(
  race: Race,
  trackRecords: TrackDataWithRecords,
  carClass: CarClass
): RowData[] {
  const resultRows = Array.from(
    document.querySelectorAll<HTMLTableRowElement>(
      'elastic-race-results-seasons tbody tr'
    )
  );
  if (!resultRows) return [];

  return resultRows.map((row, i) => {
    const user: RowData['user'] = (() => {
      const elem = row.children[
        RaceResultsColumns.DRIVER_NAME
      ] as HTMLTableCellElement;
      if (!elem) return;

      const userId = Number(
        /(\d+)/.exec(elem.querySelector('a')?.getAttribute('href')!)?.[1]
      );
      if (!userId) return;

      return { elem, userId };
    })();
    if (!user) return {};

    const lapTime: RowData['lapTime'] = (() => {
      const elem = row.children[
        RaceResultsColumns.BEST_LAP
      ] as HTMLTableCellElement;
      const result = getRaceResultFromRaceData(race, user.userId);
      const pctg = getPctgTime(carClass, trackRecords.records, result?.bestlap);

      if (!elem || !pctg) return;
      return { elem, pctg };
    })();

    return {
      user,
      lapTime,
    };
  });
}

function getEntryRowsData(): RowData[] {
  return [];
}

function getPctgTime(
  carClass: CarClass,
  trackRecords: TrackDataWithRecords['records'] | undefined,
  time: string | undefined
): number | undefined {
  if (!trackRecords || !time) return;
  const record = trackRecords[carClass];
  if (!record || Array.isArray(record.qualifying)) return;

  const recordMs = timeToMs(record.qualifying.lap);
  const timeMs = timeToMs(time);

  if (!recordMs || !timeMs) return;

  return 100 * (timeMs / recordMs);
}

function getTabType(): TabType {
  const elem = document.querySelector(
    'elastic-race-detail mat-tab-header [aria-selected="true"]'
  );
  if (!elem) return 'other';
  if (/race results/i.test(elem.textContent!)) return 'race';
  if (/qualifying results/i.test(elem.textContent!)) return 'quali';
  if (/entrylist/i.test(elem.textContent!)) return 'entrylist';
  return 'other';
}

function getCarClass(race: Race): CarClass | undefined {
  try {
    return race.serverSettings.serverSettings.settings.data.carGroup;
  } catch {}
}

function getSplitSoF(race: Race, split: number): number | undefined {
  if (!race) return;
  if (split === 1) {
    return race.sof;
  }
  return race[`split${split}Sof` as 'split1Sof'];
}
