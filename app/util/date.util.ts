/*
 * @author kaysaith
 * @date 2021/9/16
 */
export class DateUtil {

  static formatByType(
    isoString: string,
    format: string,
    language?: 'zh-CN' | 'en'
  ) {
    const date = new Date(isoString);
    const times: {[key: string] : number | string} = {
      'm+|M+': date.getMonth() + 1,
      'D+|d+': date.getDay(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S+': date.getMilliseconds()
    }
    let dateString = format;
    if (/(Y+|y+)/.test(dateString)) {
      dateString = dateString.replace(RegExp.$1, `${date.getFullYear()}`.substring(4 - RegExp.$1.length))
    }
    if (/(Month)/.test(dateString)) {
      dateString = dateString.replace(RegExp.$1, `${DateUtil.formatMonth(date.getMonth(), 'Month', language)}`)
    }
    if (/(Mon)/.test(dateString)) {
      dateString = dateString.replace(RegExp.$1, `${DateUtil.formatMonth(date.getMonth(), 'Mon', language)}`)
    }
    Object.entries(times).forEach(([key, value]) => {
      if (new RegExp(`(${ key })`).test(dateString)) {
        dateString = dateString.replace(RegExp.$1, RegExp.$1.length === 1 ? `${value}` : `00${value}`.substring(`${value}`.length))
      }
    })
    return dateString;
  }

  static formatMonth(month: number, format: 'Mon' | 'Month', language?: 'zh-CN' | 'en'): number | string {
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

