import {
  TransformObjectOptions,
  transformObject,
} from '@utils/transform-object';
import { msgError } from '@utils/logging';
import { addXhrLoadHandler } from '@utils/xhr';
import { setDataFromApi } from '@store/features/user-track-records';
import { TrackDataWithRecordsOneClass } from '@store/types';
import { AppDispatch } from '@store';
import { CarClass } from '@utils/lfm';

export function interceptUserTrackRecordsApiData(dispatch: AppDispatch): void {
  addXhrLoadHandler(
    (xhr) => {
      try {
        const apiData = JSON.parse(xhr.body);
        const match = /\/api\/users\/getUserTrackRecords\/\d+\/(.+)/.exec(
          xhr.url.pathname
        );
        const carClass = match?.[1] as CarClass;
        if (!carClass) return;

        const tracks = transformApiData(apiData);
        dispatch(setDataFromApi({ tracks, carClass }));
      } catch (e) {
        msgError(e);
      }
    },
    {
      url: (url) =>
        url.href.includes(
          'api2.lowfuelmotorsport.com/api/users/getUserTrackRecords'
        ),
    }
  );
}

function transformApiData(apiData: any[]): TrackDataWithRecordsOneClass[] {
  return apiData.map(
    (item) =>
      transformObject(item, convertOptions) as TrackDataWithRecordsOneClass
  );
}

const convertOptions: TransformObjectOptions = {
  // transform the rest from snake_case to camelCase
  keyCase: { from: 'snake', to: 'camelAsIs' },
};
