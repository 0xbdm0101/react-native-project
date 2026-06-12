import React from "react";
import { StyleSheet, View } from "react-native";
import { TopBar } from "./components/TopBar";
import { MenuGrid } from "./components/MenuGrid";

export function Home() {
  const handlePressItem = (key: string) => {
    console.log("pressed:", key);
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
