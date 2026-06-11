import AsyncStorage from "@react-native-async-storage/async-storage";
import { cacheCipher } from "./config";
import { Encryption, EncryptionFactory } from "./cipher";

type Nullable<T> = T | null;

export interface CreateStorageParams {
  prefixKey: string;
  hasEncrypt: boolean;
  timeout?: Nullable<number>;
  key?: string;
  iv?: string;
}

export const createStorage = ({
  prefixKey = "",
  key = cacheCipher.key,
  iv = cacheCipher.iv,
  timeout = null,
  hasEncrypt = false,
}: Partial<CreateStorageParams> = {}) => {
  if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
    throw new Error("When hasEncrypt is true, the key or iv must be 16 bits!");
  }

  const encryption: Encryption = EncryptionFactory.createAesEncryption({
    key,
    iv,
  });

  const getKey = (k: string) => `${prefixKey}${k}`.toUpperCase();

  return {
    /**
     * 设置缓存
     * @param key
     * @param value
     * @param expire 过期时间（秒），null 表示永不过期
     */
    async set(key: string, value: any, expire: number | null = timeout) {
      const data = JSON.stringify({
        value,
        time: Date.now(),
        expire: expire ? Date.now() + expire * 1000 : null,
      });
      const finalValue = hasEncrypt ? encryption.encrypt(data) : data;
      await AsyncStorage.setItem(getKey(key), finalValue);
    },

    /**
     * 读取缓存
     * @param key
     * @param def 默认值
     */
    async get(key: string, def: any = null): Promise<any> {
      const val = await AsyncStorage.getItem(getKey(key));
      if (!val) return def;

      const decVal = hasEncrypt ? encryption.decrypt(val) : val;

      try {
        const parsed = JSON.parse(decVal);
        // 兼容旧数据：如果 parsed 不是 { value, expire } 结构，直接返回原值
        if (typeof parsed !== "object" || parsed === null || !("value" in parsed)) {
          return parsed;
        }
        const { value, expire } = parsed;
        if (!expire || expire >= Date.now()) {
          return value;
        }
        this.remove(key);
        return def;
      } catch {
        // 非 JSON 数据（旧版裸字符串），直接返回
        return decVal;
      }
    },

    /**
     * 删除缓存
     */
    async remove(key: string) {
      await AsyncStorage.removeItem(getKey(key));
    },

    /**
     * 清空所有缓存
     */
    async clear() {
      await AsyncStorage.clear();
    },
  };
};
