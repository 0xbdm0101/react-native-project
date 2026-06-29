/**
 * API 主入口 — axios 实例 + 拦截器
 * 参考 orswap 模式：集中管理 HTTP 配置，业务层通过 services 调用
 */

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { TIMEOUT, DEFAULT_CONFIG } from "./config";
import { formatRequestLog, formatResponseLog, getErrorMessage } from "./utils";

// 导出类型供 services 使用
export type { AxiosResponse, AxiosError, InternalAxiosRequestConfig };

// ==================== Axios 实例 ====================

const httpClient = axios.create({
  timeout: TIMEOUT.DEFAULT,
  headers: {
    "Content-Type": DEFAULT_CONFIG.CONTENT_TYPE,
    Accept: DEFAULT_CONFIG.ACCEPT,
  },
});

// ==================== 请求拦截器 ====================

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toUpperCase() || "GET";
    const body =
      typeof config.data === "string"
        ? config.data
        : config.data
          ? JSON.stringify(config.data)
          : undefined;
    console.log(formatRequestLog(method, config.url || "", config.headers as Record<string, string>, body));
    // 记录开始时间，响应拦截器用
    (config as any)._startTime = Date.now();
    return config;
  },
  (error: AxiosError) => {
    console.error("❌ 请求错误:", error.message);
    return Promise.reject(error);
  }
);

// ==================== 响应拦截器 ====================

httpClient.interceptors.response.use(
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
  }
);

// ==================== 导出的请求辅助函数 ====================

/** 发送 HTTP 请求（通用），自带计时。非 2xx 响应也正常返回数据。 */
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
    const response = await httpClient.request({
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.body || undefined,
      timeout: config.timeout || TIMEOUT.DEFAULT,
      signal: config.signal,
      responseType: "text",
      validateStatus: () => true, // 不抛异常，所有状态码都正常返回
    } as any);

    const duration = Date.now() - startTime;
    const responseBody =
      typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data);
    const size = responseBody.length;

    return {
      statusCode: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      body: responseBody,
      duration,
      size,
    };
  } catch (err: any) {
    // 网络错误（无响应）
    const duration = Date.now() - startTime;
    console.error("❌ 网络请求失败:", err.message);

    // 提取 axios 错误中的响应（如果有）
    if (err.response) {
      // 虽然 validateStatus 应该阻止异常，但某些情况仍可能触发
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

    throw err; // 真正的网络错误，交给上层处理
  }
};

export default httpClient;
