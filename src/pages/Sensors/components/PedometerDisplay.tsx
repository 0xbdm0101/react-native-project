/**
 * 计步器数据展示组件
 * 显示累计步数大号数值
 */

import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS, STYLE_CONFIG, UI_TEXTS } from "../constants";
import type { PedometerValue } from "../types";

// ==================== Props ====================

interface PedometerDisplayProps {
  /** 累计步数 */
  steps: number | null;
  /** 加载中 */
  loading?: boolean;
}

// ==================== 组件 ====================

export function PedometerDisplay({ steps, loading = false }: PedometerDisplayProps) {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>{UI_TEXTS.STEPS_LABEL}</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>
            {steps != null ? steps.toLocaleString() : "—"}
          </Text>
          <Text style={styles.unit}>{UI_TEXTS.STEPS_LABEL.slice(-1)}</Text>
        </View>
      </View>
    </View>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 160,
  },
  card: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: STYLE_CONFIG.CARD.borderRadius,
    padding: 24,
    alignItems: "center",
    width: "100%",
  },
  label: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    marginBottom: 12,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  value: {
    color: COLORS.PRIMARY,
    fontSize: 48,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  unit: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: STYLE_CONFIG.UNIT_FONT_SIZE,
  },
});
