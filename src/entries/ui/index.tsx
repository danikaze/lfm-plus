import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { msgLog } from '@utils/logging';
import { LfmPlusUi } from '@components/ui';
import { store } from '@store';

import { interceptApiData } from './api';
import { trackUrlChanges } from './url';

msgLog('UI script executed');
interceptApiData(store.dispatch);
trackUrlChanges(store.dispatch);

/*
 * Inject the UI
 */
const container = document.createElement('div');
container.id = 'lfm-plus-root';
document.body.appendChild(container);
// const container = (() => {
//   const ID = 'lfm-plus-root';
//   let container = document.getElementById(ID);
//   if (container) return container;

//   container = document.createElement('div');
//   container.id = ID;
//   document.body.appendChild(container);
//   return container;
// })();

const root = createRoot(container);
const app = (
  <Provider store={store}>
    <LfmPlusUi />
  </Provider>
);
root.render(app);
