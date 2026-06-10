import React from "react";
import { composeProviders } from "./composeProviders";
import { StorageProvider } from "./StorageProvider";
import { I18nProvider } from "./I18nProvider";
import { SwrProvider } from "./SwrProvider";
import { TxManagerProvider } from "./TxManagerProvider";

/**
 * 应用根 Provider 组合
 * 对齐 orswap/src/provider/index.tsx 的结构
 *
 * 嵌套顺序（从外到内）：
 * StorageProvider → I18nProvider → TxManagerProvider → SwrProvider
 */
const AppProviders = composeProviders(
  StorageProvider,
  I18nProvider,
  TxManagerProvider,
  SwrProvider
);

export function Providers({ children }: React.PropsWithChildren) {
  return <AppProviders>{children}</AppProviders>;
}
