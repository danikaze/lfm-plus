export type UrlChangeHandler = (newUrl: URL, oldUrl: URL) => void;

const INTERVAL_MS = 100;
const handlers: UrlChangeHandler[] = [];
let lastUrl: URL = new URL(location.href);
let interval: ReturnType<typeof setInterval> | undefined;

export function addUrlChangeHandler(handler: UrlChangeHandler): void {
  handlers.push(handler);

  if (handlers.length === 1) {
    interval = setInterval(poll, INTERVAL_MS);
  }
}

export function removeUrlChangeHandler(handler: UrlChangeHandler): void {
  const index = handlers.indexOf(handler);
  if (index === -1) return;
  handlers.splice(index, 1);

  if (handlers.length === 0) {
    clearInterval(interval);
    interval = undefined;
  }
}

/*
 * Due how to LFM works internally, it's just safer and easier
 * poll over the current URL to detect changes.
 * Also because there's no need to react in real time
 */
function poll(): void {
  if (location.href === lastUrl.href) return;

  const newUrl = new URL(location.href);
  for (const handler of handlers) {
    handler(newUrl, lastUrl);
  }

  lastUrl = newUrl;
}
