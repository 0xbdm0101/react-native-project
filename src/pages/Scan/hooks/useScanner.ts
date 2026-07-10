/**
 * 条码扫描逻辑 Hook
 * 管理相机权限、扫描状态、闪光灯控制、扫描结果
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { useCameraPermissions } from "expo-camera";
import {
  PermissionStatus,
  ScanMode,
  CameraErrorType,
  SCAN_DEBOUNCE_MS,
  NO_SCAN_TIMEOUT_MS,
  ALL_BARCODE_TYPES,
  getContentType,
  getCameraErrorMessage,
} from "../constants";
import type { ScanResult, CameraState } from "../types";
import type { BarcodeScanningResult } from "expo-camera";

// ==================== 工具函数 ====================

/** 将 expo-camera 的 PermissionStatus → 应用的 PermissionStatus */
const mapExpoPermission = (
  status: string | null
): PermissionStatus => {
  switch (status) {
    case "granted":
      return PermissionStatus.GRANTED;
    case "denied":
      return PermissionStatus.DENIED;
    default:
      return PermissionStatus.UNDETERMINED;
  }
};

/** 将 expo-camera 的 BarcodeScanningResult → ScanResult */
const toScanResult = (result: BarcodeScanningResult): ScanResult => ({
  data: result.data,
  format: result.type as ScanResult["format"],
  contentType: getContentType(result.data),
  timestamp: Date.now(),
  bounds: result.bounds
    ? {
        x: result.bounds.origin.x,
        y: result.bounds.origin.y,
        width: result.bounds.size.width,
        height: result.bounds.size.height,
      }
    : undefined,
});

// ==================== Hook ====================

export function useScanner() {
  const [permission, requestPermission] = useCameraPermissions();

  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanMode] = useState<ScanMode>(ScanMode.CONTINUOUS);

  // 防抖与超时
  const lastScanTimeRef = useRef<number>(0);
  const lastScanDataRef = useRef<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showScanHint, setShowScanHint] = useState(false);

  // 相机权限状态
  const permissionStatus: PermissionStatus = mapExpoPermission(
    permission?.status ?? null
  );

  // 构造 CameraState
  const cameraState: CameraState = {
    permissionStatus,
    isActive,
    torchEnabled,
    error,
  };

  // 超时提示：开启扫描后 N 秒无结果则提示
  useEffect(() => {
    if (isActive && !scanResult && permissionStatus === PermissionStatus.GRANTED) {
      timeoutRef.current = setTimeout(() => {
        setShowScanHint(true);
      }, NO_SCAN_TIMEOUT_MS);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setShowScanHint(false);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isActive, scanResult, permissionStatus]);

  // 请求权限
  const requestCameraPermission = useCallback(async () => {
    try {
      const result = await requestPermission();
      if (!result.granted) {
        console.log("📷 相机权限被拒绝");
      }
    } catch (err: any) {
      if (!err.message?.includes("cancelled")) {
        console.error("❌ 请求相机权限失败:", err);
      }
    }
  }, [requestPermission]);

  // 处理扫码结果
  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      const now = Date.now();

      // 防抖：同一内容在 SCAN_DEBOUNCE_MS 内不重复处理
      if (
        result.data === lastScanDataRef.current &&
        now - lastScanTimeRef.current < SCAN_DEBOUNCE_MS
      ) {
        return;
      }

      // 空内容不处理
      if (!result.data || result.data.trim().length === 0) {
        console.log("📷 扫描到空内容，已忽略");
        return;
      }

      lastScanTimeRef.current = now;
      lastScanDataRef.current = result.data;

      const newResult = toScanResult(result);
      console.log("✅ 扫码识别:", newResult.data, "类型:", newResult.format);
      setScanResult(newResult);
    },
    []
  );

  // 切换闪光灯
  const toggleTorch = useCallback(() => {
    setTorchEnabled((prev) => !prev);
    console.log("💡 闪光灯:", !torchEnabled ? "开启" : "关闭");
  }, [torchEnabled]);

  // 清除结果（用于重新扫描）
  const clearResult = useCallback(() => {
    setScanResult(null);
    lastScanDataRef.current = "";
    lastScanTimeRef.current = 0;
  }, []);

  // 设置错误
  const setCameraError = useCallback((err: any) => {
    const message = getCameraErrorMessage(err);
    setError(message);
    console.error("❌ 相机错误:", message);
  }, []);

  // 清除错误
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // 状态
    permissionStatus,
    cameraState,
    scanResult,
    torchEnabled,
    isActive,
    error,
    scanMode,
    showScanHint,

    // 动作
    requestCameraPermission,
    handleBarcodeScanned,
    toggleTorch,
    clearResult,
    setCameraError,
    clearError,
    setIsActive,

    // 扫码配置
    barcodeTypes: ALL_BARCODE_TYPES,
  };
}
