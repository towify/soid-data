/*
 * @author kaysaith
 * @date 2021/9/16
 */
export class DateUtil {

  static formatDate(
    isoString: string | Date | number,
    format: string,
  ) {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return `${isoString}`;
    const times: {[key: string] : number | string} = {
      'D+|d+': date.getDate(),
      'hh': typeof isoString === 'number' || (typeof isoString === 'string' && !isoString.includes(':')) ? date.getUTCHours() : date.getHours(),
      'mm': date.getMinutes(),
      'ss': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S+': date.getMilliseconds()
    }
    let dateString = format;
    Object.entries(times).forEach(([key, value]) => {
      if (new RegExp(`(${ key })`).test(dateString)) {
        dateString = dateString.replace(RegExp.$1, RegExp.$1.length === 1 ? `${value}` : `00${value}`.substring(`${value}`.length))
      }
    })
    if (/(Yr)/.test(dateString)) {
      dateString = dateString.replace(RegExp.$1, `${date.getFullYear()}`)
    } else if (/(Y+|y+)/.test(dateString)) {
      dateString = dateString.replace(RegExp.$1, `${date.getFullYear()}`.substring(4 - RegExp.$1.length))
    }
    const month = date.getMonth() + 1
    if (/(Month)/.test(dateString)) {
      dateString = dateString.replace(RegExp.$1, `${DateUtil.formatMonth(month, 'Month')}`)
    } else if (/(Mon)/.test(dateString)) {
      dateString = dateString.replace(RegExp.$1, `${DateUtil.formatMonth(month, 'Mon')}`)
    } else if (/(M+)/.test(dateString)){
      dateString = dateString.replace(RegExp.$1, RegExp.$1.length === 1 ? `${month}` : `00${month}`.substring(`${month}`.length))
    }
    return dateString;
  }

  static formatMonth(month: number, format: 'Mon' | 'Month'): number | string {
    switch (month) {
      case 1:
        if (format === 'Mon') return 'Jan';
        return 'January'
      case 2:
        if (format === 'Mon') return 'Feb';
        return 'February'
      case 3:
        if (format === 'Mon') return 'Mar';
        return 'March'
      case 4:
        if (format === 'Mon') return 'Apr';
        return 'April'
      case 5:
        if (format === 'Mon') return 'May';
        return 'May'
      case 6:
        if (format === 'Mon') return 'Jun';
        return 'June'
      case 7:
        if (format === 'Mon') return 'Jul';
        return 'July'
      case 8:
        if (format === 'Mon') return 'Aug';
        return 'August'
      case 9:
        if (format === 'Mon') return 'Sept';
        return 'September'
      case 10:
        if (format === 'Mon') return 'Oct';
        return 'October'
      case 11:
        if (format === 'Mon') return 'Nov';
        return 'November'
      case 12:
        if (format === 'Mon') return 'Dec';
        return 'December'
      default:
        break;
    }
    return month;
  }
}


