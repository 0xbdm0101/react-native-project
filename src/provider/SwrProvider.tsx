import React from "react";
import { SWRConfig } from "swr";

/**
 * SWR 配置 Provider
 * 与 orswap 保持一致的默认配置
 */
export const SwrProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <SWRConfig
      value={{
        // 聚焦时不做自动重新请求（RN 无此场景，但保持一致）
        revalidateOnFocus: false,
        // 重新联机时重新请求
        revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  );
};
