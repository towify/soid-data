/*
 * @author kaysaith
 * @date 2020/3/12 13:15
 */

export class ValueChecker {
  /**
   * @description 是否是十六进制形式的颜色值
   */
  public static isHexColor(value: string) {
    const reg = new RegExp('^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$');
    return reg.test(value);
  }

  /**
   * @description 是否是 RGBA 形式的颜色值
   */
  public static isRGBAColor(value: string) {
    const reg = new RegExp('/(^rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)$)|(^rgba\\((\\d+),\\s*(\\d+),\\s*(\\d+)(,\\s*\\d+\\.\\d+)*\\)$)/');
    return reg.test(value);
  }

  /**
   * @description 是否是邮箱地址
   */
  public static isEmail(value: string) {
    const reg = new RegExp(/^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/);
    return reg.test(value);
  }

  /**
   * @description 是否是手机号码（中国）
   */
  public static isPhoneNumber(phone: string) {
    const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    return reg.test(phone);
  }

  /**
   * @description 是否是合法的密码，(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}
   */
  public static isValidPassword(password: string) {
    const regex = new RegExp('(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}');
    return regex.test(password);
  }

  /**
   * @description 是否是中国身份证号码
   */
  public static isIdentification(id: string) {
    const regex = new RegExp('/(^\\d{15}$)|(^\\d{17}([0-9]|X|x)$)/');
    return regex.test(id);
  }

  /**
   * @description 是否是 url 地址
   */
  public static isURL(url: string) {
    const regex = new RegExp('/^http:\\/\\/.+\\./');
    return regex.test(url);
  }

  /**
   * @description 是否是图片
   */
  public static isImage(src: string) {
    const filter1 = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    const filter2 = /(?:bmp|cis\-cod|gif|ief|jpg|svg|jpeg|pipeg|png|svg\+xml|tiff|x\-cmu\-raster|x\-cmx|x\-icon|x\-portable\-anymap|x\-portable\-bitmap|x\-portable\-graymap|x\-portable\-pixmap|x\-rgb|x\-xbitmap|x\-xpixmap|x\-xwindowdump)$/i;
    return filter1.test(src) || filter2.test(src);
  }

  /**
   * @description 是否是 SMS 码
   */
  public static isValidSMSCode(smsCode: string) {
    const regex = new RegExp('^\\d{6}$');
    return regex.test(smsCode);
  }

  /**
   * @description 是否是中国身份证号码
   */
  public static IsChineseId(value: string) {
    const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return reg.test(value);
  }
}
