import { TrackDataWithRecordsAllClasses } from '@store/types';
import { timeToMs } from '@utils/time';
import { CarClass } from '.';

export function getPctgTime(
  carClass: CarClass,
  trackRecords: TrackDataWithRecordsAllClasses['records'] | undefined,
  time: string | undefined
): number | undefined {
  if (!trackRecords || !time) return;
  const record = trackRecords[carClass];
  if (!record || Array.isArray(record.qualifying)) return;

  const recordMs = timeToMs(record.qualifying.lap);
  const timeMs = timeToMs(time);

  if (!recordMs || !timeMs) return;

  return 100 * (timeMs / recordMs);
}
