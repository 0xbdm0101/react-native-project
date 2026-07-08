import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { PageHeader } from "@/components/PageHeader";
import { DeviceCard } from "./components/DeviceCard";
import { DEVICE_LIST } from "./constants";

export function DeviceList() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <PageHeader title="我的设备" />
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
  },
  count: {
    color: "#888",
    fontSize: 14,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 20,
  },
});
