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
    Accept: "application/json, text/javascript, text/plain",
  },
  // default max duration for a request
  timeout: 10000,
};

export type RequestResult = {
  ok: boolean;
  status: number;
  statusText: string;
  data: string;
  json: <T>() => T;
  headers: string;
};

export class RequestManager {
  /**
   * @description: 发起网络请求
   * @param {string} method 请求方法, "get" | "post" | "put" | "delete",
   * @param {string} url 请求地址
   * @param {any} queryParams 请求参数
   * @param {any} body 请求题
   * @param { RequestOptions } options 请求配置
   * @return {Promise<RequestResult>}
   */
  public static request(
    method: "get" | "post" | "put" | "delete",
    url: string,
    queryParams: any = {},
    body: any = null,
    options: RequestOptions = DefaultRequestOption
  ): Promise<RequestResult> {
    const ignoreCache = options.ignoreCache || DefaultRequestOption.ignoreCache;
    const headers = options.headers || DefaultRequestOption.headers;
    const timeout = options.timeout || DefaultRequestOption.timeout;
    return new Promise<RequestResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, this.withQuery(url, queryParams));
      if (headers) {
        Object.keys(headers).forEach((key) =>
          xhr.setRequestHeader(key, headers[key])
        );
      }

      if (ignoreCache) {
        xhr.setRequestHeader("Cache-Control", "no-cache");
      }

      xhr.timeout = timeout;

      xhr.onload = (evt) => {
        resolve(this.parseXHRResult(xhr));
      };

      xhr.onerror = (evt) => {
        resolve(this.errorResponse(xhr, "Failed to make request."));
      };

      xhr.ontimeout = (evt) => {
        resolve(this.errorResponse(xhr, "Request took longer than expected."));
      };

      if (body && (method === "post" || method === "put")) {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(body));
      } else {
        xhr.send();
      }
    });
  }

  /**
   * @description: 拼接参数
   * @param {any} params
   * @return {string}
   */
  private static queryParams(params: any = {}): string {
    return Object.keys(params)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
      .join("&");
  }

  /**
   * @description: 拼接 url 地址
   * @param {string} url 请求地址
   * @param {any} params 请求参数
   * @return {*}
   */
  private static withQuery(url: string, params: any = {}) {
    const queryString = this.queryParams(params);
    return queryString
      ? url + (url.indexOf("?") === -1 ? "?" : "&") + queryString
      : url;
  }

  /**
   * @description: 解析请求结果
   * @param {XMLHttpRequest} xhr
   * @return {*}
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
   * @description:拼接错误
   * @param xhr
   * @param message
   */
  private static errorResponse(
    xhr: XMLHttpRequest,
    message: string | null = null
  ): RequestResult {
    return {
      ok: false,
      status: xhr.status,
      statusText: xhr.statusText,
      headers: xhr.getAllResponseHeaders(),
      data: message || xhr.statusText,
      json: <T>() => JSON.parse(message || xhr.statusText) as T,
    };
  }
}
