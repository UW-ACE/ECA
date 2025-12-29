export function convertTZ(date: Date | string, tzString: string): Date {
  return new Date(
    (typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
      timeZone: tzString,
    })
  );
}

export function getTime(): Date {
  return convertTZ(new Date(), 'Canada/Eastern');
}

export interface CurrentDate {
  currMonth: number;
  currDay: number;
}

export function getCurrentDate(): CurrentDate {
  const date = getTime();
  return { currMonth: date.getMonth() + 1, currDay: date.getDate() };
}
