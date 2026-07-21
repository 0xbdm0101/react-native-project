/**
 * 传感器数据采集 Hook
 * 订阅指定传感器，管理采集状态和采样频率
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { AppState } from "react-native";
import type { AppStateStatus, NativeEventSubscription } from "react-native";
import {
  Accelerometer,
  Gyroscope,
  Magnetometer,
  Barometer,
  Pedometer,
  LightSensor,
  DeviceMotion,
} from "expo-sensors";
import type { EventSubscription } from "expo-sensors";
import {
  SensorType,
  SensorCategory,
  MonitorStatus,
  DEFAULT_SAMPLE_INTERVAL_MS,
  SENSOR_CATEGORIES,
  SAMPLE_RATES,
} from "../constants";
import type {
  TriaxialValue,
  ScalarValue,
  PedometerValue,
  SampleRate,
} from "../types";

// ==================== 传感器实例类型 ====================

type SensorInstance = {
  addListener: (listener: (data: any) => void) => EventSubscription;
  setUpdateInterval: (ms: number) => void;
  removeAllListeners: () => void;
};

/** 传感器类型 → expo-sensors 实例 */
const SENSOR_INSTANCES: Record<SensorType, SensorInstance> = {
  [SensorType.ACCELEROMETER]: Accelerometer as any,
  [SensorType.GYROSCOPE]: Gyroscope as any,
  [SensorType.MAGNETOMETER]: Magnetometer as any,
  [SensorType.BAROMETER]: Barometer as any,
  [SensorType.PEDOMETER]: Pedometer as any,
  [SensorType.LIGHT_SENSOR]: LightSensor as any,
  [SensorType.DEVICE_MOTION]: DeviceMotion as any,
};

// ==================== 数据转换 ====================

/** 将原生传感器数据转为应用数据点 */
const extractValue = (
  sensorType: SensorType,
  data: any
): TriaxialValue | ScalarValue | PedometerValue => {
  const category = SENSOR_CATEGORIES[sensorType];

  if (category === SensorCategory.TRIAXIAL) {
    if (sensorType === SensorType.DEVICE_MOTION) {
      const acc = data.accelerationIncludingGravity ?? { x: 0, y: 0, z: 0 };
      return { x: acc.x, y: acc.y, z: acc.z };
    }
    return { x: data.x, y: data.y, z: data.z };
  }

  if (category === SensorCategory.SCALAR) {
    if (sensorType === SensorType.BAROMETER) {
      return {
        primary: data.pressure,
        secondary: data.relativeAltitude ?? undefined,
      };
    }
    return { primary: data.illuminance };
  }

  if (category === SensorCategory.PEDOMETER) {
    return { steps: data.steps };
  }

  return { primary: 0 };
};

// ==================== Hook ====================

export function useSensorData(sensorType: SensorType | null) {
  const [data, setData] = useState<
    TriaxialValue | ScalarValue | PedometerValue | null
  >(null);
  const [monitorStatus, setMonitorStatus] = useState<MonitorStatus>(
    MonitorStatus.STOPPED
  );
  const [error, setError] = useState<string | null>(null);
  const [sampleRate, setSampleRate] = useState<SampleRate>(SAMPLE_RATES[1]); // 默认标准

  const subscriptionRef = useRef<EventSubscription | null>(null);
  const appStateRef = useRef<AppStateStatus>("active");
  const isMonitoringRef = useRef(false);

  /** 设置采样频率 */
  const changeSampleRate = useCallback(
    (rate: SampleRate) => {
      setSampleRate(rate);
      if (sensorType) {
        const instance = SENSOR_INSTANCES[sensorType];
        instance?.setUpdateInterval?.(rate.intervalMs);
        console.log(
          `⏱️ 采样频率切换: ${rate.label} (${rate.intervalMs}ms)`
        );
      }
    },
    [sensorType]
  );

  /** 开始采集 */
  const startMonitoring = useCallback(() => {
    if (!sensorType) return;

    try {
      const instance = SENSOR_INSTANCES[sensorType];
      if (!instance) {
        setError("传感器实例不可用");
        return;
      }

      // 设置采样间隔
      instance.setUpdateInterval?.(sampleRate.intervalMs);

      // 订阅数据
      subscriptionRef.current = instance.addListener(
        (nativeData: any) => {
          const value = extractValue(sensorType, nativeData);
          setData(value);
        }
      );

      isMonitoringRef.current = true;
      setMonitorStatus(MonitorStatus.RUNNING);
      setError(null);
      console.log(`✅ 开始采集: ${sensorType}`);
    } catch (err: any) {
      console.error("❌ 启动传感器失败:", err.message);
      setError(err.message);
      setMonitorStatus(MonitorStatus.ERROR);
    }
  }, [sensorType, sampleRate]);

  /** 停止采集 */
  const stopMonitoring = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    isMonitoringRef.current = false;
    setMonitorStatus(MonitorStatus.STOPPED);
    console.log(`⏸️ 停止采集: ${sensorType}`);
  }, [sensorType]);

  /** 传感器类型变化时重新启动 */
  useEffect(() => {
    if (sensorType) {
      // 使用 setTimeout 确保前一个清理完成
      const timer = setTimeout(() => {
        startMonitoring();
      }, 50);
      return () => {
        clearTimeout(timer);
        stopMonitoring();
      };
    }
    return () => {
      stopMonitoring();
    };
  }, [sensorType]);

  // ==================== AppState 生命周期 ====================

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      const prevState = appStateRef.current;
      appStateRef.current = nextState;

      if (nextState === "active" && prevState !== "active") {
        // 前台恢复：重新订阅
        if (isMonitoringRef.current && sensorType) {
          startMonitoring();
          console.log("📡 传感器恢复（前台）");
        }
      } else if (nextState !== "active" && prevState === "active") {
        // 进入后台：停止订阅
        if (subscriptionRef.current) {
          stopMonitoring();
          console.log("📡 传感器暂停（后台）");
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
      stopMonitoring();
    };
  }, [sensorType, startMonitoring, stopMonitoring]);

  return {
    data,
    monitorStatus,
    error,
    sampleRate,
    startMonitoring,
    stopMonitoring,
    changeSampleRate,
  };
}
