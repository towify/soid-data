/*
 * @author kaysaith
 * @date 2020/4/14 19:23
 */

export class StareModel extends Error {
  constructor() {
    super();
  }
}

export const StareType = {
  System: Symbol("system"),
  Request: Symbol("request"),
  Storage: Symbol("storage"),
};