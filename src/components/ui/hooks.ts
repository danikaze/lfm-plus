import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { currentPageSelector } from '@store/selectors';
import { PopupMenuItem } from '@components/popup-menu';
import { PageState } from '@store/features/page';
import { msgLog } from '@utils/logging';
import { loadTrackRecords } from '@utils/lfm/storage';

export function useLfmPlusUi() {
  const currentPage = useSelector(currentPageSelector);

  /*
   * Load cache data into the Store state
   */
  useEffect(() => {
    loadTrackRecords();
  }, []);

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
