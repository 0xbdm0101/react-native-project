/**
 * 环境配置加载脚本
 *
 * 用法：
 *   tsx scripts/env/loadConfig.ts iot-dev
 *   tsx scripts/env/loadConfig.ts iot-test
 *   tsx scripts/env/loadConfig.ts iot-prod
 *
 * 生成物：src/config/env.generated.ts
 * 项目代码通过 `import { __APP_ENV__ } from ".../env.generated"` 动态读取
 *
 * 模式参考：create-react-dex-app（Vite .env → Expo TS 模块）
 */

import path from "path";
import fs from "fs";
import envMap from "./envMap";

// 命令行参数：如 iot-dev → project=iot, subEnv=dev
const mode = process.argv[2];

if (!mode) {
  console.error("❌ 请指定环境模式，如: tsx scripts/env/loadConfig.ts iot-dev");
  process.exit(1);
}

const [project, subEnv] = mode.split("-");

if (!project || !subEnv) {
  console.error(`❌ 无效的环境模式: "${mode}"，格式应为 <project>-<env>，如 iot-dev`);
  process.exit(1);
}

const projectConfig = envMap[project];
if (!projectConfig) {
  console.error(`❌ 未找到项目 "${project}"，可用项目: ${Object.keys(envMap).join(", ")}`);
  process.exit(1);
}

const config = projectConfig[subEnv];
if (!config) {
  console.error(`❌ 未找到环境 "${subEnv}"，可用环境: ${Object.keys(projectConfig).join(", ")}`);
  process.exit(1);
}

// ==================== 生成 src/config/env.generated.ts ====================

const generatedContent = `/**
 * 🔧 自动生成 — DO NOT EDIT
 * 脚本: scripts/env/loadConfig.ts
 * 当前: ${project}-${subEnv}
 */
export const __APP_ENV__ = {
  VITE_APP_ENV: "${config.runEnv}",
  VITE_API_BASE_URL_PREFIX: "${config.baseURL}",
  VITE_ENV_NAME: "${config.envName}",
  VITE_API_VERSION: "${config.apiVersion}",
} as const;
`;

const rootDir = process.cwd();
const generatedPath = path.resolve(rootDir, "src/config/env.generated.ts");
fs.writeFileSync(generatedPath, generatedContent, "utf-8");

console.log(`✅ 环境已切换: ${project}-${subEnv}`);
console.log(`   VITE_APP_ENV              → ${config.runEnv}`);
console.log(`   VITE_API_BASE_URL_PREFIX  → ${config.baseURL}`);
console.log(`   VITE_ENV_NAME             → ${config.envName}`);
console.log(`   VITE_API_VERSION          → ${config.apiVersion}`);
console.log(`📝 已生成: src/config/env.generated.ts`);
