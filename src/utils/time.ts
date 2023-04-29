/**
 * Convert times as "01:23:34.567" to milliseconds
 */
export function timeToMs(time: string | undefined): number | undefined {
  const match = /((\d+):)?(\d+):(\d+)\.(\d+)/.exec(time!);
  if (!match) return;

  return (
    Number(match[5]) + // ms
    Number(match[4]) * 1000 + // s
    Number(match[3]) * 60000 + // m
    Number(match[2] || 0) * 3600000 // h
  );
}

/**
 * Convert times as milliseconds to strings like "01:23:34.567"
 */
export function msToTime(time: number): string {
  const t = Math.round(time);
  const ms = (t % 1000).toString().padStart(3, '0').substring(0, 3);
  const s = (Math.floor(t / 1000) % 60).toString().padStart(2, '0');
  const m = (Math.floor(t / 60000) % 60).toString().padStart(2, '0');
  const h = (Math.floor(t / 3600000) % 60).toString().padStart(2, '0');

  return `${h == '00' ? '' : h}${m}:${s}.${ms}`;
}

export function formatAvailableTime(msTime: number): string {
  let remaining = msTime;
  const days = Math.floor(remaining / 86400000);
  remaining -= days * 86400000;
  const hours = Math.floor(remaining / 3600000);
  remaining -= hours * 3600000;
  const minutes = Math.floor(remaining / 60000);
  remaining -= minutes * 60000;
  const seconds = Math.floor(remaining / 1000);

  const d = days ? `${days} days ` : '';
  const h = hours ? `${hours}h ` : '';
  const m = minutes ? `${minutes}m ` : '';
  const s = seconds ? `${seconds}s` : '';
  return `${d}${h}${m}${s}`;
}

export function isTime(text: string | undefined): boolean {
  if (!text) return false;
  return /\d+:\d+.\d+/.test(text);
}
