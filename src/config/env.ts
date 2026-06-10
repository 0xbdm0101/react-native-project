import Constants from "expo-constants";

export enum RunEnvEnum {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  STAGING = "staging",
}

/**
 * 获取当前运行环境
 * 通过 app.json 的 expo.extra.env 注入，或默认 development
 */
export function getCurrentEnv(): RunEnvEnum {
  const env = Constants.expoConfig?.extra?.env as RunEnvEnum;
  return env ?? RunEnvEnum.DEVELOPMENT;
}

export function isDevMode(): boolean {
  return getCurrentEnv() === RunEnvEnum.DEVELOPMENT;
}

export function isProdMode(): boolean {
  return getCurrentEnv() === RunEnvEnum.PRODUCTION;
}
