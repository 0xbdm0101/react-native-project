import { useState, useEffect, useCallback } from "react";
import { createStorage } from "@/utils/cache/storageCache";
import { MQTTBroker, DEFAULT_BROKER } from "../constants";

// ==================== 常量 ====================

/** 缓存键 */
const STORAGE_KEYS = {
  /** 当前 Broker 配置 */
  CURRENT_BROKER: "current_broker",
  /** 保存的 Broker 列表 */
  SAVED_BROKERS: "saved_brokers",
  /** 上次连接时间 */
  LAST_CONNECTED: "last_connected",
} as const;

/** 最大保存数量 */
const MAX_SAVED_BROKERS = 10;

// ==================== 类型 ====================

/** 保存的 Broker 配置 */
export interface SavedBroker extends MQTTBroker {
  /** 配置名称 */
  alias: string;
  /** 上次连接时间 */
  lastConnected: number | null;
  /** 连接次数 */
  connectCount: number;
}

// ==================== 缓存实例 ====================

const mqttStorage = createStorage({ prefixKey: "MQTT_" });

// ==================== Hook ====================

export function useMQTTConfig() {
  // ==================== 状态 ====================
  const [currentBroker, setCurrentBroker] = useState<MQTTBroker>(DEFAULT_BROKER);
  const [savedBrokers, setSavedBrokers] = useState<SavedBroker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ==================== 加载配置 ====================

  /**
   * 加载保存的配置
   */
  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);

      // 加载当前 Broker
      const savedCurrent = await mqttStorage.get(STORAGE_KEYS.CURRENT_BROKER);
      if (savedCurrent) {
        setCurrentBroker(savedCurrent);
      }

      // 加载保存的 Broker 列表
      const savedList = await mqttStorage.get(STORAGE_KEYS.SAVED_BROKERS, []);
      setSavedBrokers(savedList);

      console.log("✅ MQTT 配置加载成功");
    } catch (err) {
      console.error("❌ 加载 MQTT 配置失败:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ==================== 保存配置 ====================

  /**
   * 保存当前 Broker 配置
   */
  const saveCurrentBroker = useCallback(async (broker: MQTTBroker) => {
    try {
      await mqttStorage.set(STORAGE_KEYS.CURRENT_BROKER, broker);
      setCurrentBroker(broker);
      console.log("✅ 当前 Broker 配置已保存");
    } catch (err) {
      console.error("❌ 保存 Broker 配置失败:", err);
    }
  }, []);

  /**
   * 保存 Broker 到列表
   */
  const saveBrokerToList = useCallback(async (broker: MQTTBroker, alias: string) => {
    try {
      const newBroker: SavedBroker = {
        ...broker,
        alias,
        lastConnected: Date.now(),
        connectCount: 1,
      };

      setSavedBrokers((prev) => {
        // 检查是否已存在（通过 host + port 判断）
        const existingIndex = prev.findIndex(
          (b) => b.host === broker.host && b.port === broker.port
        );

        let newList: SavedBroker[];
        if (existingIndex >= 0) {
          // 更新现有配置
          newList = [...prev];
          newList[existingIndex] = {
            ...newBroker,
            connectCount: newList[existingIndex].connectCount + 1,
          };
        } else {
          // 添加新配置
          newList = [newBroker, ...prev];
          // 限制数量
          if (newList.length > MAX_SAVED_BROKERS) {
            newList = newList.slice(0, MAX_SAVED_BROKERS);
          }
        }

        // 保存到缓存
        mqttStorage.set(STORAGE_KEYS.SAVED_BROKERS, newList);
        return newList;
      });

      console.log("✅ Broker 已保存到列表");
    } catch (err) {
      console.error("❌ 保存 Broker 到列表失败:", err);
    }
  }, []);

  /**
   * 更新 Broker 连接时间
   */
  const updateBrokerConnectTime = useCallback(async (broker: MQTTBroker) => {
    try {
      setSavedBrokers((prev) => {
        const newList = prev.map((b) => {
          if (b.host === broker.host && b.port === broker.port) {
            return {
              ...b,
              lastConnected: Date.now(),
              connectCount: b.connectCount + 1,
            };
          }
          return b;
        });

        mqttStorage.set(STORAGE_KEYS.SAVED_BROKERS, newList);
        return newList;
      });
    } catch (err) {
      console.error("❌ 更新 Broker 连接时间失败:", err);
    }
  }, []);

  // ==================== 删除配置 ====================

  /**
   * 从列表中删除 Broker
   */
  const removeBrokerFromList = useCallback(async (brokerId: string) => {
    try {
      setSavedBrokers((prev) => {
        const newList = prev.filter((b) => b.id !== brokerId);
        mqttStorage.set(STORAGE_KEYS.SAVED_BROKERS, newList);
        return newList;
      });

      console.log("✅ Broker 已从列表中删除");
    } catch (err) {
      console.error("❌ 删除 Broker 失败:", err);
    }
  }, []);

  /**
   * 清空所有保存的 Broker
   */
  const clearAllBrokers = useCallback(async () => {
    try {
      await mqttStorage.remove(STORAGE_KEYS.SAVED_BROKERS);
      setSavedBrokers([]);
      console.log("✅ 所有 Broker 已清空");
    } catch (err) {
      console.error("❌ 清空 Broker 失败:", err);
    }
  }, []);

  // ==================== 选择配置 ====================

  /**
   * 从列表中选择 Broker
   */
  const selectBroker = useCallback((broker: SavedBroker) => {
    setCurrentBroker(broker);
    return broker;
  }, []);

  // ==================== 初始化 ====================

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // ==================== 返回 ====================

  return {
    // 状态
    currentBroker,
    savedBrokers,
    isLoading,

    // 配置管理
    saveCurrentBroker,
    saveBrokerToList,
    updateBrokerConnectTime,
    removeBrokerFromList,
    clearAllBrokers,
    selectBroker,

    // 工具方法
    loadConfig,
  };
}
