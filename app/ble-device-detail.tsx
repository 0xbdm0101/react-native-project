import { useLocalSearchParams } from "expo-router";
import { DeviceDetail } from "@/pages/BLE/DeviceDetail";
import { Device } from "react-native-ble-plx";

export default function BLEDeviceDetailScreen() {
  const { device } = useLocalSearchParams<{ device: string }>();

  // 从路由参数中获取设备信息
  // 注意：实际应用中需要传递完整的设备对象或重新扫描
  const deviceData = device ? JSON.parse(device) : null;

  if (!deviceData) {
    return null;
  }

  // 创建 Device 对象（简化版，实际应用需要完整的设备对象）
  const mockDevice = {
    id: deviceData.id,
    name: deviceData.name,
    rssi: deviceData.rssi,
  } as Device;

  return (
    <DeviceDetail
      device={mockDevice}
      onDisconnect={() => {
        // 断开连接逻辑
      }}
    />
  );
}
