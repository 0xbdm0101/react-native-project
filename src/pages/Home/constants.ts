export interface MenuItemData {
  key: string;
  icon: string;
  label: string;
}

export const MENU_LIST: MenuItemData[] = [
  { key: "bluetooth", icon: "bluetooth", label: "蓝牙" },
  { key: "wifi", icon: "wifi", label: "WiFi" },
  { key: "brightness", icon: "sunny", label: "亮度" },
  { key: "volume", icon: "volume-high", label: "音量" },
  { key: "battery", icon: "battery-full", label: "电池" },
  { key: "location", icon: "location", label: "定位" },
  { key: "display", icon: "phone-portrait", label: "显示" },
  { key: "lock", icon: "lock-closed", label: "锁屏" },
  { key: "notification", icon: "notifications", label: "通知" },
  { key: "more", icon: "grid", label: "更多" },
];
