/**
 * BLE 蓝牙常量和类型定义
 */

// ==================== 枚举类型 ====================

/** 扫描状态 */
export enum ScanStatus {
  IDLE = "idle",
  SCANNING = "scanning",
  ERROR = "error",
}

/** 蓝牙状态 */
export enum BluetoothState {
  UNKNOWN = "Unknown",
  RESETTING = "Resetting",
  UNSUPPORTED = "Unsupported",
  UNAUTHORIZED = "Unauthorized",
  POWERED_OFF = "PoweredOff",
  POWERED_ON = "PoweredOn",
  TURNING_ON = "TurningOn",
  TURNING_OFF = "TurningOff",
}

/** 连接状态 */
export enum ConnectionStatus {
  IDLE = "idle",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTING = "disconnecting",
}

/** 信号强度等级 */
export enum SignalStrength {
  STRONG = "strong",
  MEDIUM = "medium",
  WEAK = "weak",
  UNKNOWN = "unknown",
}

// ==================== 常量配置 ====================

/** 扫描配置 */
export const SCAN_CONFIG = {
  /** 扫描超时时间（毫秒） */
  SCAN_TIMEOUT: 10000,
  /** 扫描模式 */
  SCAN_MODE: "LowLatency" as const,
} as const;

// ==================== 工具函数 ====================

/**
 * 获取 RSSI 信号强度等级
 */
export function getSignalStrength(rssi: number | null): {
  level: SignalStrength;
  label: string;
  color: string;
} {
  if (rssi === null) {
    return { level: SignalStrength.UNKNOWN, label: "未知", color: "#666" };
  }

  if (rssi >= -60) {
    return { level: SignalStrength.STRONG, label: "强", color: "#4CAF50" };
  } else if (rssi >= -80) {
    return { level: SignalStrength.MEDIUM, label: "中", color: "#FF9800" };
  } else {
    return { level: SignalStrength.WEAK, label: "弱", color: "#F44336" };
  }
}

/**
 * 格式化 RSSI 显示
 */
export function formatRSSI(rssi: number | null): string {
  if (rssi === null) return "N/A";
  return `${rssi} dBm`;
}

/**
 * 获取蓝牙状态显示文本
 */
export function getBluetoothStateText(state: BluetoothState): string {
  const texts: Record<BluetoothState, string> = {
    [BluetoothState.UNKNOWN]: "蓝牙状态未知",
    [BluetoothState.RESETTING]: "蓝牙正在重置",
    [BluetoothState.UNSUPPORTED]: "设备不支持蓝牙",
    [BluetoothState.UNAUTHORIZED]: "请授权蓝牙权限",
    [BluetoothState.POWERED_OFF]: "蓝牙已关闭",
    [BluetoothState.POWERED_ON]: "蓝牙已开启",
    [BluetoothState.TURNING_ON]: "蓝牙正在开启",
    [BluetoothState.TURNING_OFF]: "蓝牙正在关闭",
  };
  return texts[state] || "蓝牙不可用";
}

/**
 * 获取扫描状态显示文本
 */
export function getScanStatusText(status: ScanStatus): string {
  const texts: Record<ScanStatus, string> = {
    [ScanStatus.IDLE]: "开始扫描",
    [ScanStatus.SCANNING]: "扫描中...",
    [ScanStatus.ERROR]: "扫描出错",
  };
  return texts[status] || "开始扫描";
}

/**
 * 获取连接状态显示文本
 */
export function getConnectionStatusText(status: ConnectionStatus): string {
  const texts: Record<ConnectionStatus, string> = {
    [ConnectionStatus.IDLE]: "连接",
    [ConnectionStatus.CONNECTING]: "连接中...",
    [ConnectionStatus.CONNECTED]: "已连接",
    [ConnectionStatus.DISCONNECTING]: "断开中...",
  };
  return texts[status] || "连接";
}
