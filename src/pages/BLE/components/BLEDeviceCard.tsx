import React from "react";
import { StyleSheet, Text, View, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Device } from "react-native-ble-plx";
import { getSignalStrength, formatRSSI, ConnectionStatus } from "../constants";
import { getDeviceIcon, getDeviceCategory } from "../ble-protocols";

interface BLEDeviceCardProps {
  device: Device;
  isConnected?: boolean;
  connectionStatus?: ConnectionStatus;
  onPress?: (device: Device) => void;
  onConnect?: (device: Device) => void;
}

export function BLEDeviceCard({
  device,
  isConnected = false,
  connectionStatus = ConnectionStatus.IDLE,
  onPress,
  onConnect,
}: BLEDeviceCardProps) {
  const signal = getSignalStrength(device.rssi);
  const deviceName = device.name || "未知设备";
  const deviceId = device.id.substring(0, 8).toUpperCase();
  const deviceIcon = getDeviceIcon(deviceName);
  const deviceCategory = getDeviceCategory(deviceName);

  return (
    <Pressable
      style={[styles.card, isConnected && styles.connectedCard]}
      onPress={() => onPress?.(device)}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={deviceIcon as any}
          size={28}
          color={isConnected ? "#4CAF50" : "#4FC3F7"}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {deviceName}
        </Text>
        <Text style={styles.deviceId}>ID: {deviceId}...</Text>
        <Text style={styles.deviceCategory}>{deviceCategory}</Text>
        <View style={styles.signalRow}>
          <View style={[styles.signalDot, { backgroundColor: signal.color }]} />
          <Text style={styles.signalText}>{signal.label}</Text>
          <Text style={styles.rssiText}>{formatRSSI(device.rssi)}</Text>
        </View>
      </View>

      <View style={styles.right}>
        {isConnected ? (
          <View style={styles.connectedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.connectedText}>已连接</Text>
          </View>
        ) : connectionStatus === ConnectionStatus.CONNECTING ? (
          <View style={styles.connectingBadge}>
            <ActivityIndicator size="small" color="#4FC3F7" />
            <Text style={styles.connectingText}>连接中</Text>
          </View>
        ) : (
          <Pressable
            style={styles.connectBtn}
            onPress={() => onConnect?.(device)}
          >
            <Text style={styles.connectBtnText}>连接</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  connectedCard: {
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(79,195,247,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  deviceId: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  deviceCategory: {
    color: "#666",
    fontSize: 11,
    marginTop: 2,
  },
  signalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 6,
  },
  signalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  signalText: {
    color: "#888",
    fontSize: 12,
  },
  rssiText: {
    color: "#666",
    fontSize: 11,
    marginLeft: 4,
  },
  right: {
    alignItems: "center",
    justifyContent: "center",
  },
  connectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  connectedText: {
    color: "#4CAF50",
    fontSize: 12,
  },
  connectingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  connectingText: {
    color: "#4FC3F7",
    fontSize: 12,
  },
  connectBtn: {
    backgroundColor: "rgba(79,195,247,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectBtnText: {
    color: "#4FC3F7",
    fontSize: 14,
    fontWeight: "500",
  },
});
