/**
 * API 工具函数
 */

/** 格式化请求日志 */
export const formatRequestLog = (
  method: string,
  url: string,
  headers?: Record<string, string>,
  body?: string
): string => {
  const parts = [`📤 ${method} ${url}`];
  if (headers && Object.keys(headers).length > 0) {
    parts.push(`Headers: ${JSON.stringify(headers)}`);
  }
  if (body) {
    parts.push(`Body: ${body.substring(0, 200)}`);
  }
  return parts.join("\n");
};

/** 格式化响应日志 */
export const formatResponseLog = (
  status: number,
  duration: number
): string => {
  const emoji = status >= 200 && status < 300 ? "✅" : "❌";
  return `${emoji} ${status} (${duration}ms)`;
};

/** 提取用户友好的错误信息 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.name === "AbortError" || error.message.includes("abort")) {
      return "请求已取消";
    }
    if (error.message.includes("timeout") || error.message.includes("ECONNABORTED")) {
      return "请求超时，请检查网络连接";
    }
    if (error.message.includes("Network Error") || error.message.includes("ERR_NETWORK")) {
      return "网络错误，无法连接到服务器";
    }
    if (error.message.includes("parse")) {
      return "响应数据解析失败";
    }
    return `请求失败: ${error.message}`;
  }
  return "未知错误";
};

/** 格式化耗时显示 */
export const formatDuration = (ms: number): string => {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
};

/** 格式化字节大小 */
export const formatSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes}B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};
