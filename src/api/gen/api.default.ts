/**
 * ⚠️ PLACEHOLDER — 运行 `npm run gen:api -- --env development` 覆盖此文件
 *
 * 由 swagger-typescript-api 根据后端的 Swagger 文档自动生成。
 * 生成后提供完整的 Api 类、类型定义、接口方法。
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export type RequestParams = Record<string, any>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;

  constructor(config: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create(config);
  }
}

/**
 * Api 类 — placeholder，生成后替换为完整版本。
 *
 * 生成后的调用方式:
 *   import { api } from "@/api";
 *   const result = await api.getUserList(params);
 */
export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  constructor(config: ApiConfig<SecurityDataType> = {}) {
    super(config);
  }

  /**
   * 示例方法（生成后被覆盖）
   * 运行 npm run gen:api -- --env development 即可获得真实接口
   */
  healthCheck = (params: RequestParams = {}) =>
    this.instance.request<any, AxiosResponse<any>>({
      url: `/health`,
      method: "GET",
      ...params,
    });
}
