/**
 * 网络通讯 — 业务入口
 * 封装 src/api/ 实例，提供 HTTP 请求服务
 * 参考 orswap: services 层不直接引 axios，通过 api 层调用
 */

import { sendRequest } from "@/api";
import type { HttpRequest, HttpResponse, HttpHeader } from "../types";

/** 将 HttpHeader[] 转换为 Record<string, string> */
const headersToRecord = (
  headers: HttpHeader[]
): Record<string, string> => {
  const record: Record<string, string> = {};
  headers.forEach((h) => {
    if (h.key.trim()) {
      record[h.key.trim()] = h.value.trim();
    }
  });
  return record;
};

/** 发送 HTTP 请求并返回标准化的响应 */
export const executeHttpRequest = async (
  request: HttpRequest,
  signal?: AbortSignal
): Promise<HttpResponse> => {
  try {
    const result = await sendRequest({
      url: request.url,
      method: request.method,
      headers: headersToRecord(request.headers),
      body: request.body || undefined,
      timeout: request.timeout,
      signal,
    });

    return {
      statusCode: result.statusCode,
      statusText: result.statusText,
      headers: result.headers,
      body: result.body,
      duration: result.duration,
      size: result.size,
      error: null,
    };
  } catch (err: any) {
    if (err?.name === "AbortError" || err?.message?.includes("abort")) {
      return {
        statusCode: 0,
        statusText: "CANCELLED",
        headers: {},
        body: "",
        duration: 0,
        size: 0,
        error: "请求已取消",
      };
    }
    if (err?.message?.includes("timeout") || err?.code === "ECONNABORTED") {
      return {
        statusCode: 0,
        statusText: "TIMEOUT",
        headers: {},
        body: "",
        duration: request.timeout,
        size: 0,
        error: "请求超时，请检查网络连接",
      };
    }
    return {
      statusCode: 0,
      statusText: "ERROR",
      headers: {},
      body: "",
      duration: 0,
      size: 0,
      error: err?.message || "网络连接失败",
    };
  }
};
