import { i18n, type Messages } from "@lingui/core";
import { messages as enUS } from "./messages/en-US";
import { messages as zhCN } from "./messages/zh-CN";

const catalogs: Record<string, Messages> = {
  "en-US": enUS,
  "zh-CN": zhCN,
};

/**
 * 加载语言包并切换语言
 * Metro 不支持动态 import()，使用静态映射代替。
 */
export async function dynamicActivate(locale: string) {
  const messages = catalogs[locale];
  if (!messages) {
    console.error(`No catalog for locale "${locale}"`);
    return;
  }
  i18n.load(locale, messages);
  i18n.activate(locale);
}
