/**
 * 扫码页面 — 主入口
 * 摄像头预览 + 取景框 + 结果面板，权限引导处理
 */

import React, { useEffect, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, AppState } from "react-native";
import type { AppStateStatus } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PageHeader } from "@/components/PageHeader";
import { useScanner } from "./hooks/useScanner";
import CameraPreview from "./components/CameraPreview";
import ScanResultPanel from "./components/ScanResultPanel";
import PermissionGuide from "./components/PermissionGuide";
import { UI_TEXTS, COLORS, PermissionStatus } from "./constants";

export default function ScanPage() {
  const {
    permissionStatus,
    scanResult,
    torchEnabled,
    isActive,
    error,
    showScanHint,
    barcodeTypes,
    requestCameraPermission,
    handleBarcodeScanned,
    toggleTorch,
    clearResult,
    setIsActive,
  } = useScanner();

  // 首次进入时请求相机权限
  useEffect(() => {
    if (permissionStatus === PermissionStatus.UNDETERMINED) {
      console.log("📷 请求相机权限...");
      requestCameraPermission();
    }
  }, [permissionStatus, requestCameraPermission]);

  // 监听应用前后台切换，暂停/恢复摄像头
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        setIsActive(true);
        console.log("📷 摄像头恢复");
      } else {
        setIsActive(false);
        console.log("📷 摄像头暂停");
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
      console.log("📷 扫码页面已卸载，释放摄像头资源");
    };
  }, [setIsActive]);

  // 闪光灯按钮
  const TorchButton = useCallback(() => {
    if (permissionStatus !== PermissionStatus.GRANTED) return null;

    return (
      <TouchableOpacity
        onPress={toggleTorch}
        style={styles.torchButton}
        activeOpacity={0.7}
      >
        <Ionicons
          name={torchEnabled ? "flash" : "flash-off"}
          size={22}
          color={torchEnabled ? COLORS.WARNING : COLORS.TEXT_PRIMARY}
        />
      </TouchableOpacity>
    );
  }, [permissionStatus, torchEnabled, toggleTorch]);

  // 渲染内容
  const renderContent = () => {
    // 权限已拒绝 → 引导页
    if (permissionStatus === PermissionStatus.DENIED) {
      return <PermissionGuide />;
    }

    // 权限未请求 → 加载中（等待 useEffect 请求权限）
    if (permissionStatus === PermissionStatus.UNDETERMINED) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>正在请求相机权限...</Text>
        </View>
      );
    }

    // 相机错误
    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    // 正常扫码
    return (
      <View style={styles.cameraContainer}>
        <CameraPreview
          isActive={isActive}
          torchEnabled={torchEnabled}
          barcodeTypes={barcodeTypes}
          onBarcodeScanned={handleBarcodeScanned}
          highlightBounds={scanResult?.bounds ?? null}
          showScanHint={showScanHint}
        />
        <ScanResultPanel result={scanResult} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 顶部导航 */}
      <PageHeader
        title={UI_TEXTS.PAGE_TITLE}
        right={<TorchButton />}
        titleCentered
      />
      {/* 内容区域 */}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_DARK,
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  torchButton: {
    padding: 8,
  },
  loadingText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 16,
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
