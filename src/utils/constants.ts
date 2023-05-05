/** One day period in milliseconds */
const ONE_DAY = 86_400_000;

/**
 * Time to use the track records before having to renew the data
 */
export const TRACK_RECORD_TTL = 3 * ONE_DAY;

/**
 * Last percentage to show (100-107%) in the track times table
 */
export const MAX_TIMES_PCTG = 107;

/**
 * When polling using setInterval, the polling interval time
 */
export const POLL_INTERVAL_MS = 100;

/**
 * When polling using MutationObserver, the interval to throttle
 * the callback function
 */
export const MUTATION_OBSERVER_THROTTLE = 100;

/**
 * If a lap takes more than bestLap + this,
 * it doesn't count for the average lap time
 */
export const LAP_TIME_TO_COUNT_RANGE_MS = 25000;

/**
 * Time to show the snackbar before hiding it automatically
 */
export const SNACKBAR_MS_BEFORE_HIDE = 3500;
