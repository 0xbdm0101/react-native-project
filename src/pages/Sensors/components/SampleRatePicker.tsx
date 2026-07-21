/**
 * 采样频率选择器
 * 三档预设按钮 + 快速模式耗电提示
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, STYLE_CONFIG, SAMPLE_RATES, UI_TEXTS } from "../constants";
import type { SampleRate } from "../types";

// ==================== Props ====================

interface SampleRatePickerProps {
  /** 当前选中的频率 */
  currentRate: SampleRate;
  /** 频率切换回调 */
  onRateChange: (rate: SampleRate) => void;
}

// ==================== 组件 ====================

export function SampleRatePicker({
  currentRate,
  onRateChange,
}: SampleRatePickerProps) {
  return (
    <View style={styles.container}>
      {/* 频率按钮 */}
      <View style={styles.buttonRow}>
        {SAMPLE_RATES.map((rate) => {
          const isActive = rate.intervalMs === currentRate.intervalMs;
          return (
            <TouchableOpacity
              key={rate.intervalMs}
              style={[
                styles.button,
                isActive
                  ? styles.buttonActive
                  : styles.buttonInactive,
              ]}
              onPress={() => onRateChange(rate)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.buttonText,
                  isActive
                    ? styles.buttonTextActive
                    : styles.buttonTextInactive,
                ]}
              >
                {rate.label}
              </Text>
              <Text
                style={[
                  styles.freqText,
                  isActive
                    ? styles.freqTextActive
                    : styles.freqTextInactive,
                ]}
              >
                {rate.frequencyHz}Hz
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 快速模式耗电提示 */}
      {currentRate.intervalMs === SAMPLE_RATES[2].intervalMs && (
        <View style={styles.warning}>
          <Text style={styles.warningIcon}>⚡</Text>
          <Text style={styles.warningText}>
            {UI_TEXTS.BATTERY_WARNING}
          </Text>
        </View>
      )}
    </View>
  );
}

// ==================== 样式 ====================

const { SAMPLE_RATE: SR } = STYLE_CONFIG;

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    borderRadius: SR.borderRadius,
    height: SR.height,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  buttonActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  buttonInactive: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  buttonTextActive: {
    color: COLORS.BG_DARK,
  },
  buttonTextInactive: {
    color: COLORS.TEXT_SECONDARY,
  },
  freqText: {
    fontSize: 11,
  },
  freqTextActive: {
    color: `${COLORS.BG_DARK}90`,
  },
  freqTextInactive: {
    color: COLORS.TEXT_SECONDARY,
  },
  warning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingLeft: 2,
  },
  warningIcon: {
    fontSize: 12,
  },
  warningText: {
    color: COLORS.WARNING,
    fontSize: 12,
  },
});
