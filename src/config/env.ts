/**
 * 环境配置
 *
 * create-react-dex-app 模式：
 * 1. 脚本注入优先 — __APP_ENV__.VITE_APP_ENV（由 scripts/env/loadConfig.ts 生成）
 * 2. 无注入时回退 — RunEnvEnum.DEVELOPMENT
 */

import { __APP_ENV__ } from "./env.generated";

export enum RunEnvEnum {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  STAGING = "staging",
}

/** 当前环境（从注入的 __APP_ENV__ 动态读取） */
export function getCurrentEnv(): RunEnvEnum {
  return (__APP_ENV__?.VITE_APP_ENV as RunEnvEnum) || RunEnvEnum.DEVELOPMENT;
}

export function isDevMode(): boolean {
  return getCurrentEnv() === RunEnvEnum.DEVELOPMENT;
}

export function isProdMode(): boolean {
  return getCurrentEnv() === RunEnvEnum.PRODUCTION;
}
