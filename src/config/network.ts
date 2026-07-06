/**
 * 网络配置 — API 地址、Swagger 文档地址
 *
 * 优先级（create-react-dex-app 模式）：
 * 1. 脚本注入优先 — __APP_ENV__.VITE_API_BASE_URL_PREFIX
 * 2. 无注入时回退 — API_URLS[getCurrentEnv()]
 */

import { getCurrentEnv, RunEnvEnum } from "./env";
import { __APP_ENV__ } from "./env.generated";

// ==================== API 前缀 ====================

/** 各环境 API 基础地址（无脚本注入时的回退值） */
export const API_URLS: Partial<Record<RunEnvEnum, string>> = {
  [RunEnvEnum.DEVELOPMENT]: "https://petstore.swagger.io/v2",
  [RunEnvEnum.STAGING]: "https://staging-api.example.com",
  [RunEnvEnum.PRODUCTION]: "https://api.example.com",
};

/** 获取 API 基础地址（注入优先，回退到配置项） */
export function getAPIBaseURL(): string {
  if (__APP_ENV__?.VITE_API_BASE_URL_PREFIX) {
    return __APP_ENV__.VITE_API_BASE_URL_PREFIX;
  }
  const env = getCurrentEnv();
  return API_URLS[env] || API_URLS[RunEnvEnum.DEVELOPMENT]!;
}

// ==================== Swagger 文档地址 ====================

/**
 * 自动生成 API 的 Swagger JSON 地址
 * 支持单个 URL 或 URL 数组（多项目/多 group）
 */
export const API_DOCS_JSON_URLS: Partial<
  Record<RunEnvEnum, string | string[]>
> = {
  [RunEnvEnum.DEVELOPMENT]: ["https://petstore.swagger.io/v2/swagger.json"],
  [RunEnvEnum.STAGING]: "https://staging-api.example.com/v2/api-docs",
  [RunEnvEnum.PRODUCTION]: "https://api.example.com/v2/api-docs",
};
