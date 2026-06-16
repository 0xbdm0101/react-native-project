import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { DeviceCard } from "./components/DeviceCard";
import { DEVICE_LIST } from "./constants";

export function DeviceList() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>我的设备</Text>
        <View style={styles.placeholder} />
      </View>
      <Text style={styles.count}>{DEVICE_LIST.length} 台设备</Text>
      {DEVICE_LIST.map((device) => (
        <DeviceCard
          key={device.did}
          device={device}
          onPress={() => router.push("/device-control")}
        />
      ))}
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
    marginBottom: 8,
  },
  backBtn: { padding: 8 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  placeholder: { width: 40 },
  count: {
    color: "#888",
    fontSize: 14,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 20,
  },
});
