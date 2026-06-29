/**
 * 环境配置
 * React Native 版，通过 expo-constants 或手动指定
 */

export enum RunEnvEnum {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  STAGING = "staging",
}

/** 当前环境（默认 development，可通过 expo-constants extra 覆盖） */
export function getCurrentEnv(): RunEnvEnum {
  // Expo 可通过 app.json extra 字段注入
  // 本地开发默认 development
  return RunEnvEnum.DEVELOPMENT;
}

export function isDevMode(): boolean {
  return getCurrentEnv() === RunEnvEnum.DEVELOPMENT;
}

export function isProdMode(): boolean {
  return getCurrentEnv() === RunEnvEnum.PRODUCTION;
}
