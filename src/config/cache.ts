import Constants from "expo-constants";
import { getCurrentEnv } from "./env";

// 对齐 orswap/src/config/cache.ts 的命名规则
// Key 结构: LG_CACHE___{ENV}___VERSION___{APP_VERSION}___{KEY_NAME}

const LG_CACHE_PREFIX = "LG_CACHE___";
const LG_VERSION_PREFIX = "VERSION___";
const LG_VERSION = `${Constants.expoConfig?.version ?? "0.0.0"}___`;

/** 公共前缀: LG_CACHE___{ENV}___ */
export function getCommonStoragePrefix(): string {
  return `${LG_CACHE_PREFIX}${getCurrentEnv()}___`.toUpperCase();
}

/** 短版本前缀: LG_CACHE___{ENV}___VERSION___ */
export function getStorageShortVersion(): string {
  return `${getCommonStoragePrefix()}${LG_VERSION_PREFIX}`.toUpperCase();
}

/** 完整版本前缀: LG_CACHE___{ENV}___VERSION___{APP_VERSION}___ */
export function getStorageVersion(): string {
  return `${getStorageShortVersion()}${LG_VERSION}`.toUpperCase();
}

// ==================== 不跟版本走的缓存 key（跨版本保留） ====================
export const LG_WEBSITE_INFO = `${LG_CACHE_PREFIX}WEBSITE_INFO`;
export const LG_SLIPPAGE = `${LG_CACHE_PREFIX}SLIPPAGE`;
export const LG_TX_DEADLINE = `${LG_CACHE_PREFIX}TX_DEADLINE`;

// ==================== 跟版本走的缓存 key（版本更新后自动清除） ====================
export const LG_VERSION_LANG = `${getStorageVersion()}LANG`;
export const LG_VERSION_THEME = `${getStorageVersion()}THEME`;
export const LG_VERSION_TOKEN = `${getStorageVersion()}TOKEN`;
export const LG_VERSION_CURRENCY = `${getStorageVersion()}CURRENCY`;
