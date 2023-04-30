import { FC, useCallback, useMemo } from 'react';

import { WaitingPortal } from '@components/portal/waiting-portal';
import { TopBarButton } from '@components/top-bar-button';
import { useLfmPlusUi } from './hooks';
import { LfmPlusPage } from './pages';

export const LfmPlusUi: FC = () => {
  const { currentPage, topMenuItems } = useLfmPlusUi();

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

  return (
    <>
      <WaitingPortal
        waitForContainer={waitForContainer}
        waitForOptions={waitForOptions}
      >
        <TopBarButton items={topMenuItems} />
      </WaitingPortal>
      <LfmPlusPage currentPage={currentPage} />
    </>
  );
};
