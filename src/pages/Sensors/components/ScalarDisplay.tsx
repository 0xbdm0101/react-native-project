/**
 * 标量数据展示组件
 * 显示单个主值（+ 可选次值），带单位
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, STYLE_CONFIG } from "../constants";
import type { ScalarValue } from "../types";

// ==================== Props ====================

interface ScalarDisplayProps {
  /** 标量数据 */
  data: ScalarValue | null;
  /** 主值单位 */
  unit: string;
  /** 次值单位 */
  secondaryUnit?: string;
  /** 主值标签 */
  primaryLabel: string;
  /** 次值标签 */
  secondaryLabel?: string;
}

// ==================== 组件 ====================

export function ScalarDisplay({
  data,
  unit,
  secondaryUnit,
  primaryLabel,
  secondaryLabel,
}: ScalarDisplayProps) {
  return (
    <View style={styles.container}>
      {/* 主值 */}
      <View style={styles.card}>
        <Text style={styles.label}>{primaryLabel}</Text>
        <View style={styles.valueRow}>
          <Text style={styles.value}>
            {data ? data.primary.toFixed(2) : "—"}
          </Text>
          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>

      {/* 次值（仅在有 secondary 数据时显示） */}
      {secondaryLabel && (
        <View style={styles.card}>
          <Text style={styles.label}>{secondaryLabel}</Text>
          <View style={styles.valueRow}>
            <Text style={styles.valueSecondary}>
              {data?.secondary != null ? data.secondary.toFixed(1) : "—"}
            </Text>
            {secondaryUnit && (
              <Text style={styles.unit}>{secondaryUnit}</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 14,
  },
  card: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: STYLE_CONFIG.CARD.borderRadius,
    padding: 20,
    alignItems: "center",
  },
  label: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  value: {
    color: COLORS.PRIMARY,
    fontSize: STYLE_CONFIG.VALUE_FONT_SIZE,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  valueSecondary: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 26,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
  },
  unit: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: STYLE_CONFIG.UNIT_FONT_SIZE,
  },
});
