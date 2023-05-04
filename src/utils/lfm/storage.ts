import { AppDispatch } from '@store';
import { setTrackRecordsDataFromApi } from '@store/features/tracks';
import { TrackDataWithRecordsAllClasses } from '@store/types';
import { TRACK_RECORD_TTL } from '@utils/constants';
import { loadLocal, storeLocal } from '@utils/storage';

import { updateTrackInfo } from './api/tracks';

export interface StorageData {
  trackRecords: TrackDataWithRecordsAllClasses[];
}

export async function storeTrackRecords(
  records: TrackDataWithRecordsAllClasses[]
): Promise<void> {
  storeLocal('trackRecords', records, TRACK_RECORD_TTL);
}

/**
 * Load the cached track records.
 * If there's no data (or expired) call the API,
 * which will update the state and update the cache
 */
export async function loadTrackRecords(dispatch: AppDispatch): Promise<void> {
  const data = await loadLocal<TrackDataWithRecordsAllClasses[]>(
    'trackRecords'
  );
  if (!data) {
    return updateTrackInfo();
  }
  dispatch(setTrackRecordsDataFromApi(data));
}
