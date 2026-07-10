/**
 * 相机权限引导页面
 * 当用户拒绝相机权限时显示，引导前往系统设置
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { openSettings } from "expo-linking";
import { UI_TEXTS, COLORS } from "../constants";

export default function PermissionGuide() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📷</Text>
      <Text style={styles.title}>{UI_TEXTS.PERMISSION_DENIED_TITLE}</Text>
      <Text style={styles.description}>
        {UI_TEXTS.PERMISSION_DENIED_DESC}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={openSettings}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {UI_TEXTS.PERMISSION_GO_SETTINGS}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.BG_DARK,
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.BG_DARK,
  },
});
