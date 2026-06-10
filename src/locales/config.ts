export enum LOCALES {
  EN_US = "en-US",
  ZH_CN = "zh-CN",
}

export type Lang = {
  label: string;
  shortLabel: string;
  locale: LOCALES;
};

export const locales_map: Record<LOCALES, Lang> = {
  [LOCALES.ZH_CN]: {
    label: "简体中文",
    shortLabel: "CN",
    locale: LOCALES.ZH_CN,
  },
  [LOCALES.EN_US]: {
    label: "English",
    shortLabel: "EN",
    locale: LOCALES.EN_US,
  },
};

export const locales = Object.keys(locales_map);

export const DEFAULT_LOCALE = LOCALES.ZH_CN;
