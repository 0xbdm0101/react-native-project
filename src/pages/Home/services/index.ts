/**
 * Home 页面 — 业务服务层
 *
 * 参考 create-react-dex-app 的 Swap/services/index.ts 模式:
 *   import { api as http } from "@/api";
 *   通过 http.{group}.{method}() 点表示法调用
 *
 * 生成 API 后，TypeScript 自动提供完整类型提示。
 */

import { api as http } from "@/api";
import type { Pet } from "@/api/gen/api.default";

/** 根据状态获取宠物列表 */
export const getPetsByStatus = async (
  status: Array<"available" | "pending" | "sold">,
) => {
  const rs = await http.pet.findPetsByStatus({ status });
  return rs;
};

/** 根据 ID 获取单个宠物 */
export const getPetById = async (petId: number) => {
  const rs = await http.pet.getPetById(petId);
  return rs as unknown as Pet;
};

/** 获取库存统计 */
export const getInventory = async () => {
  const rs = await http.store.getInventory();
  return rs;
};
