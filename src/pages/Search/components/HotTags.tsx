import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

interface HotTagsProps {
  tags: string[];
  onPressTag?: (tag: string) => void;
}

export function HotTags({ tags, onPressTag }: HotTagsProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>热门搜索</Text>
      <View style={styles.tags}>
        {tags.map((tag) => (
          <Pressable
            key={tag}
            style={styles.tag}
            onPress={() => onPressTag?.(tag)}
          >
            <Text style={styles.tagText}>{tag}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    backgroundColor: "#1c1c1e",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  tagText: {
    color: "#ccc",
    fontSize: 14,
  },
});
