import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  currentPageSelector,
  settingsSelector,
  snackBarSelector,
  tracksSelector,
  useRaceSelector,
  userSelector,
} from '@store/selectors';
import { PopupMenuItem } from '@components/popup-menu';
import { PageState } from '@store/features/page';
import { msgLog } from '@utils/logging';
import { loadTrackRecords } from '@utils/lfm/storage';
import { Race, TrackDataWithRecordsAllClasses, User } from '@store/types';
import { createRaceResults } from '@utils/lfm/create-race-results';
import { SettingsState } from '@store/features/settings';
import { queueSnackbar } from '@store/features/snackbar';
import { AppDispatch } from '@store';

export function useLfmPlusUi() {
  const dispatch = useDispatch();
  const settings = useSelector(settingsSelector);
  const snackbar = useSelector(snackBarSelector);
  const currentPage = useSelector(currentPageSelector);
  const user = useSelector(userSelector);
  const trackRecords = useSelector(tracksSelector);
  const race = useSelector(
    useRaceSelector(
      (currentPage?.page === 'raceResults' && currentPage.raceId) || undefined
    )
  );

  /*
   * Load cache data into the Store state
   */
  useEffect(() => {
    loadTrackRecords(dispatch);
  }, []);

  const topMenuItems = useMemo(
    () =>
      getTopMenuItems(
        dispatch,
        settings,
        currentPage,
        race,
        user,
        trackRecords.data
      ),
    [currentPage, race, user, trackRecords]
  );

  return {
    snackbar,
    currentPage,
    topMenuItems,
  };
}

function getTopMenuItems(
  dispatch: AppDispatch,
  settings: SettingsState,
  page: PageState | undefined,
  race: Race | undefined,
  user: User | undefined,
  trackRecords: TrackDataWithRecordsAllClasses[] | undefined
): PopupMenuItem[] {
  const baseItems: PopupMenuItem[] = [
    { label: `LFM+ ${PACKAGE_VERSION} is active`, onClick: () => {} },
  ];
  if (!page) return baseItems;

  const items = [...baseItems];

  if (page.page === 'raceResults' && trackRecords && race && user) {
    items.push('separator');
    items.push({
      label: 'Export race results',
      short: 'RR',
      onClick: () => {
        const results = createRaceResults(
          settings.raceResults,
          trackRecords,
          race,
          user.id
        );
        if (!results) {
          dispatch(
            queueSnackbar({
              text: `Can't retrieve the race results`,
              style: 'error',
            })
          );
          return;
        }
        msgLog(`race results\n${results}`);
        try {
          navigator.clipboard.writeText(results);
          dispatch(queueSnackbar({ text: 'Results copied to the clipboard' }));
        } catch (e) {
          dispatch(
            queueSnackbar({
              text: `Error while trying to copy the results to the clipboard`,
              style: 'error',
            })
          );
          msgLog('Error while trying to copy the results to the clipboard', e);
        }
      },
    });
  }

  if (!IS_PRODUCTION) {
    items.push('separator');
    items.push({
      label: page.page,
      short: 'Pg',
      onClick: () => msgLog('currentPage', page),
    });
  }

  return items;
}
