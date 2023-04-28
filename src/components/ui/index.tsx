import { FC, useCallback, useMemo } from 'react';

import { Portal } from '@components/portal';
import { TopBarButton } from '@components/top-bar-button';
import { PopupMenuItem } from '@components/popup-menu';
import { msgLog } from '@utils/logging';
import { useLfmPlusUi } from './hooks';

export const LfmPlusUi: FC = () => {
  const { tracks } = useLfmPlusUi();

  const waitForContainer = useCallback(
    () => document.querySelector<HTMLElement>('elastic-toolbar-user-button'),
    []
  );
  const waitForOptions = useMemo(
    () => ({
      pollTime: 100,
      timeout: 30000,
    }),
    []
  );

  const items: PopupMenuItem[] = [
    { label: 'Item 1', short: 'I1', onClick: () => msgLog('Item 1 clicked') },
    { label: 'Item 2', onClick: () => msgLog('Item 2 clicked') },
    'separator',
    {
      label: `Tracks (${tracks.data.length})`,
      short: 'Tr',
      onClick: () => msgLog(tracks),
    },
  ];

  return (
    <Portal waitForContainer={waitForContainer} waitForOptions={waitForOptions}>
      <TopBarButton items={items} />
    </Portal>
  );
};
