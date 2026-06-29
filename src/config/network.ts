import { RunEnvEnum } from "./env";
// 项目api接口前缀
export const API_URLS: Partial<Record<RunEnvEnum, string>> = {
  [RunEnvEnum.DEVELOPMENT]: "https://testdexapi.orex.work",
  [RunEnvEnum.STAGING]: "https://testapi.orscan.org/api-server",
  [RunEnvEnum.PRODUCTION]: "https://testapi.orscan.org/api-server",
};
// 自动生成swagger api文档地址，本地触发即可，无需跑ci自动化工具
export const API_DOCS_JSON_URLS = {
  [RunEnvEnum.DEVELOPMENT]:
    "https://testdexapi.orex.work/v2/api-docs?group=xwallet",
  [RunEnvEnum.PRODUCTION]: "http://18.166.84.168:8000/v2/api-docs",
  [RunEnvEnum.STAGING]: "http://18.166.84.168:8000/v2/api-docs",
} as const;
// 外部api接口
export const COMMON_URLS: Partial<Record<RunEnvEnum, string>> = {
  [RunEnvEnum.DEVELOPMENT]: "https://testdexapi.orex.work",
  [RunEnvEnum.STAGING]: "https://testapi.orscan.org/api-server",
  [RunEnvEnum.PRODUCTION]: "https://testapi.orscan.org/api-server",
};
