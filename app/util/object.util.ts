/*
 * @author kaysaith
 * @date 12/23/20 11:10
 */

export function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}