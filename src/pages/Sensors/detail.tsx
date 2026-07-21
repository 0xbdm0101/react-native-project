/**
 * 传感器详情页
 * 实时数据展示 + 开始/停止 + 采样频率调节
 */

import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PageHeader } from "@/components/PageHeader";
import { useSensorData } from "./hooks/useSensorData";
import { TriaxialDisplay } from "./components/TriaxialDisplay";
import { ScalarDisplay } from "./components/ScalarDisplay";
import { PedometerDisplay } from "./components/PedometerDisplay";
import { SampleRatePicker } from "./components/SampleRatePicker";
import {
  UI_TEXTS,
  COLORS,
  STYLE_CONFIG,
  SensorCategory,
  SensorType,
  MonitorStatus,
  SENSOR_CATEGORIES,
  SENSOR_NAMES,
  SENSOR_UNITS,
} from "./constants";
import type { SampleRate } from "./types";

export default function SensorDetailPage() {
  const { type } = useLocalSearchParams<{ type: SensorType }>();

  const sensorType = type ?? null;
  const category = sensorType ? SENSOR_CATEGORIES[sensorType] : null;
  const sensorName = sensorType ? SENSOR_NAMES[sensorType] : "";
  const units = sensorType ? SENSOR_UNITS[sensorType] : { primary: "" };

  const {
    data,
    monitorStatus,
    error,
    sampleRate,
    startMonitoring,
    stopMonitoring,
    changeSampleRate,
  } = useSensorData(sensorType);

  const isRunning = monitorStatus === MonitorStatus.RUNNING;

  const handleToggle = useCallback(() => {
    if (isRunning) {
      stopMonitoring();
    } else {
      startMonitoring();
    }
  }, [isRunning, startMonitoring, stopMonitoring]);

  const handleRateChange = useCallback(
    (rate: SampleRate) => {
      changeSampleRate(rate);
      // 如果当前正在采集，需要重启以应用新频率
      if (isRunning) {
        stopMonitoring();
        setTimeout(() => startMonitoring(), 100);
      }
    },
    [isRunning, changeSampleRate, stopMonitoring, startMonitoring]
  );

  // 渲染数据展示组件
  const renderDataDisplay = () => {
    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (!category) return null;

    switch (category) {
      case SensorCategory.TRIAXIAL:
        return (
          <TriaxialDisplay
            data={data as any}
            unit={units.primary}
          />
        );
      case SensorCategory.SCALAR:
        return (
          <ScalarDisplay
            data={data as any}
            unit={units.primary}
            secondaryUnit={units.secondary}
            primaryLabel={
              sensorType === SensorType.LIGHT_SENSOR
                ? UI_TEXTS.ILLUMINANCE_LABEL
                : UI_TEXTS.PRESSURE_LABEL
            }
            secondaryLabel={
              sensorType === SensorType.BAROMETER
                ? UI_TEXTS.ALTITUDE_LABEL
                : undefined
            }
          />
        );
      case SensorCategory.PEDOMETER:
        return (
          <PedometerDisplay
            steps={data ? (data as any).steps : null}
            loading={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <PageHeader
        title={UI_TEXTS.DETAIL_PAGE_TITLE(sensorName)}
      />

      {/* 采样频率选择器 */}
      <View style={styles.rateSection}>
        <Text style={styles.rateLabel}>{UI_TEXTS.RATE_LABEL}</Text>
        <SampleRatePicker
          currentRate={sampleRate}
          onRateChange={handleRateChange}
        />
      </View>

      {/* 数据展示 */}
      <View style={styles.dataSection}>{renderDataDisplay()}</View>

      {/* 底部分隔 */}
      <View style={styles.spacer} />

      {/* 开始/停止按钮 */}
      <View style={styles.controlSection}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            isRunning ? styles.stopButton : styles.startButton,
          ]}
          onPress={handleToggle}
          activeOpacity={0.7}
        >
          <Text style={styles.controlButtonText}>
            {isRunning ? UI_TEXTS.BUTTON_STOP : UI_TEXTS.BUTTON_START}
          </Text>
        </TouchableOpacity>
        <Text style={styles.statusText}>
          {isRunning ? UI_TEXTS.STATUS_MONITORING : UI_TEXTS.STATUS_STOPPED}
        </Text>
      </View>
    </View>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  rateSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  rateLabel: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
  dataSection: {
    flex: 1,
    justifyContent: "center",
  },
  spacer: {
    flex: 1,
  },
  controlSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 10,
  },
  controlButton: {
    paddingVertical: 14,
    borderRadius: STYLE_CONFIG.CARD.borderRadius,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: COLORS.SUCCESS,
  },
  stopButton: {
    backgroundColor: COLORS.ERROR,
  },
  controlButtonText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: "600",
  },
  statusText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
    textAlign: "center",
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
