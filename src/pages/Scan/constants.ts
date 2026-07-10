/**
 * 扫码页面 — 枚举、常量、UI 文案
 */

// ==================== 枚举类型 ====================

/** 条码格式 */
export enum BarcodeFormat {
  QR = "qr",
  EAN_13 = "ean13",
  EAN_8 = "ean8",
  CODE_128 = "code128",
  CODE_39 = "code39",
  UPC_A = "upc_a",
  UPC_E = "upc_e",
}

/** 扫码内容分类 */
export enum ContentType {
  URL = "url",
  TEXT = "text",
  NUMBER = "number",
  UNKNOWN = "unknown",
}

/** 相机权限状态 */
export enum PermissionStatus {
  UNDETERMINED = "undetermined",
  GRANTED = "granted",
  DENIED = "denied",
}

/** 扫描模式 */
export enum ScanMode {
  CONTINUOUS = "continuous",
  SINGLE = "single",
}

/** 相机错误类型 */
export enum CameraErrorType {
  NOT_AVAILABLE = "not_available",
  IN_USE = "in_use",
  UNKNOWN = "unknown",
}

// ==================== 配置常量 ====================

/** 连续扫描去重间隔（毫秒） */
export const SCAN_DEBOUNCE_MS = 2000;

/** 无扫描结果超时提示（毫秒） */
export const NO_SCAN_TIMEOUT_MS = 10000;

/** Toast 提示显示时长（毫秒） */
export const TOAST_DURATION_MS = 2000;

/** 支持的扫码格式（全部开启） */
export const ALL_BARCODE_TYPES: BarcodeFormat[] = [
  BarcodeFormat.QR,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
];

/** 仅二维码格式（US1 MVP 使用） */
export const QR_ONLY_TYPES: BarcodeFormat[] = [BarcodeFormat.QR];

// ==================== 映射表 ====================

/** 码制 → 中文名称 */
export const BARCODE_FORMAT_NAMES: Record<BarcodeFormat, string> = {
  [BarcodeFormat.QR]: "QR 码",
  [BarcodeFormat.EAN_13]: "EAN-13 条形码",
  [BarcodeFormat.EAN_8]: "EAN-8 条形码",
  [BarcodeFormat.CODE_128]: "Code-128 条形码",
  [BarcodeFormat.CODE_39]: "Code-39 条形码",
  [BarcodeFormat.UPC_A]: "UPC-A 条形码",
  [BarcodeFormat.UPC_E]: "UPC-E 条形码",
};

/** 内容类型 → 操作按钮可用性 */
export const CONTENT_TYPE_ACTIONS: Record<
  ContentType,
  { canOpen: boolean; canCopy: boolean; canShare: boolean }
> = {
  [ContentType.URL]: { canOpen: true, canCopy: true, canShare: true },
  [ContentType.TEXT]: { canOpen: false, canCopy: true, canShare: true },
  [ContentType.NUMBER]: { canOpen: false, canCopy: true, canShare: true },
  [ContentType.UNKNOWN]: { canOpen: false, canCopy: true, canShare: true },
};

/** 权限状态 → 中文文案 */
export const PERMISSION_STATUS_LABELS: Record<PermissionStatus, string> = {
  [PermissionStatus.UNDETERMINED]: "未请求",
  [PermissionStatus.GRANTED]: "已授权",
  [PermissionStatus.DENIED]: "已拒绝",
};

/** 相机错误 → 用户提示文案 */
export const CAMERA_ERROR_MESSAGES: Record<CameraErrorType, string> = {
  [CameraErrorType.NOT_AVAILABLE]: "摄像头不可用，请检查设备",
  [CameraErrorType.IN_USE]: "摄像头被其他应用占用，请关闭后重试",
  [CameraErrorType.UNKNOWN]: "摄像头异常，请重启应用后重试",
};

// ==================== 工具函数 ====================

/**
 * 根据扫码数据自动推断内容类型
 */
export const getContentType = (data: string): ContentType => {
  if (!data || data.trim().length === 0) return ContentType.UNKNOWN;
  if (/^https?:\/\//i.test(data.trim())) return ContentType.URL;
  if (/^\d+$/.test(data.trim())) return ContentType.NUMBER;
  return ContentType.TEXT;
};

/**
 * 获取码制中文名称
 */
export const getBarcodeFormatName = (format: BarcodeFormat): string => {
  return BARCODE_FORMAT_NAMES[format] || `未知 (${format})`;
};

/**
 * 检查是否为条码格式（非 QR）
 */
export const isBarcodeFormat = (format: BarcodeFormat): boolean => {
  return format !== BarcodeFormat.QR;
};

/**
 * 根据相机错误获取用户提示
 */
export const getCameraErrorMessage = (err: any): string => {
  if (!err) return CAMERA_ERROR_MESSAGES[CameraErrorType.UNKNOWN];
  const msg = typeof err === "string" ? err : err?.message || "";
  if (msg.toLowerCase().includes("not available") || msg.includes("不可用"))
    return CAMERA_ERROR_MESSAGES[CameraErrorType.NOT_AVAILABLE];
  if (msg.toLowerCase().includes("in use") || msg.includes("占用"))
    return CAMERA_ERROR_MESSAGES[CameraErrorType.IN_USE];
  return CAMERA_ERROR_MESSAGES[CameraErrorType.UNKNOWN];
};

export const UI_TEXTS = {
  // 页面
  PAGE_TITLE: "扫码",

  // 权限引导
  PERMISSION_DENIED_TITLE: "需要相机权限",
  PERMISSION_DENIED_DESC: "扫码功能需要使用您的相机。请在系统设置中允许应用访问相机。",
  PERMISSION_GO_SETTINGS: "前往设置",

  // 取景框提示
  VIEWFINDER_HINT: "将二维码或条形码放入取景框内",
  LOW_LIGHT_HINT: "光线不足？轻点开启闪光灯",

  // 扫描状态
  SCANNING: "扫描中...",
  SCAN_FAILED: "未识别到条码，请调整角度或距离",
  SCAN_EMPTY: "二维码内容为空",

  // 结果面板
  RESULT_TITLE: "扫描结果",
  RESULT_FORMAT: "码制",
  RESULT_TIME: "识别时间",

  // 按钮
  BUTTON_COPY: "复制",
  BUTTON_COPIED: "已复制",
  BUTTON_SHARE: "分享",
  BUTTON_OPEN_LINK: "打开链接",
  BUTTON_SCAN_AGAIN: "继续扫描",

  // 错误信息
  CAMERA_UNAVAILABLE: "摄像头不可用",
} as const;

// ==================== 样式常量 ====================

export const COLORS = {
  PRIMARY: "#4FC3F7",
  SUCCESS: "#66BB6A",
  ERROR: "#EF5350",
  WARNING: "#FFA726",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#9E9E9E",
  BG_DARK: "#000000",
  BG_CARD: "#1C1C1E",
  BG_OVERLAY: "rgba(0, 0, 0, 0.6)",
  VIEWFINDER: "rgba(255, 255, 255, 0.5)",
  VIEWFINDER_CORNER: "#4FC3F7",
  HIGHLIGHT: "#66BB6A",
  QR_BADGE: "#4FC3F7",
  BARCODE_BADGE: "#FFA726",
} as const;

export const STYLE_CONFIG = {
  VIEWFINDER: {
    width: 250,
    height: 250,
    borderWidth: 2,
    cornerLength: 20,
    cornerWidth: 3,
  },
  RESULT_PANEL: {
    maxHeight: 200,
    borderRadius: 14,
  },
} as const;
