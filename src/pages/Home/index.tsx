import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { TopBar } from "./components/TopBar";
import { MenuGrid } from "./components/MenuGrid";

const ROUTE_MAP: Record<string, string> = {
  iot: "/device-list",
  bluetooth: "/ble-search",
  mqtt: "/mqtt",
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
    <View style={styles.container}>
      <TopBar deviceName="我的设备" />
      <MenuGrid onPressItem={handlePressItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
