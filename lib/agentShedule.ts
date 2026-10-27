import { addDays } from "date-fns";
import {
  formatInTimeZone,
  fromZonedTime,
} from "date-fns-tz";

export function calculateNextDailyRun({
  time,
  timezone,
  after = new Date(),
}: {
  time: string;
  timezone: string;
  after?: Date;
}) {
  const [hour, minute] = time.split(":").map(Number);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error(`Invalid time: ${time}`);
  }

  const localDate = formatInTimeZone(
    after,
    timezone,
    "yyyy-MM-dd",
  );

  let candidateUtc = fromZonedTime(
    `${localDate} ${time}:00`,
    timezone,
  );

  if (candidateUtc <= after) {
    const tomorrowBase = fromZonedTime(
      `${localDate} 12:00:00`,
      timezone,
    );

    const tomorrow = addDays(tomorrowBase, 1);

    const tomorrowDate = formatInTimeZone(
      tomorrow,
      timezone,
      "yyyy-MM-dd",
    );

    candidateUtc = fromZonedTime(
      `${tomorrowDate} ${time}:00`,
      timezone,
    );
  }

  return candidateUtc;
}