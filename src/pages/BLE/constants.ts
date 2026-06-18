/** 扫描状态 */
export type ScanStatus = "idle" | "scanning" | "error";

/** 蓝牙状态 */
export type BluetoothState =
  | "Unknown"
  | "Resetting"
  | "Unsupported"
  | "Unauthorized"
  | "PoweredOff"
  | "PoweredOn"
  | "TurningOn"
  | "TurningOff";

/** 扫描配置 */
export const SCAN_CONFIG = {
  /** 扫描超时时间（毫秒） */
  SCAN_TIMEOUT: 10000,
  /** 扫描模式 */
  SCAN_MODE: "LowLatency" as const,
} as const;

/** RSSI 信号强度等级 */
export function getSignalStrength(rssi: number | null): {
  level: "strong" | "medium" | "weak" | "unknown";
  label: string;
  color: string;
} {
  if (rssi === null) {
    return { level: "unknown", label: "未知", color: "#666" };
  }

  if (rssi >= -60) {
    return { level: "strong", label: "强", color: "#4CAF50" };
  } else if (rssi >= -80) {
    return { level: "medium", label: "中", color: "#FF9800" };
  } else {
    return { level: "weak", label: "弱", color: "#F44336" };
  }
}

/** 格式化 RSSI 显示 */
export function formatRSSI(rssi: number | null): string {
  if (rssi === null) return "N/A";
  return `${rssi} dBm`;
}
