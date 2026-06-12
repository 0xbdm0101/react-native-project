import React from "react";
import { StyleSheet, View } from "react-native";
import { MenuIcon } from "./MenuIcon";
import { MENU_LIST } from "../constants";

interface MenuGridProps {
  onPressItem?: (key: string) => void;
}

export function MenuGrid({ onPressItem }: MenuGridProps) {
  return (
    <View style={styles.grid}>
      {MENU_LIST.map((item) => (
        <MenuIcon key={item.key} item={item} onPress={onPressItem} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    paddingTop: 16,
  },
});
