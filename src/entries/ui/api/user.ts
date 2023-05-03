import {
  TransformObjectOptions,
  transformObject,
} from '@utils/transform-object';
import { msgError } from '@utils/logging';
import { addXhrLoadHandler } from '@utils/xhr';
import { User } from '@store/types';
import { AppDispatch } from '@store';
import { setUserDataFromApi } from '@store/features/user';

export function interceptUserApiData(dispatch: AppDispatch): void {
  addXhrLoadHandler(
    (xhr) => {
      try {
        const apiData = JSON.parse(xhr.body);
        const data = transformObject(apiData, convertOptions) as User;
        dispatch(setUserDataFromApi(data));
      } catch (e) {
        msgError(e);
      }
    },
    {
      url: (url) => url.pathname === '/api/user',
    }
  );
}

const convertOptions: TransformObjectOptions = {
  // do not transform keys that are enums
  keyBypass: ['CHL', 'CUP', 'GT3', 'GT4', 'ST', 'TCX'],
  // explicitly transform the next keys
  keyTransform: {
    username: 'userName',
    shortname: 'shortName',
    steamid: 'steamId',
    vorname: 'firstName',
    nachname: 'lastName',
    cargroup: 'carGroup',
    assistrules: 'assistRules',
    eventrules: 'eventRules',
  },
  // transform the rest from snake_case to camelCase
  keyCase: { from: 'snake', to: 'camelAsIs' },
};
