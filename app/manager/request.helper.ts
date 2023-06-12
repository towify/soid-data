/*
 * @author kaysaith
 * @date 2020/3/14 22:08
 * @description
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export type RequestOptions = {
  ignoreCache?: boolean;
  headers?: { [key: string]: string };
  // 0 (or negative) to wait forever
  timeout?: number;
};

export const DefaultRequestOption = {
  ignoreCache: false,
  headers: {
    Accept: 'application/json, text/javascript, text/plain',
  },
  // default max duration for a request
  timeout: 30000,
};

export type RequestResult = {
  ok: boolean;
  status: number;
  statusText: string;
  data: string;
  json: <T>() => T;
  headers: string;
};

export enum RequestCode {
  StreamDone = -10000
}

export class RequestHelper {
  /**
   * @description 发起网络请求
   * @param method 请求方法, "get" | "post" | "put" | "delete",
   * @param url 请求地址
   * @param queryParams 请求参数
   * @param body 请求题
   * @param options 请求配置
   * @param observeStateData
   * 开启这个 就会接受 服务端的 request on 的实施数据
   */
  public static request(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    queryParams: any = {},
    body: any = null,
    options: RequestOptions = DefaultRequestOption,
    observeStateData?: (result: RequestResult) => void
  ): Promise<RequestResult> {
    const ignoreCache = options.ignoreCache || DefaultRequestOption.ignoreCache;
    const headers = options.headers || DefaultRequestOption.headers;
    const timeout = options.timeout || DefaultRequestOption.timeout;
    return new Promise<RequestResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, this.withQuery(url, queryParams), true);
      if (headers) {
        Object.keys(headers).forEach((key) =>
          xhr.setRequestHeader(key, (<{ [key: string]: string }>headers)[key]),
        );
      }
      if (ignoreCache) {
        xhr.setRequestHeader('Cache-Control', 'no-cache');
      }
      // 允许跨域
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.withCredentials = false;
      xhr.timeout = timeout;
      if (observeStateData) {
        xhr.onreadystatechange = () => {
          observeStateData && observeStateData(this.parseXHRResult(xhr));
          if (xhr.readyState === 4 && xhr.status === 200) {
            console.debug('SOID DATA: 收到服务器响应数据');
            observeStateData({
              ok: xhr.status >= 200 && xhr.status < 300,
              status: RequestCode.StreamDone,
              statusText: xhr.statusText,
              headers: xhr.getAllResponseHeaders(),
              data: xhr.responseText,
              json: <T>() => JSON.parse(xhr.responseText) as T
            });
          } else if (xhr.readyState === 4) {
            resolve(this.errorResponse(xhr, 'Failed to make request on.', -1));
          }
        };
      } else {
        xhr.onload = () => {
          resolve(this.parseXHRResult(xhr));
        };
      }

      xhr.onerror = (evt) => {
        observeStateData && observeStateData(this.errorResponse(xhr, 'Failed to make request.', -1));
        resolve(this.errorResponse(xhr, 'Failed to make request.', -1));
      };

      xhr.ontimeout = (evt) => {
        observeStateData && observeStateData(this.errorResponse(xhr, 'Request took longer than expected.', -2));
        resolve(this.errorResponse(xhr, 'Request took longer than expected.', -2));
      };

      if (body && (method === 'post' || method === 'put')) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(body));
      } else {
        xhr.send();
      }
    });
  }

  /**
   * @description 拼接参数
   * @param params
   */
  public static queryParams(params: { [key: string]: any } = {}): string {
    return Object.keys(params)
      .map((key) => {
        if (params[key] === undefined) {
          return '';
        } else {
          let param = params[key];
          if (typeof param === 'object') {
            param = JSON.stringify(param);
          }
          return encodeURIComponent(key) + '=' + encodeURIComponent(param);
        }
      })
      .filter(item => item.length !== 0)
      .join('&');
  }

  /**
   * @description 拼接 url 地址
   * @param url 请求地址
   * @param params 请求参数
   */
  private static withQuery(url: string, params: any = {}) {
    const queryString = this.queryParams(params);
    return queryString
      ? url + (url.indexOf('?') === -1 ? '?' : '&') + queryString
      : url;
  }

  /**
   * @description 解析请求结果
   * @param xhr
   */
  private static parseXHRResult(xhr: XMLHttpRequest): RequestResult {
    return {
      ok: xhr.status >= 200 && xhr.status < 300,
      status: xhr.status,
      statusText: xhr.statusText,
      headers: xhr.getAllResponseHeaders(),
      data: xhr.responseText,
      json: <T>() => JSON.parse(xhr.responseText) as T,
    };
  }

  /**
   * @description 拼接错误
   * @param xhr
   * @param message
   * @param status
   */
  private static errorResponse(
    xhr: XMLHttpRequest,
    message: string | null = null,
    status = 0
  ): RequestResult {
    return {
      ok: false,
      status: status,
      statusText: xhr.statusText,
      headers: xhr.getAllResponseHeaders(),
      data: message || xhr.statusText,
      json: <T>() => JSON.parse(message || xhr.statusText) as T,
    };
  }
}
