import { FC, useCallback, useMemo } from 'react';
import { Portal } from '@components/portal';
import { TopBarButton } from '@components/top-bar-button';

export const LfmPlusUi: FC = () => {
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
    <Portal waitForContainer={waitForContainer} waitForOptions={waitForOptions}>
      <TopBarButton />
    </Portal>
  );
};
