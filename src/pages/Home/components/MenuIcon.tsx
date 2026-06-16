import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MenuItemData } from "../constants";

interface MenuIconProps {
  item: MenuItemData;
  onPress?: (key: string) => void;
}

export function MenuIcon({ item, onPress }: MenuIconProps) {
  return (
    <Pressable style={styles.item} onPress={() => onPress?.(item.key)}>
      <View style={styles.iconWrap}>
        <Ionicons name={item.icon as any} size={28} color="#4FC3F7" />
      </View>
      <Text style={styles.label}>{item.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    width: "20%",
    alignItems: "center",
    paddingVertical: 16,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(79,195,247,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  label: {
    color: "#ccc",
    fontSize: 12,
  },
});
