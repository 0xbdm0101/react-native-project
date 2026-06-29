import { ReactNode } from "react";
import { getCurrentEnv, RunEnvEnum } from "./env";

export enum THEMES {
  LIGHT = "light",
  DARK = "dark",
}

export type THEME_ITEM = {
  label: string | ReactNode;
  theme: THEMES;
};

export const theme_map: Record<THEMES, THEME_ITEM> = {
  [THEMES.LIGHT]: {
    label: "白天",
    theme: THEMES.LIGHT,
  },
  [THEMES.DARK]: {
    label: "黑夜",
    theme: THEMES.DARK,
  },
};

export enum OrderByEnum {
  ASC = "ASC",
  DESC = "DESC",
}

export const EXPLORER_URLS = {
  [RunEnvEnum.DEVELOPMENT]: "https://testnet.orisscan.org",
  [RunEnvEnum.PRODUCTION]: "https://testnet.orisscan.org",
  [RunEnvEnum.STAGING]: "https://testnet.orisscan.org",
};

export const getScanExplorerUrl = () => {
  const env = getCurrentEnv();
  return EXPLORER_URLS[env];
};
export const DEFAULT_THEME = THEMES.LIGHT;
