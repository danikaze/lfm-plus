import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  settingsSelector,
  useRaceSelector,
  userSelector,
} from '@store/selectors';
import { Race, TrackDataWithRecordsAllClasses, User } from '@store/types';
import { useTrackSelector } from '@store/selectors';
import { CarClass } from '@utils/lfm';
import {
  LfmResultRow,
  ResultRowOrigin,
  createResultRow,
  isEntrylistResultRow,
  isQualiResultRow,
} from '@utils/lfm/results-row';
import {
  getOwnUserSplitFromRaceData,
  getQualiResultFromRaceData,
  getRaceResultFromRaceData,
  getSplitSoF,
} from '@utils/lfm/api/accessors';
import { getPctgTime } from '@utils/lfm/get-time-pctg';
import { POLL_INTERVAL_MS } from '@utils/constants';

import { Props } from '.';

interface SplitData {
  selectedSplit: number;
  ownSplitElem?: HTMLDivElement;
  ownNameElem?: HTMLAnchorElement;
  sor?: number;
  rows: RowData[];
  carClasses: CarClassData[];
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

interface CarClassData {
  elem: HTMLDivElement;
  carClass: CarClass;
}

type TabType = ResultRowOrigin;

export function useRacePage({ raceId }: Props) {
  const settings = useSelector(settingsSelector);
  const user = useSelector(userSelector);
  const [currentTab, setCurrentTab] = useState<TabType | undefined>();
  const [currentSplit, setCurrentSplit] = useState<number | undefined>();
  const [currentSplitData, setCurrentSplitData] = useState<
    SplitData | undefined
  >();
  const race = useSelector(useRaceSelector(raceId));
  const ownSplitIndex = useMemo(() => {
    if (!race || !user) return;
    return getOwnUserSplitFromRaceData(race, user.id);
  }, [race, user]);
  const simId = useMemo(() => race?.qualiResults[0]?.simId, [race]);
  const trackFilter = useMemo(
    () => simId && race && { simId, trackId: race?.track.trackId },
    [race]
  );
  const trackRecords = useSelector(useTrackSelector(trackFilter));

  const updateSplitData = useCallback(
    () =>
      setCurrentSplitData(
        (currentData) =>
          getSplitData(trackRecords, race, ownSplitIndex, user) ?? currentData
      ),
    [trackRecords, race, ownSplitIndex, user]
  );

  useEffect(() => {
    let lastTab: TabType | undefined;
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
  useEffect(updateSplitData, [
    trackRecords,
    race,
    currentTab,
    currentSplit,
    ownSplitIndex,
  ]);

  return { settings, currentSplitData, trackRecords };
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
  trackRecords: TrackDataWithRecordsAllClasses | undefined,
  race: Race | undefined,
  ownSplitIndex: number | undefined,
  user: User | undefined
): SplitData | undefined {
  if (!trackRecords || !race) return;

  const split = getSplit();
  if (!split) return;

  const carClass = getCarClass(race);
  if (!carClass) return;

  const tabType = getTabType();
  if (!tabType) return;

  return {
    selectedSplit: split,
    rows: getRowsData(race, trackRecords, carClass, tabType),
    sor: getSplitSoF(race, split),
    carClasses: getCarClasses(),
    ownSplitElem: getOwnSplitTab(race, ownSplitIndex),
    ownNameElem: getOwnNameElem(race, user?.id, tabType),
  };
}

function getOwnSplitTab(
  race: Race | undefined,
  ownSplitIndex: number | undefined
): HTMLDivElement | undefined {
  if (!race || ownSplitIndex === undefined) return;

  return document
    .querySelector('mat-tab-body mat-tab-header')
    ?.querySelectorAll('.mat-tab-label-content')[
    ownSplitIndex
  ] as HTMLDivElement;
}

function getOwnNameElem(
  race: Race | undefined,
  userId: number | undefined,
  tabType: TabType | undefined
): HTMLAnchorElement | undefined {
  if (!race || !userId) return;
  const href = `/profile/${userId}`;
  const ownRow = getResultRows(tabType).find(
    (row) => row.driverName?.querySelector('a')?.getAttribute('href') === href
  );
  return ownRow?.driverName?.querySelector('a') || undefined;
}

function getCarClasses(): CarClassData[] {
  return Array.from(
    document.querySelectorAll('.mat-tab-list .mat-tab-label-content')
  ).reduce((res, div) => {
    const carClass = Object.values(CarClass).find((carClass) =>
      div.textContent?.toLowerCase().startsWith(carClass.toLowerCase())
    );
    if (carClass) {
      res.push({
        elem: div as HTMLDivElement,
        carClass,
      });
    }
    return res;
  }, [] as CarClassData[]);
}

function getRowsData(
  race: Race,
  trackRecords: TrackDataWithRecordsAllClasses,
  carClass: CarClass,
  tab: TabType
): RowData[] {
  return getResultRows(tab).map((row) => {
    const isEntryRow = isEntrylistResultRow(row);

    const user: RowData['user'] = (() => {
      const elem = row.driverName;
      if (!elem) return;

      const userId = Number(
        /(\d+)/.exec(elem.querySelector('a')?.getAttribute('href')!)?.[1]
      );
      if (!userId) return;

      return { elem, userId };
    })();
    if (!user) return {};

    const lapTime: RowData['lapTime'] = (() => {
      if (isEntryRow) return;
      const elem = row.bestLap;
      const result = isQualiResultRow(row)
        ? getQualiResultFromRaceData(race, user.userId)
        : getRaceResultFromRaceData(race, user.userId);
      const pctg = getPctgTime(
        carClass,
        trackRecords.records,
        result?.bestLap!
      );

      if (!elem || !pctg) return;
      return { elem, pctg };
    })();

    return {
      user,
      lapTime,
    };
  });
}

function getResultRows(tab: TabType | undefined): LfmResultRow[] {
  if (!tab) return [];

  const selector =
    tab === 'raceQualiResult'
      ? 'elastic-qualifying-results-seasons tbody tr'
      : tab === 'raceResult'
      ? 'elastic-race-results-seasons tbody tr'
      : 'tbody tr';
  const rows = selector
    ? Array.from(document.querySelectorAll<HTMLTableRowElement>(selector))
    : [];

  return rows.map((tr) => createResultRow(tr, tab));
}

function getTabType(): TabType | undefined {
  const elemText = document.querySelector(
    'elastic-race-detail mat-tab-header [aria-selected="true"]'
  )?.textContent;
  if (!elemText) return;
  if (/race results/i.test(elemText)) return 'raceResult';
  if (/qualifying results/i.test(elemText)) return 'raceQualiResult';
  if (/entrylist/i.test(elemText)) return 'raceEntryList';
}

function getCarClass(race: Race): CarClass | undefined {
  try {
    return race.serverSettings.serverSettings.settings.data.carGroup;
  } catch {}
}
