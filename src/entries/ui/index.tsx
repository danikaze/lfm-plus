import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { msgLog } from '@utils/logging';
import { LfmPlusUi } from '@components/ui';
import { store } from '@store';

import { interceptApiData } from './api';

msgLog('UI script executed');
interceptApiData(store.dispatch);

/*
 * Inject the UI
 */
const container = document.createElement('div');
container.id = 'lfm-plus-root';
document.body.appendChild(container);

const root = createRoot(container);
const app = (
  <Provider store={store}>
    <LfmPlusUi />
  </Provider>
);
root.render(app);
