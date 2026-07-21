/**
 * 传感器列表 Hook
 * 检测所有传感器可用性，构建 SensorInfo 列表
 */

import { useState, useEffect, useCallback } from "react";
import {
  Accelerometer,
  Gyroscope,
  Magnetometer,
  Barometer,
  Pedometer,
  LightSensor,
  DeviceMotion,
} from "expo-sensors";
import {
  SensorType,
  SensorAvailability,
  SENSOR_NAMES,
  SENSOR_ICONS,
} from "../constants";
import type { SensorInfo } from "../types";

// ==================== 传感器实例映射 ====================

/** 传感器类型 → expo-sensors 实例 */
const SENSOR_INSTANCES: Record<
  SensorType,
  {
    isAvailableAsync: () => Promise<boolean>;
    getPermissionsAsync?: () => Promise<{ status: string }>;
    requestPermissionsAsync?: () => Promise<{ status: string }>;
  }
> = {
  [SensorType.ACCELEROMETER]: Accelerometer,
  [SensorType.GYROSCOPE]: Gyroscope,
  [SensorType.MAGNETOMETER]: Magnetometer,
  [SensorType.BAROMETER]: Barometer,
  [SensorType.PEDOMETER]: Pedometer,
  [SensorType.LIGHT_SENSOR]: LightSensor,
  [SensorType.DEVICE_MOTION]: DeviceMotion,
};

/** 所有传感器类型列表 */
const ALL_SENSOR_TYPES: SensorType[] = [
  SensorType.ACCELEROMETER,
  SensorType.GYROSCOPE,
  SensorType.MAGNETOMETER,
  SensorType.BAROMETER,
  SensorType.PEDOMETER,
  SensorType.LIGHT_SENSOR,
  SensorType.DEVICE_MOTION,
];

// ==================== Hook ====================

export function useSensorList() {
  const [sensors, setSensors] = useState<SensorInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** 检测所有传感器可用性 */
  const checkAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results: SensorInfo[] = [];

      for (const type of ALL_SENSOR_TYPES) {
        const instance = SENSOR_INSTANCES[type];

        try {
          const available = await instance.isAvailableAsync();

          if (available) {
            // 计步器额外检查权限
            if (type === SensorType.PEDOMETER && instance.getPermissionsAsync) {
              const perm = await instance.getPermissionsAsync();
              if (perm.status === "denied") {
                results.push({
                  type,
                  name: SENSOR_NAMES[type],
                  icon: SENSOR_ICONS[type],
                  availability: SensorAvailability.PERMISSION_DENIED,
                  unavailableReason: "运动权限未授予",
                });
                continue;
              }
            }
            results.push({
              type,
              name: SENSOR_NAMES[type],
              icon: SENSOR_ICONS[type],
              availability: SensorAvailability.AVAILABLE,
            });
          } else {
            results.push({
              type,
              name: SENSOR_NAMES[type],
              icon: SENSOR_ICONS[type],
              availability: SensorAvailability.UNAVAILABLE,
              unavailableReason: "该设备不支持",
            });
          }
        } catch {
          // 单个传感器检测失败时，标记为不可用
          results.push({
            type,
            name: SENSOR_NAMES[type],
            icon: SENSOR_ICONS[type],
            availability: SensorAvailability.UNAVAILABLE,
            unavailableReason: "检测失败",
          });
        }
      }

      console.log("📡 传感器检测完成:", results.length, "个");
      setSensors(results);
    } catch (err: any) {
      console.error("❌ 传感器检测失败:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  return {
    sensors,
    loading,
    error,
    refresh: checkAvailability,
  };
}
