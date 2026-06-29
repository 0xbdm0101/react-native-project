/**
 * API 主入口 — axios 实例 + 拦截器
 *
 * 参考 create-react-dex-app 模式：
 *   - 每个 swagger group 生成一个 Api 类（src/api/gen/api.{group}.ts）
 *   - 静态 import → 创建实例 → applyInterceptors → 导出
 *   - 业务代码通过点表示法调用，有完整 TS 类型提示
 *
 * 使用方式:
 *   import { api } from "@/api";
 *   const result = await api.someEndpoint(params);
 *
 * 多 group 时:
 *   import { Api as xwalletApi } from "./gen/api.xwallet";
 *   registerApi("xwallet", xwalletApi);
 *   // 然后也可以通过 api.xxx() 调用
 *
 * 生成 API:
 *   npm run gen:api -- --env development
 */

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from "axios";
import { TIMEOUT, DEFAULT_CONFIG } from "./config";
import { formatRequestLog, formatResponseLog, getErrorMessage } from "./utils";
import { API_URLS } from "@/config/network";
import { getCurrentEnv } from "@/config/env";

// 静态导入生成的 API 类（gen:api 后生成）
// 每个 swagger group 一个文件，这里导入默认的
import { Api as DefaultApi } from "./gen/api.default";

export type { AxiosResponse, AxiosError, InternalAxiosRequestConfig };

// ==================== 拦截器 ====================

function applyInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (!config.baseURL) {
        const env = getCurrentEnv();
        config.baseURL = API_URLS[env];
      }

      const method = config.method?.toUpperCase() || "GET";
      const body =
        typeof config.data === "string"
          ? config.data
          : config.data
            ? JSON.stringify(config.data)
            : undefined;
      console.log(
        formatRequestLog(
          method,
          config.url || "",
          config.headers as Record<string, string>,
          body,
        ),
      );

      (config as any)._startTime = Date.now();
      return config;
    },
    (error: AxiosError) => {
      console.error("❌ 请求错误:", error.message);
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const startTime = (response.config as any)._startTime;
      const duration = startTime ? Date.now() - startTime : 0;
      console.log(formatResponseLog(response.status, duration));
      return response;
    },
    (error: AxiosError) => {
      if (axios.isCancel(error)) {
        console.log("🚫 请求已取消");
        return Promise.reject(error);
      }
      const message = getErrorMessage(error);
      console.error("❌ 响应错误:", message);
      return Promise.reject(error);
    },
  );
}

// ==================== API 实例 ====================

const env = getCurrentEnv();
const baseURL = API_URLS[env] || "";

// 默认 API
const apiDefault = new DefaultApi({ baseURL });
applyInterceptors(apiDefault.instance);

// 多 group 时通过 registerApi 注册更多实例
const _extraInstances: Record<string, any> = {};

/**
 * 注册额外的 API group 实例（多 swagger group 场景）
 *
 *   import { Api as xwalletApi } from "./gen/api.xwallet";
 *   registerApi("xwallet", xwalletApi);
 */
export function registerApi(group: string, ApiClass: any) {
  const instance = new ApiClass({ baseURL });
  applyInterceptors(instance.instance);
  _extraInstances[group] = instance;
}

// ==================== 导出 ====================

/**
 * 主 API 实例
 *
 * 生成后直接点表示法调用:
 *   const rs = await api.someEndpoint(params);
 *
 * 多 group 时，如果方法不在默认实例上，自动搜索已注册的额外实例。
 */
export const api = new Proxy(apiDefault as any, {
  get(target: any, prop: string) {
    // 1. 直接属性（如 pet、store、user 命名空间对象）
    if (prop in target) return target[prop];
    // 2. 嵌套方法（prop 不存在于 target 但存在于 target.xxx 下）
    for (const key of Object.keys(target)) {
      const nested = target[key];
      if (nested && typeof nested === "object" && typeof nested[prop] === "function") {
        return nested[prop].bind(nested);
      }
    }
    // 3. 搜索额外注册的 group
    for (const instance of Object.values(_extraInstances) as any[]) {
      if (prop in instance) return instance[prop];
      for (const key of Object.keys(instance)) {
        const nested = instance[key];
        if (nested && typeof nested === "object" && typeof nested[prop] === "function") {
          return nested[prop].bind(nested);
        }
      }
    }
    return undefined;
  },
}) as any;

// ==================== 通用请求工具（网络工具页用） ====================

/** 发送任意 HTTP 请求，非 2xx 也正常返回 */
export const sendRequest = async (config: {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
  timeout?: number;
  signal?: AbortSignal;
}): Promise<{
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
  size: number;
}> => {
  const startTime = Date.now();

  try {
    const response = await axios.request({
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.body || undefined,
      timeout: config.timeout || TIMEOUT.DEFAULT,
      signal: config.signal,
      responseType: "text",
      validateStatus: () => true,
    });

    const duration = Date.now() - startTime;
    const responseBody =
      typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data);

    return {
      statusCode: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      body: responseBody,
      duration,
      size: responseBody.length,
    };
  } catch (err: any) {
    if (err.response) {
      const duration = Date.now() - startTime;
      const responseBody =
        typeof err.response.data === "string"
          ? err.response.data
          : JSON.stringify(err.response.data || "");
      return {
        statusCode: err.response.status,
        statusText: err.response.statusText,
        headers: err.response.headers as Record<string, string>,
        body: responseBody,
        duration,
        size: responseBody.length,
      };
    }
    throw err;
  }
};
