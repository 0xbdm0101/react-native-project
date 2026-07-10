/**
 * 扫码页面 — 类型定义
 */

import {
  BarcodeFormat,
  ContentType,
  PermissionStatus,
  ScanMode,
  CameraErrorType,
} from "./constants";

// ==================== 扫码结果 ====================

/** 扫码识别结果 */
export interface ScanResult {
  /** 解析出的原始文本内容 */
  data: string;
  /** 码制类型 */
  format: BarcodeFormat;
  /** 内容分类 */
  contentType: ContentType;
  /** 识别时间戳 (ms) */
  timestamp: number;
  /** 码在取景框中的位置坐标（用于高亮标记） */
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// ==================== 相机状态 ====================

/** 相机状态 */
export interface CameraState {
  /** 相机权限状态 */
  permissionStatus: PermissionStatus;
  /** 摄像头是否正在预览 */
  isActive: boolean;
  /** 闪光灯是否开启 */
  torchEnabled: boolean;
  /** 相机错误信息 */
  error: string | null;
}

// ==================== 扫描器状态 ====================

/** 扫描器完整状态 */
export interface ScannerState {
  camera: CameraState;
  scanResult: ScanResult | null;
  scanMode: ScanMode;
}
