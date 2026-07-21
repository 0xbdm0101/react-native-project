import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { TopBar } from "./components/TopBar";
import { MenuGrid } from "./components/MenuGrid";
import { ApiDemo } from "./components/ApiDemo";

const ROUTE_MAP: Record<string, string> = {
  iot: "/device-list",
  bluetooth: "/ble-search",
  mqtt: "/mqtt",
  network: "/network",
  qrScanner: "/scan",
  sensors: "/sensors",
};

export function Home() {
  const router = useRouter();

  const handlePressItem = (key: string) => {
    const route = ROUTE_MAP[key];
    if (route) {
      router.push(route);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TopBar deviceName="我的设备" />
      <MenuGrid onPressItem={handlePressItem} />
      <ApiDemo />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
