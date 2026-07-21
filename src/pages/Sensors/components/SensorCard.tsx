/**
 * 传感器列表卡片组件
 * 显示传感器名称、图标、可用状态，不可用时置灰
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SensorAvailability } from "../constants";
import { COLORS, STYLE_CONFIG, UI_TEXTS } from "../constants";
import type { SensorInfo } from "../types";

// ==================== Props ====================

interface SensorCardProps {
  /** 传感器信息 */
  sensor: SensorInfo;
  /** 点击回调 */
  onPress: (sensor: SensorInfo) => void;
}

// ==================== 组件 ====================

export function SensorCard({ sensor, onPress }: SensorCardProps) {
  const isAvailable = sensor.availability === SensorAvailability.AVAILABLE;
  const isClickable =
    sensor.availability === SensorAvailability.AVAILABLE ||
    sensor.availability === SensorAvailability.PERMISSION_DENIED;

  const getStatusBadge = () => {
    switch (sensor.availability) {
      case SensorAvailability.AVAILABLE:
        return { text: UI_TEXTS.STATUS_AVAILABLE, color: COLORS.AVAILABLE };
      case SensorAvailability.UNAVAILABLE:
        return {
          text: sensor.unavailableReason ?? UI_TEXTS.STATUS_UNAVAILABLE,
          color: COLORS.UNAVAILABLE,
        };
      case SensorAvailability.PERMISSION_DENIED:
        return {
          text: UI_TEXTS.STATUS_PERMISSION_DENIED,
          color: COLORS.PERMISSION_DENIED,
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <TouchableOpacity
      style={[styles.card, !isAvailable && styles.cardDisabled]}
      onPress={() => isClickable && onPress(sensor)}
      activeOpacity={isClickable ? 0.7 : 1}
      disabled={!isClickable}
    >
      {/* 图标 */}
      <View
        style={[
          styles.iconContainer,
          isAvailable ? styles.iconAvailable : styles.iconDisabled,
        ]}
      >
        <Ionicons
          name={sensor.icon as any}
          size={28}
          color={isAvailable ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY}
        />
      </View>

      {/* 信息 */}
      <View style={styles.info}>
        <Text style={[styles.name, !isAvailable && styles.textDisabled]}>
          {sensor.name}
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: `${badge.color}20` },
          ]}
        >
          <View style={[styles.badgeDot, { backgroundColor: badge.color }]} />
          <Text style={[styles.badgeText, { color: badge.color }]}>
            {badge.text}
          </Text>
        </View>
      </View>

      {/* 箭头 */}
      {isClickable && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={COLORS.TEXT_SECONDARY}
        />
      )}
    </TouchableOpacity>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.BG_CARD,
    borderRadius: STYLE_CONFIG.CARD.borderRadius,
    paddingHorizontal: STYLE_CONFIG.CARD.paddingH,
    paddingVertical: STYLE_CONFIG.CARD.paddingV,
    marginHorizontal: STYLE_CONFIG.CARD.marginH,
    marginVertical: STYLE_CONFIG.CARD.marginV,
  },
  cardDisabled: {
    opacity: 0.45,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  iconAvailable: {
    backgroundColor: `${COLORS.PRIMARY}15`,
  },
  iconDisabled: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  info: {
    flex: 1,
  },
  name: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  textDisabled: {
    color: COLORS.TEXT_SECONDARY,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
