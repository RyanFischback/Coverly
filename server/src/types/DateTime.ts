import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

/**
 * Canonical datetime type: always UTC Dayjs.
 */
export type DateTime = Dayjs;

/**
 * Create current UTC timestamp.
 */
export const nowUtc = (): DateTime => dayjs.utc();

/**
 * Normalize any input to UTC DateTime.
 */
export const toUtc = (input: string | number | Date | Dayjs): DateTime => {
  return dayjs.utc(input);
};
