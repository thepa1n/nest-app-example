import moment from 'moment';

export class DateUtil {
  static HOUR_IN_SECONDS = 3600;
  static HOURS_IN_DAy = 24;

  static calcDaysBetweenDates(date1: Date, date2: Date): number {
    const differenceInTime = date2.getTime() - date1.getTime();

    return Math.floor(
      differenceInTime /
        (1000 * DateUtil.HOUR_IN_SECONDS * DateUtil.HOURS_IN_DAy),
    );
  }

  static formatDateToDayMonthYear(date: string): string {
    if (!moment(date).isValid()) {
      throw new Error(
        `Can't format format date!` + `Presented date(${date}) is incorrect!`,
      );
    }

    return moment(date).format('DD.MM.YYYY');
  }
}
