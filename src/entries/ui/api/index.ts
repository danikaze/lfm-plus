import { enableXhrInterceptor } from '@utils/xhr';
import { AppDispatch } from '@store';
import { interceptTrackApiData } from './tracks';

export function interceptApiData(dispatch: AppDispatch): void {
  enableXhrInterceptor();

  interceptTrackApiData(dispatch);
}
