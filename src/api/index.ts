/**
 * API 主入口 — axios 实例 + 拦截器
 *
 * 参考 create-react-dex-app 模式：
 *   - gen:api 生成 Api 类到 src/api/gen/
 *   - 这里静态导入 → new 实例 → applyInterceptors → 导出
 *   - 业务代码通过点表示法调用: api.pet.findPetsByStatus(...)
 *
 * 多 group 时在这里加几行即可：
 *   import { Api as xwalletApi } from "./gen/api.xwallet";
 *   const apiXwallet = new xwalletApi({ baseURL: "" });
 *   applyInterceptors(apiXwallet.instance);
 *   export const { xwallet: walletApi } = apiXwallet;
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

// ===== 生成的 API 类（gen:api 后生成，每个 swagger group 一个） =====

import { Api } from "./gen/api.default";

// ===== 实例化 + 拦截器 =====

const env = getCurrentEnv();
const baseURL = API_URLS[env] || "";

export type { AxiosResponse, AxiosError, InternalAxiosRequestConfig };

function applyInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (!config.baseURL) {
        config.baseURL = API_URLS[getCurrentEnv()];
      }

      const method = config.method?.toUpperCase() || "GET";
      const body =
        typeof config.data === "string"
          ? config.data
          : config.data
            ? JSON.stringify(config.data)
            : undefined;
      console.log(
        formatRequestLog(method, config.url || "", config.headers as Record<string, string>, body),
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

// ===== 默认 API 实例 =====

const apiDefault = new Api({ baseURL: "" });
applyInterceptors(apiDefault.instance);

/**
 * 主 API 实例
 *
 * 点表示法调用:
 *   import { api } from "@/api";
 *   const pets = await api.pet.findPetsByStatus({ status: ["available"] });
 *   const inv = await api.store.getInventory();
 *
 * 多 group 时在这里加几行:
 *   import { Api as xwalletApi } from "./gen/api.xwallet";
 *   const apiXwallet = new xwalletApi({ baseURL: "" });
 *   applyInterceptors(apiXwallet.instance);
 *   export const walletApi = apiXwallet;
 */
export const api = apiDefault;

// ===== 通用请求工具（网络工具页用） =====

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
      typeof response.data === "string" ? response.data : JSON.stringify(response.data);

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
