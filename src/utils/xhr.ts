export type XhrLoadData = {
  method: string;
  url: URL;
  status: number;
  body: string;
};

export type XhrLoadHandler = (data: Readonly<XhrLoadData>) => void;

export type XhrLoadHandlerFilter = {
  url?: (url: URL) => boolean;
};

export function enableXhrInterceptor(): void {
  const originalOpen = window.XMLHttpRequest.prototype.open;

  window.XMLHttpRequest.prototype.open = function open(
    this: XMLHttpRequest,
    ...args: Parameters<typeof window.XMLHttpRequest.prototype.open>
  ) {
    this.addEventListener('load', function intercept() {
      handleXhrLoad({
        method: args[0],
        url: new URL(args[1]),
        status: this.status,
        body: this.responseText,
      });
    });

    return originalOpen.apply(this, args);
  } as typeof window.XMLHttpRequest.prototype.open;
}

export function addXhrLoadHandler(
  handler: XhrLoadHandler,
  filter: XhrLoadHandlerFilter = {}
): void {
  xhrLoadHandlers.push({ handler, filter });
}

export function removeXhrLoadHandler(handler: XhrLoadHandler): void {
  const index = xhrLoadHandlers.findIndex((obj) => obj.handler === handler);
  if (index === -1) return;
  xhrLoadHandlers.splice(index, 1);
}

function handleXhrLoad(data: XhrLoadData): void {
  for (const { handler, filter } of xhrLoadHandlers) {
    if (filter.url && !filter.url(data.url)) continue;
    handler(data);
  }
}

const xhrLoadHandlers: {
  handler: XhrLoadHandler;
  filter: XhrLoadHandlerFilter;
}[] = [];
