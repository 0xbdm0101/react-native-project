import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface TopBarProps {
  deviceName: string;
}

export function TopBar({ deviceName }: TopBarProps) {
  const router = useRouter();

  return (
    <View style={styles.topBar}>
      <Text style={styles.deviceName}>{deviceName}</Text>
      <View style={styles.actions}>
        <Pressable style={styles.btn} onPress={() => router.push("/search")}>
          <Ionicons name="search" size={22} color="#fff" />
        </Pressable>
        <Pressable style={styles.btn}>
          <Ionicons name="scan" size={22} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  deviceName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  btn: {
    padding: 8,
  },
});
