/**
 * 宠物 API Hook
 *
 * TanStack Query 自动处理缓存/去重/重试
 */

import { useHttp } from "@/hooks/useHttp";
import { api as http } from "@/api";

export function usePets() {
  return useHttp(
    ["pets", "available"],
    // 🎯 生成的 API，点表示法调用，完整 TS 类型提示
    () => http.pet.findPetsByStatus({ status: ["available"] }),
  );
}
