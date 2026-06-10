import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCommonStoragePrefix, getStorageVersion } from "@/config/cache";

/**
 * 清理旧版本的 AsyncStorage 数据
 * 对齐 orswap 的 clearObsoleteStorage 逻辑：
 * - 匹配 LG_CACHE___{ENV}___ 前缀
 * - 保留当前版本的 key（LG_CACHE___{ENV}___VERSION___{VER}___）
 * - 删除其他版本的 key
 */
async function clearObsoleteStorage() {
  const commonPrefix = getCommonStoragePrefix();
  const currentVersionPrefix = getStorageVersion();

  try {
    const keys = await AsyncStorage.getAllKeys();
    const obsoleteKeys = keys.filter(
      (key) =>
        key.startsWith(commonPrefix) && !key.startsWith(currentVersionPrefix)
    );
    if (obsoleteKeys.length > 0) {
      await AsyncStorage.multiRemove(obsoleteKeys);
      console.log(`[StorageProvider] Cleared ${obsoleteKeys.length} obsolete keys`);
    }
  } catch (e) {
    console.warn("[StorageProvider] Failed to clear obsolete storage:", e);
  }
}

export const StorageProvider = ({ children }: React.PropsWithChildren) => {
  useEffect(() => {
    const t = setTimeout(() => {
      clearObsoleteStorage();
    }, 16);

    return () => {
      clearTimeout(t);
    };
  }, []);

  return <>{children}</>;
};
