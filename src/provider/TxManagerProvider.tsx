import React from "react";

/**
 * 交易管理 Provider（占位）
 *
 * 后续接入 web3/wagmi 后实现交易状态监听、toast 通知等功能
 * 目前直接透传 children
 */
export function TxManagerProvider({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}
