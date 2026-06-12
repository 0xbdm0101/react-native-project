import React from "react";
import { StyleSheet, View, TextInput, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onCancel?: () => void;
}

export function SearchInput({ value, onChangeText, onCancel }: SearchInputProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrap}>
        <Ionicons name="search" size={18} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="搜索"
          placeholderTextColor="#888"
          value={value}
          onChangeText={onChangeText}
          autoFocus
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChangeText("")} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color="#888" />
          </Pressable>
        )}
      </View>
      <Pressable onPress={onCancel} style={styles.cancelBtn}>
        <Text style={styles.cancelText}>取消</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 36,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    padding: 0,
  },
  clearBtn: {
    marginLeft: 6,
    padding: 2,
  },
  cancelBtn: {
    paddingVertical: 4,
  },
  cancelText: {
    color: "#4FC3F7",
    fontSize: 16,
  },
});
