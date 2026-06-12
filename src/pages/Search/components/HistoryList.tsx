import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HistoryListProps {
  list: string[];
  onPressItem?: (item: string) => void;
  onClear?: () => void;
}

export function HistoryList({ list, onPressItem, onClear }: HistoryListProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>历史搜索</Text>
        <Pressable onPress={onClear}>
          <Ionicons name="trash-outline" size={18} color="#888" />
        </Pressable>
      </View>
      {list.map((item, index) => (
        <Pressable
          key={index}
          style={styles.item}
          onPress={() => onPressItem?.(item)}
        >
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.itemText}>{item}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#222",
  },
  itemText: {
    color: "#ccc",
    fontSize: 15,
  },
});
