import React from "react";
import { TamaguiProvider } from "tamagui";
import tamaguiConfig from "../../tamagui.config";
import { composeProviders } from "./composeProviders";
import { StorageProvider } from "./StorageProvider";
import { I18nProvider } from "./I18nProvider";
import { QueryProvider } from "./QueryProvider";
import { TxManagerProvider } from "./TxManagerProvider";

const AppProviders = composeProviders(
  [TamaguiProvider, { config: tamaguiConfig, defaultTheme: "light" }],
  StorageProvider,
  I18nProvider,
  TxManagerProvider,
  QueryProvider,
);

export function Providers({ children }: React.PropsWithChildren) {
  return <AppProviders>{children}</AppProviders>;
}
