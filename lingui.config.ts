import type { LinguiConfig } from "@lingui/conf";
import { DEFAULT_LOCALE, locales } from "./src/locales/config";

const config: LinguiConfig = {
  locales: locales,
  sourceLocale: DEFAULT_LOCALE,
  fallbackLocales: {
    default: DEFAULT_LOCALE,
  },
  format: "po",
  formatOptions: {
    lineNumbers: false,
  },
  catalogs: [
    {
      path: "<rootDir>/src/locales/messages/{locale}",
      include: ["src"],
    },
  ],
  // Metro 不支持直接 import .po，编译为 TS 文件
  compileNamespace: "ts",
};

export default config;
