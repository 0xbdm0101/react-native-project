import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, FlatList, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Device } from "react-native-ble-plx";
import { useBLE } from "./hooks/useBLE";
import { BLEDeviceCard } from "./components/BLEDeviceCard";
import { ScanButton } from "./components/ScanButton";
import { DeviceDetail } from "./DeviceDetail";
import {
  BluetoothState,
  ScanStatus,
  ConnectionStatus,
  getBluetoothStateText,
} from "./constants";

export function BLEDeviceSearch() {
  const router = useRouter();
  const {
    bluetoothState,
    scanStatus,
    connectionStatus,
    devices,
    connectedDevice,
    error,
    startScan,
    stopScan,
    connectToDevice,
    disconnectFromDevice,
    clearError,
  } = useBLE();

  // 控制是否显示详情页
  const [showDetail, setShowDetail] = useState(false);

  // 当连接成功时，自动显示详情页
  useEffect(() => {
    if (connectedDevice) {
      setShowDetail(true);
    } else {
      setShowDetail(false);
    }
  }, [connectedDevice]);

  const handleDevicePress = (device: Device) => {
    if (connectedDevice?.id === device.id) {
      // 已连接，显示详情页
      setShowDetail(true);
    }
  };

  const handleConnect = async (device: Device) => {
    if (connectedDevice?.id === device.id) {
      // 已连接，显示详情页
      setShowDetail(true);
    } else {
      // 连接设备
      await connectToDevice(device);
    }
  };

  const handleScanPress = () => {
    if (scanStatus === "scanning") {
      stopScan();
    } else {
      startScan();
    }
  };

  // 如果已连接设备且需要显示详情
  if (connectedDevice && showDetail) {
    return (
      <DeviceDetail
        device={connectedDevice}
        onDisconnect={() => {
          disconnectFromDevice();
          setShowDetail(false);
        }}
        onBack={() => {
          // 返回列表，保持连接
          setShowDetail(false);
        }}
      />
    );
  }

  const renderBluetoothState = () => {
    if (bluetoothState === BluetoothState.POWERED_ON) return null;

    return (
      <View style={styles.stateBanner}>
        <Ionicons name="warning" size={20} color="#FF9800" />
        <View style={styles.stateContent}>
          <Text style={styles.stateText}>
            {getBluetoothStateText(bluetoothState)}
          </Text>
          <Text style={styles.stateDebug}>状态码: {bluetoothState}</Text>
        </View>
        {(bluetoothState === BluetoothState.UNAUTHORIZED ||
          bluetoothState === BluetoothState.POWERED_OFF) && (
          <Pressable
            style={styles.settingsBtn}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.settingsBtnText}>去设置</Text>
          </Pressable>
        )}
      </View>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <View style={styles.errorBanner}>
        <Ionicons name="alert-circle" size={20} color="#F44336" />
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={clearError}>
          <Ionicons name="close" size={18} color="#888" />
        </Pressable>
      </View>
    );
  };

  const renderEmpty = () => {
    if (scanStatus === "scanning") {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="bluetooth" size={48} color="#333" />
          <Text style={styles.emptyText}>正在搜索附近的蓝牙设备...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bluetooth-outline" size={48} color="#333" />
        <Text style={styles.emptyText}>
          {scanStatus === "error"
            ? "扫描出错，请重试"
            : "点击上方按钮开始扫描"}
        </Text>
      </View>
    );
  };

  const renderDevice = ({ item }: { item: Device }) => {
    const isConnected = connectedDevice ? (connectedDevice as unknown as Device).id === item.id : false;
    const isConnecting = connectionStatus === ConnectionStatus.CONNECTING && isConnected;
    return (
      <BLEDeviceCard
        device={item}
        isConnected={isConnected}
        connectionStatus={isConnecting ? ConnectionStatus.CONNECTING : ConnectionStatus.IDLE}
        onPress={handleDevicePress}
        onConnect={handleConnect}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>蓝牙设备</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 蓝牙状态提示 */}
      {renderBluetoothState()}

      {/* 错误提示 */}
      {renderError()}

      {/* 扫描按钮 */}
      <ScanButton status={scanStatus} onPress={handleScanPress} />

      {/* 设备数量 */}
      {devices.length > 0 && (
        <Text style={styles.count}>{devices.length} 台设备</Text>
      )}

      {/* 设备列表 */}
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backBtn: { padding: 8 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  placeholder: { width: 40 },
  stateBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,152,0,0.15)",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  stateText: {
    color: "#FF9800",
    fontSize: 14,
  },
  stateContent: {
    flex: 1,
  },
  stateDebug: {
    color: "#666",
    fontSize: 11,
    marginTop: 2,
  },
  settingsBtn: {
    backgroundColor: "rgba(255,152,0,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  settingsBtnText: {
    color: "#FF9800",
    fontSize: 13,
    fontWeight: "500",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(244,67,54,0.15)",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  errorText: {
    color: "#F44336",
    fontSize: 14,
    flex: 1,
  },
  count: {
    color: "#888",
    fontSize: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
});
