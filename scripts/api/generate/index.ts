import { generateApi } from "swagger-typescript-api";
import { RunEnvEnum } from "../../../src/config/env";
import { API_DOCS_JSON_URLS } from "../../../src/config/network";
import { resolve } from "node:path";

export async function generate({ env }: { env?: string }) {
  const usableEnv = env || RunEnvEnum.DEVELOPMENT;
  const urlConfig = (API_DOCS_JSON_URLS as any)[usableEnv];
  const urls = normalizeUrls(urlConfig);
  if (!urlConfig) {
    throw new Error("Could not find api json document url");
  }
  // 多项目循环执行 generateApi，一个 group 一个文件
  await Promise.all(
    urls.map((url) => {
      const group = getGroupFromUrl(url);

      return generateApi({
        // @ts-ignore — v13.2 用 fileName
        fileName: `api.${group}.ts`,
        url,
        output: resolve(process.cwd(), "./src/api/gen"),
        generateUnionEnums: true,
        extractRequestParams: false,
        extractRequestBody: false,
        enumNamesAsValues: true,
        moduleNameFirstTag: false,
        generateRouteTypes: true,
        moduleNameIndex: 0,
        httpClientType: "axios",
      });
    })
  );
}

function normalizeUrls(urlConfig: any): string[] {
  return Array.isArray(urlConfig) ? [...urlConfig] : [urlConfig];
}

function getGroupFromUrl(url: string): string {
  try {
    return new URL(url).searchParams.get("group") || "default";
  } catch {
    return "default";
  }
}

export function timingGenerate({
  timing,
  env,
}: {
  /**
   * Timed generation (minutes)
   */
  timing?: number | boolean;
  /**
   * Packaged environment
   */
  env?: string;
} = {}) {
  generate({ env });

  // Default ten minutes
  const defaultTiming = 10;
  const defineTiming =
    timing === true
      ? defaultTiming
      : typeof timing === "number" && timing > 0
        ? timing
        : 0;
  if (defineTiming) {
    const delay = defineTiming * 1000 * 60;
    setInterval(() => {
      generate({ env });
    }, delay);
  }
}
