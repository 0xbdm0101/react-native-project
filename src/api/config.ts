/**
 * API 配置常量
 */

// ==================== 超时配置 ====================

export const TIMEOUT = {
  /** 默认请求超时（毫秒） */
  DEFAULT: 15000,
  /** 长请求超时（毫秒） */
  LONG: 30000,
  /** 短请求超时（毫秒） */
  SHORT: 5000,
} as const;

// ==================== 默认配置 ====================

export const DEFAULT_CONFIG = {
  /** 默认 Content-Type */
  CONTENT_TYPE: "application/json",
  /** 默认 Accept */
  ACCEPT: "application/json, text/plain, */*",
  /** 最大响应体展示体积（字节，约 1MB） */
  MAX_RESPONSE_DISPLAY_SIZE: 1 * 1024 * 1024,
} as const;

// ====================  HTTP 方法 ====================

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export const HTTP_METHODS: HttpMethod[] = [
  HttpMethod.GET,
  HttpMethod.POST,
  HttpMethod.PUT,
  HttpMethod.DELETE,
];

// ==================== Body 类型 ====================

export enum BodyType {
  JSON = "application/json",
  TEXT = "text/plain",
  FORM = "application/x-www-form-urlencoded",
}

export const BODY_TYPE_LABELS: Record<BodyType, string> = {
  [BodyType.JSON]: "JSON",
  [BodyType.TEXT]: "Text",
  [BodyType.FORM]: "Form",
};
