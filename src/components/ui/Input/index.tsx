import React from "react";
import { View, TextInput, Pressable, StyleSheet, type TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "./constants";

interface InputProps extends TextInputProps {
  showClear?: boolean;
  inputStyle?: TextInputProps["style"];
}

export function Input({
  showClear = true,
  value,
  onChangeText,
  style,
  inputStyle,
  ...rest
}: InputProps) {
  const hasText = value && value.length > 0;

  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        style={[styles.input, inputStyle]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={COLORS.TEXT_SECONDARY}
        {...rest}
      />
      {showClear && hasText && (
        <Pressable style={styles.clearBtn} onPress={() => onChangeText?.("")} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color={COLORS.TEXT_SECONDARY} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.BG_INPUT,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
  },
  clearBtn: {
    paddingRight: 10,
    paddingLeft: 4,
  },
});
