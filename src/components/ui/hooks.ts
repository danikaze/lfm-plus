import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { isTrackDataUpToDateSelector, tracksSelector } from '@store/selectors';
import { updateTrackInfo } from '@utils/lfm/api/tracks';

export function useLfmPlusUi() {
  const isTrackDataUpdated = useSelector(isTrackDataUpToDateSelector);
  const tracks = useSelector(tracksSelector);

  /** Update the track data automatically when needed */
  useEffect(() => {
    if (isTrackDataUpdated) return;
    updateTrackInfo();
  }, [isTrackDataUpdated]);

  return {
    tracks,
  };
}
