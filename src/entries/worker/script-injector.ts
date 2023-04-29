import { msgLog } from '@utils/logging';

const NAVIGATION_FILTER: chrome.webNavigation.WebNavigationEventFilter = {
  url: [{ urlMatches: 'https://lowfuelmotorsport.com/*' }],
};

/**
 * Check when LFM is loaded to execute the UI script.
 * Technically should happen only once as it's a SPA but still,
 * multiple tabs can be opened, etc.
 */
export function setupScriptInjector(): void {
  chrome.webNavigation.onCompleted.addListener((data) => {
    msgLog('webNavigation.onCompleted', data);
    chrome.scripting.executeScript({
      injectImmediately: true,
      target: { tabId: data.tabId },
      files: ['ui.js'],
      world: 'MAIN',
    });
  }, NAVIGATION_FILTER);
}
