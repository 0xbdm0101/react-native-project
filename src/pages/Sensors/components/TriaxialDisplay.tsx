/**
 * 三轴数据展示组件
 * 显示 X/Y/Z 三轴数值，带颜色标识
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS, UI_TEXTS } from "../constants";
import type { TriaxialValue } from "../types";

// ==================== Props ====================

interface TriaxialDisplayProps {
  /** 三轴数据 */
  data: TriaxialValue | null;
  /** 单位 */
  unit: string;
}

// ==================== 组件 ====================

export function TriaxialDisplay({ data, unit }: TriaxialDisplayProps) {
  const axes = [
    { label: UI_TEXTS.AXIS_X, value: data?.x ?? 0, color: COLORS.AXIS_X },
    { label: UI_TEXTS.AXIS_Y, value: data?.y ?? 0, color: COLORS.AXIS_Y },
    { label: UI_TEXTS.AXIS_Z, value: data?.z ?? 0, color: COLORS.AXIS_Z },
  ];

  return (
    <View style={styles.container}>
      {axes.map((axis) => (
        <View key={axis.label} style={styles.axisRow}>
          {/* 轴标签 */}
          <View
            style={[styles.axisLabel, { backgroundColor: `${axis.color}30` }]}
          >
            <Text style={[styles.axisLabelText, { color: axis.color }]}>
              {axis.label}
            </Text>
          </View>

          {/* 数值 */}
          <Text style={[styles.value, { color: axis.color }]}>
            {data ? axis.value.toFixed(4) : "—"}
          </Text>

          {/* 单位 */}
          <Text style={styles.unit}>{unit}</Text>

          {/* 进度条 */}
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  backgroundColor: axis.color,
                  width: `${Math.min(Math.abs(axis.value) * 100, 100)}%`,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 16,
  },
  axisRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  axisLabel: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  axisLabelText: {
    fontSize: 14,
    fontWeight: "700",
  },
  value: {
    fontSize: 28,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    minWidth: 90,
  },
  unit: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
    minWidth: 40,
  },
  barTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
  },
});
