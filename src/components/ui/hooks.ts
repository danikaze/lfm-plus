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

  /* Update the track data automatically when needed */
  useEffect(() => {
    if (isTrackDataUpdated) return;
    updateTrackInfo();
  }, [isTrackDataUpdated]);

  const topMenuItems = useMemo(
    () => getTopMenuItems(currentPage),
    [currentPage]
  );

  return {
    currentPage,
    topMenuItems,
  };
}

function getTopMenuItems(page: PageState | undefined): PopupMenuItem[] {
  const baseItems: PopupMenuItem[] = [
    { label: `LFM+ ${PACKAGE_VERSION} is active`, onClick: () => {} },
  ];
  if (!page) return baseItems;

  const items = [...baseItems];

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
