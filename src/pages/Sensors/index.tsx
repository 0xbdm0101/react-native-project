/**
 * 传感器列表页 — 主页面
 * 展示所有传感器及可用状态，点击进入详情页
 */

import React from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { PageHeader } from "@/components/PageHeader";
import { useSensorList } from "./hooks/useSensorList";
import { SensorCard } from "./components/SensorCard";
import { UI_TEXTS, COLORS, SensorAvailability } from "./constants";
import type { SensorInfo } from "./types";

export default function SensorsPage() {
  const router = useRouter();
  const { sensors, loading, error } = useSensorList();

  const handlePressSensor = (sensor: SensorInfo) => {
    if (
      sensor.availability === SensorAvailability.AVAILABLE ||
      sensor.availability === SensorAvailability.PERMISSION_DENIED
    ) {
      router.push({
        pathname: "/sensor-detail",
        params: { type: sensor.type },
      });
    }
  };

  // 错误状态
  if (error) {
    return (
      <View style={styles.container}>
        <PageHeader title={UI_TEXTS.PAGE_TITLE} />
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{UI_TEXTS.ERROR_LOAD_FAILED}</Text>
          <Text style={styles.errorDetail}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PageHeader title={UI_TEXTS.PAGE_TITLE} />

      {/* 加载中 */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>{UI_TEXTS.LOADING}</Text>
        </View>
      ) : (
        <FlatList
          data={sensors}
          keyExtractor={(item) => item.type}
          renderItem={({ item }) => (
            <SensorCard sensor={item} onPress={handlePressSensor} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.summary}>
              共 {sensors.length} 个传感器，
              {sensors.filter((s) => s.availability === SensorAvailability.AVAILABLE).length} 个可用
            </Text>
          }
        />
      )}
    </View>
  );
}

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
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  summary: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loadingText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    marginTop: 12,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 16,
    textAlign: "center",
  },
  errorDetail: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
});
