import { enableXhrInterceptor } from '@utils/xhr';
import { AppDispatch } from '@store';
import { interceptTrackApiData } from './tracks';
import { interceptUserTrackRecordsApiData } from './user-track-records';

export function interceptApiData(dispatch: AppDispatch): void {
  enableXhrInterceptor();

  interceptTrackApiData(dispatch);
  interceptUserTrackRecordsApiData(dispatch);
}
