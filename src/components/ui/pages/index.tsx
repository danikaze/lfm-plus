import { FC } from 'react';
import { PageState } from '@store/features/page';

import { TrackRecordsPage } from './track-records';
import { ProfilePage } from './profile';

export interface Props {
  currentPage: PageState | undefined;
}

export const LfmPlusPage: FC<Props> = ({ currentPage }) => {
  if (!currentPage) return null;

  if (currentPage.page === 'trackRecords') {
    return <TrackRecordsPage />;
  }

  if (currentPage.page === 'profile') {
    return <ProfilePage />;
  }

  return null;
};
