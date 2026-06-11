import { DEFAULT_CACHE_TIME } from "./config";
import { createStorage } from "./storageCache";

export type Options = Partial<{
  hasEncrypt: boolean;
  timeout: number | null;
}>;

export const createLocalStorage = (options: Options = {}) => {
  return createStorage({
    hasEncrypt: false,
    timeout: DEFAULT_CACHE_TIME,
    ...options,
  });
};
