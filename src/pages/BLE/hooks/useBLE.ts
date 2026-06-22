import { useState, useEffect, useCallback, useRef } from "react";
import { BleManager, Device, State } from "react-native-ble-plx";
import {
  SCAN_CONFIG,
  BluetoothState,
  ScanStatus,
  ConnectionStatus,
} from "../constants";

export function useBLE() {
  const [bleManager] = useState(() => new BleManager());
  const [bluetoothState, setBluetoothState] = useState<BluetoothState>(BluetoothState.UNKNOWN);
  const [scanStatus, setScanStatus] = useState<ScanStatus>(ScanStatus.IDLE);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.IDLE);
  const [devices, setDevices] = useState<Map<string, Device>>(new Map());
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 监听蓝牙状态变化
  useEffect(() => {
    const subscription = bleManager.onStateChange((state: State) => {
      console.log("蓝牙状态变化:", state);
      setBluetoothState(state as unknown as BluetoothState);
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
    if (bluetoothState !== BluetoothState.POWERED_ON) {
      setError("蓝牙未开启或未授权");
      return;
    }

    setScanStatus(ScanStatus.SCANNING);
    setDevices(new Map());
    setError(null);

    bleManager.startDeviceScan(
      null, // 扫描所有服务
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          console.error("扫描错误:", error);
          setError(error.message);
          setScanStatus(ScanStatus.ERROR);
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
    setScanStatus(ScanStatus.IDLE);

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
        setScanStatus(ScanStatus.IDLE);
        setConnectionStatus(ConnectionStatus.CONNECTING);

        console.log("正在连接设备:", device.name || device.id);
        const connected = await bleManager.connectToDevice(device.id);

        // 监听设备断开事件
        connected.onDisconnected((error, disconnectedDevice) => {
          console.log("设备已断开:", disconnectedDevice?.name || disconnectedDevice?.id);
          setConnectedDevice(null);
          setConnectionStatus(ConnectionStatus.IDLE);
          if (error) {
            setError(`连接断开: ${error.message}`);
          }
        });

        await connected.discoverAllServicesAndCharacteristics();
        setConnectedDevice(connected);
        setConnectionStatus(ConnectionStatus.CONNECTED);
        console.log("✅ 已连接到设备:", device.name || device.id);
      } catch (err: any) {
        console.error("❌ 连接失败:", err);
        setError(`连接失败: ${err.message}`);
        setConnectedDevice(null);
        setConnectionStatus(ConnectionStatus.IDLE);
      }
    },
    [bleManager]
  );

  // 断开连接
  const disconnectFromDevice = useCallback(async () => {
    if (connectedDevice) {
      try {
        setConnectionStatus(ConnectionStatus.DISCONNECTING);
        await bleManager.cancelDeviceConnection(connectedDevice.id);
      } catch (err: any) {
        // 忽略 "operation was cancelled" 错误，因为设备可能已经断开
        if (!err.message.includes("cancelled")) {
          console.error("断开连接失败:", err);
          setError(`断开连接失败: ${err.message}`);
        }
      } finally {
        // 无论成功失败，都清理状态
        setConnectedDevice(null);
        setConnectionStatus(ConnectionStatus.IDLE);
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
    connectionStatus,
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
