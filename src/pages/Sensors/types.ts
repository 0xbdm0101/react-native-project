/**
 * 传感器监控 — 类型定义
 */

import { SensorType, SensorAvailability, MonitorStatus } from "./constants";

// ==================== 传感器信息 ====================

/** 传感器列表项 */
export interface SensorInfo {
  /** 传感器类型标识 */
  type: SensorType;
  /** 传感器中文名称 */
  name: string;
  /** Ionicons 图标名称 */
  icon: string;
  /** 可用性状态 */
  availability: SensorAvailability;
  /** 不可用原因文案（仅 unavailable 时有值） */
  unavailableReason?: string;
}

// ==================== 传感器数据点 ====================

/** 三轴传感器数值（加速度计/陀螺仪/磁力计） */
export interface TriaxialValue {
  /** X 轴值 */
  x: number;
  /** Y 轴值 */
  y: number;
  /** Z 轴值 */
  z: number;
}

/** 标量传感器数值（气压计/光线传感器） */
export interface ScalarValue {
  /** 主值（气压 hPa / 照度 lux） */
  primary: number;
  /** 次值（相对高度 m，仅气压计） */
  secondary?: number;
}

/** 计步器数值 */
export interface PedometerValue {
  /** 累计步数 */
  steps: number;
}

/** 传感器数据点（联合类型） */
export interface SensorDataPoint {
  /** 采样时间戳 (ms) */
  timestamp: number;
  /** 所属传感器类型 */
  sensorType: SensorType;
  /** 采样数值 */
  values: TriaxialValue | ScalarValue | PedometerValue;
}

// ==================== 采样频率 ====================

/** 采样频率档位 */
export interface SampleRate {
  /** 频率档位中文名称 */
  label: string;
  /** 采样间隔（毫秒） */
  intervalMs: number;
  /** 等效频率（Hz） */
  frequencyHz: number;
}
