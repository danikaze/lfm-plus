import { FC } from 'react';
import { PageState } from '@store/features/page';

import { TrackRecords } from './track-records';

export interface Props {
  currentPage: PageState | undefined;
}

export const LfmPlusPage: FC<Props> = ({ currentPage }) => {
  if (!currentPage) return null;

  if (currentPage.page === 'trackRecords') {
    return <TrackRecords />;
  }

  return null;
};
