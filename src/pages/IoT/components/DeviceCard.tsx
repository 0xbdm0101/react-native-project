import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DeviceInfo } from "../constants";

interface DeviceCardProps {
  device: DeviceInfo;
  onPress?: (device: DeviceInfo) => void;
}

export function DeviceCard({ device, onPress }: DeviceCardProps) {
  return (
    <Pressable style={styles.card} onPress={() => onPress?.(device)}>
      <View style={styles.iconWrap}>
        <Ionicons name={device.icon as any} size={32} color="#4FC3F7" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{device.name}</Text>
        <Text style={styles.room}>{device.room}</Text>
      </View>
      <View style={styles.right}>
        <View style={[styles.dot, { backgroundColor: device.online ? "#4CAF50" : "#666" }]} />
        <Text style={styles.status}>{device.online ? "在线" : "离线"}</Text>
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
  room: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },
  right: {
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  status: {
    color: "#888",
    fontSize: 11,
  },
});
