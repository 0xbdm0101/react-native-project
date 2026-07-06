/**
 * 环境配置映射表 — 所有环境的单一配置源
 *
 * 用法：
 *   tsx scripts/env/loadConfig.ts iot-dev     → 开发环境
 *   tsx scripts/env/loadConfig.ts iot-test    → 测试环境
 *   tsx scripts/env/loadConfig.ts iot-prod    → 生产环境
 *
 * 模式：create-react-dex-app
 * 生成物：src/config/env.generated.ts → 项目代码通过 __APP_ENV__ 导入读取
 */

import { RunEnvEnum } from "../../src/config/env";

const envMap: Record<
  string,
  Record<
    string,
    {
      baseURL: string;
      envName: string;
      apiVersion: string;
      runEnv: RunEnvEnum;
    }
  >
> = {
  iot: {
    dev: {
      baseURL: "https://webapi.orswap.org",
      envName: "iot-dev",
      apiVersion: "v1",
      runEnv: RunEnvEnum.DEVELOPMENT,
    },
    test: {
      baseURL: "https://webapi.orswap.org",
      envName: "iot-test",
      apiVersion: "v1",
      runEnv: RunEnvEnum.STAGING,
    },
    prod: {
      baseURL: "https://webapi.orswap.org",
      envName: "iot-prod",
      apiVersion: "v1",
      runEnv: RunEnvEnum.PRODUCTION,
    },
  },
};

export default envMap;
