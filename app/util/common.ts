/*
 * @author kaysaith
 * @date 2020/4/19 13:19
 */

export const CommonUtil = {
  getRandomId: (prefix?: string) => (prefix || '') + Math.random().toString(16).substr(2),
  hexToRgba: (hex: string, alpha = 1): string => {
    let color: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      color = hex.substring(1).split('');
      if (color.length === 3) {
        color = [color[0], color[0], color[1], color[1], color[2], color[2]];
      }
      color = `0x${color.join('')}`;

      return `rgba(${[(color >> 16) & 255, (color >> 8) & 255, color & 255].join(',')},${alpha})`;
    }
    throw new Error('Bad Hex');
  },
  pickNumber: (content: string): number | undefined => {
    const result = content.replace(/[^0-9]/ig, '');
    return result ? parseInt(result) : undefined;
  },
  repeat: (count: number, hold: (index: number) => void) => {
    for (let index = 0; index < count; index += 1) {
      hold(index);
    }
  }
};
