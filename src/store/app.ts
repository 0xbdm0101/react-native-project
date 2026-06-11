import { DEFAULT_LOCALE, LOCALES } from "@/locales/config";
import { LG_VERSION_LANG } from "@/config/cache";
import { createLocalStorage } from "@/utils/cache";
import { proxy } from "valtio";
import { derive } from "derive-valtio";

const ls = createLocalStorage();

/**
 * RN 适配：AsyncStorage 是异步的，store 先用默认值初始化，
 * 通过 hydrateAppStore() 从持久化存储恢复状态。
 */
const state = proxy({
  currentLanguage: DEFAULT_LOCALE as LOCALES,
  toggleLanguage: () => {
    state.currentLanguage =
      state.currentLanguage === LOCALES.EN_US ? LOCALES.ZH_CN : LOCALES.EN_US;
  },
});

export const derived = derive({
  isEN: (get) => get(state).currentLanguage === LOCALES.EN_US,
});

/**
 * 从 AsyncStorage 恢复语言偏好，App 启动时调用一次
 */
export async function hydrateAppStore() {
  const saved = (await ls.get(LG_VERSION_LANG)) as LOCALES | null;
  if (saved && Object.values(LOCALES).includes(saved)) {
    state.currentLanguage = saved;
  }
}

export default state;
