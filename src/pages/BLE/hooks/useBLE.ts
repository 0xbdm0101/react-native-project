import { useState, useEffect, useCallback, useRef } from "react";
import { BleManager, Device, State } from "react-native-ble-plx";
import { SCAN_CONFIG, BluetoothState, ScanStatus } from "../constants";

export function useBLE() {
  const [bleManager] = useState(() => new BleManager());
  const [bluetoothState, setBluetoothState] = useState<BluetoothState>("Unknown");
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [devices, setDevices] = useState<Map<string, Device>>(new Map());
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 监听蓝牙状态变化
  useEffect(() => {
    const subscription = bleManager.onStateChange((state: State) => {
      console.log("蓝牙状态变化:", state);
      setBluetoothState(state as BluetoothState);
    }, true);

    return () => {
      subscription.remove();
    };
  }, [bleManager]);

  // 清理超时定时器
  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  // 扫描设备
  const startScan = useCallback(() => {
    if (bluetoothState !== "PoweredOn") {
      setError("蓝牙未开启或未授权");
      return;
    }

    setScanStatus("scanning");
    setDevices(new Map());
    setError(null);

    bleManager.startDeviceScan(
      null, // 扫描所有服务
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          console.error("扫描错误:", error);
          setError(error.message);
          setScanStatus("error");
          return;
        }

        if (device) {
          setDevices((prev) => {
            const next = new Map(prev);
            next.set(device.id, device);
            return next;
          });
        }
      }
    );

    // 超时自动停止扫描
    scanTimeoutRef.current = setTimeout(() => {
      stopScan();
    }, SCAN_CONFIG.SCAN_TIMEOUT);
  }, [bluetoothState, bleManager]);

  // 停止扫描
  const stopScan = useCallback(() => {
    bleManager.stopDeviceScan();
    setScanStatus("idle");

    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
    }
  }, [bleManager]);

  // 连接设备
  const connectToDevice = useCallback(
    async (device: Device) => {
      try {
        setError(null);
        const connected = await bleManager.connectToDevice(device.id);
        await connected.discoverAllServicesAndCharacteristics();
        setConnectedDevice(connected);
        console.log("已连接到设备:", device.name || device.id);
      } catch (err: any) {
        console.error("连接失败:", err);
        setError(`连接失败: ${err.message}`);
      }
    },
    [bleManager]
  );

  // 断开连接
  const disconnectFromDevice = useCallback(async () => {
    if (connectedDevice) {
      try {
        await bleManager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
      } catch (err: any) {
        console.error("断开连接失败:", err);
        setError(`断开连接失败: ${err.message}`);
      }
    }
  }, [connectedDevice, bleManager]);

  // 获取设备列表（按 RSSI 排序）
  const getDeviceList = useCallback((): Device[] => {
    return Array.from(devices.values()).sort((a, b) => {
      if (a.rssi === null) return 1;
      if (b.rssi === null) return -1;
      return b.rssi - a.rssi; // 信号强的排前面
    });
  }, [devices]);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 状态
    bluetoothState,
    scanStatus,
    devices: getDeviceList(),
    connectedDevice,
    error,

    // 操作
    startScan,
    stopScan,
    connectToDevice,
    disconnectFromDevice,
    clearError,
  };
}
