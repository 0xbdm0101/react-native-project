/**
 * 网络配置 — API 地址、Swagger 文档地址
 */

import { RunEnvEnum } from "./env";

// ==================== API 前缀 ====================

/** 各环境 API 基础地址 */
export const API_URLS: Partial<Record<RunEnvEnum, string>> = {
  [RunEnvEnum.DEVELOPMENT]: "https://petstore.swagger.io/v2",
  [RunEnvEnum.STAGING]: "https://staging-api.example.com",
  [RunEnvEnum.PRODUCTION]: "https://api.example.com",
};

// ==================== Swagger 文档地址 ====================

/**
 * 自动生成 API 的 Swagger JSON 地址
 * 支持单个 URL 或 URL 数组（多项目/多 group）
 * 本地跑脚本即可，无需 CI
 */
export const API_DOCS_JSON_URLS: Partial<
  Record<RunEnvEnum, string | string[]>
> = {
  [RunEnvEnum.DEVELOPMENT]: ["https://petstore.swagger.io/v2/swagger.json"],
  [RunEnvEnum.STAGING]: "https://staging-api.example.com/v2/api-docs",
  [RunEnvEnum.PRODUCTION]: "https://api.example.com/v2/api-docs",
};
