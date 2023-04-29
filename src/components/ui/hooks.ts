import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  currentPageSelector,
  isTrackDataUpToDateSelector,
} from '@store/selectors';
import { updateTrackInfo } from '@utils/lfm/api/tracks';
import { PopupMenuItem } from '@components/popup-menu';
import { PageState } from '@store/features/page';
import { msgLog } from '@utils/logging';

export function useLfmPlusUi() {
  const isTrackDataUpdated = useSelector(isTrackDataUpToDateSelector);
  const currentPage = useSelector(currentPageSelector);

  /** Update the track data automatically when needed */
  useEffect(() => {
    if (isTrackDataUpdated) return;
    updateTrackInfo();
  }, [isTrackDataUpdated]);

  const topMenuItems = useMemo(
    () => getTopMenuItems(currentPage),
    [currentPage]
  );

  return {
    topMenuItems,
  };
}

function getTopMenuItems(page: PageState | undefined): PopupMenuItem[] {
  if (!page) return [];

  return [
    {
      label: page.page,
      short: 'P',
      onClick: () => msgLog('current page', page),
    },
    { label: 'Item 2', onClick: () => msgLog('Item 2 clicked') },
  ];
}
