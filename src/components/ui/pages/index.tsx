import { FC } from 'react';
import { PageState } from '@store/features/page';

import { TrackRecordsPage } from './track-records';
import { ProfilePage } from './profile';
import { RacePage } from './race';

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

  if (currentPage.page === 'raceResults') {
    return (
      <RacePage eventId={currentPage.eventId} raceId={currentPage.raceId} />
    );
  }

  return null;
};
