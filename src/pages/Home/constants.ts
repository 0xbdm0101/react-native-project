export interface MenuItemData {
  key: string;
  icon: string;
  label: string;
}

export const MENU_LIST: MenuItemData[] = [
  { key: "iot", icon: "hardware-chip", label: "IoT设备" },
  { key: "bluetooth", icon: "bluetooth", label: "蓝牙通讯" },
  { key: "mqtt", icon: "cloud", label: "MQTT/P2P" },
  { key: "network", icon: "globe", label: "网络通讯" },
  { key: "qrScanner", icon: "qr-code", label: "扫码" },
  { key: "sensors", icon: "speedometer", label: "传感器" },
  { key: "notifications", icon: "notifications", label: "通知" },
  { key: "biometricAuth", icon: "finger-print", label: "生物认证" },
];
