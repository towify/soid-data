/*
 * @author kaysaith
 * @date 2021/9/16
 */
export class DateUtil {

  static formatByType(
    isoString: string,
    format: 'YYYY/MM/DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YY/M/D' | 'M/D/YY' | 'D/M/YY' | 'Month D, Yr' | 'D Month, Yr' | 'Yr, Month D',
    language?: 'zh-CN' | 'en'
  ) {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const dd = day > 9 ? day : ('0' + day);
    switch (format) {
      case 'YYYY/MM/DD': {
        return `${ year }/${ DateUtil.formatMonth(month, 'MM', language) }/${ dd }`;
      }
      case 'DD/MM/YYYY': {
        return `${ dd }/${ DateUtil.formatMonth(month, 'MM', language) }/${ year }`;
      }
      case 'MM/DD/YYYY': {
        return `${ DateUtil.formatMonth(month, 'MM', language) }/${ dd }/${ year }`;
      }
      case 'YY/M/D': {
        return `${ year }/${ DateUtil.formatMonth(month, 'M', language) }/${ day }`;
      }
      case 'M/D/YY': {
        return `${ day }/${ DateUtil.formatMonth(month, 'M', language) }/${ year }`;
      }
      case 'D/M/YY': {
        return `${ day }/${ DateUtil.formatMonth(month, 'M', language) }/${ year }`;
      }
      case 'Month D, Yr': {
        return `${ DateUtil.formatMonth(month, 'Month', language) } ${ day }, ${ year }`;
      }
      case 'D Month, Yr': {
        return `${ day } ${ DateUtil.formatMonth(month, 'Month', language) }, ${ year }`;
      }
      case 'Yr, Month D': {
        return `${ year } ${ DateUtil.formatMonth(month, 'Month', language) }, ${ day }`;
      }
      default:
        return `${ year }/${ DateUtil.formatMonth(month, 'MM', language) }/${ dd }`;
    }
  }

  static formatMonth(month: number, format: 'M' | 'MM' | 'Mon' | 'Month', language?: 'zh-CN' | 'en'): number | string {
    if (format === 'M') {
      return month
    }
    if (format === 'MM') {
      return month > 9 ? month : ('0' + month);
    }
    switch (month) {
      case 1:
        if (language === 'en') {
          if (format === 'Mon') return 'Jan';
          return 'January'
        }
        return '一月';
      case 2:
        if (language === 'en') {
          if (format === 'Mon') return 'Feb';
          return 'February'
        }
        return '二月';
      case 3:
        if (language === 'en') {
          if (format === 'Mon') return 'Mar';
          return 'March'
        }
        return '三月';
      case 4:
        if (language === 'en') {
          if (format === 'Mon') return 'Apr';
          return 'April'
        }
        return '四月';
      case 5:
        if (language === 'en') {
          if (format === 'Mon') return 'May';
          return 'May'
        }
        return '五月';
      case 6:
        if (language === 'en') {
          if (format === 'Mon') return 'Jun';
          return 'June'
        }
        return '六月';
      case 7:
        if (language === 'en') {
          if (format === 'Mon') return 'Jul';
          return 'July'
        }
        return '七月';
      case 8:
        if (language === 'en') {
          if (format === 'Mon') return 'Aug';
          return 'August'
        }
        return '八月';
      case 9:
        if (language === 'en') {
          if (format === 'Mon') return 'Sept';
          return 'September'
        }
        return '九月';
      case 10:
        if (language === 'en') {
          if (format === 'Mon') return 'Oct';
          return 'October'
        }
        return '十月';
      case 11:
        if (language === 'en') {
          if (format === 'Mon') return 'Nov';
          return 'November'
        }
        return '十一月';
      case 12:
        if (language === 'en') {
          if (format === 'Mon') return 'Dec';
          return 'December'
        }
        return '十二月';
      default:
        break;
    }
    return month;
  }
}

