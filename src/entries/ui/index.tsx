import { createRoot } from 'react-dom/client';

import { msgLog } from '@utils/logging';
import { addXhrLoadHandler, enableXhrInterceptor } from '@utils/xhr';
import { LfmPlusUi } from '@components/ui';

msgLog('UI script executed');
enableXhrInterceptor();

addXhrLoadHandler(
  (xhr) => {
    try {
      const data = JSON.parse(xhr.body);
      msgLog('xhr', xhr.url, data);
    } catch {}
  },
  {
    url: (url) =>
      // intercept only certain calls to the LFM API
      url.host === 'api2.lowfuelmotorsport.com' &&
      url.pathname === '/api/checkBroadcaster',
  }
);

/*
 * Inject the UI
 */
const container = document.createElement('div');
container.id = 'lfm-plus-root';
document.body.appendChild(container);

const root = createRoot(container);
root.render(<LfmPlusUi />);
