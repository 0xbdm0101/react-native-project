/**
 * 传感器监控 — 枚举、常量、UI 文案
 */

// ==================== 枚举类型 ====================

/** 传感器类型 */
export enum SensorType {
  ACCELEROMETER = "accelerometer",
  GYROSCOPE = "gyroscope",
  MAGNETOMETER = "magnetometer",
  BAROMETER = "barometer",
  PEDOMETER = "pedometer",
  LIGHT_SENSOR = "light_sensor",
  DEVICE_MOTION = "device_motion",
}

/** 传感器可用性状态 */
export enum SensorAvailability {
  AVAILABLE = "available",
  UNAVAILABLE = "unavailable",
  PERMISSION_DENIED = "permission_denied",
}

/** 数据采集状态 */
export enum MonitorStatus {
  STOPPED = "stopped",
  RUNNING = "running",
  ERROR = "error",
}

/** 传感器类别（用于区分展示组件） */
export enum SensorCategory {
  TRIAXIAL = "triaxial",
  SCALAR = "scalar",
  PEDOMETER = "pedometer",
}

// ==================== 配置常量 ====================

/** 默认采样间隔（毫秒） */
export const DEFAULT_SAMPLE_INTERVAL_MS = 200;

/** 传感器数据点保留数量（用于波形图） */
export const MAX_DATA_POINTS = 100;

// ==================== 映射表 ====================

/** 传感器类型 → 中文名称 */
export const SENSOR_NAMES: Record<SensorType, string> = {
  [SensorType.ACCELEROMETER]: "加速度计",
  [SensorType.GYROSCOPE]: "陀螺仪",
  [SensorType.MAGNETOMETER]: "磁力计",
  [SensorType.BAROMETER]: "气压计",
  [SensorType.PEDOMETER]: "计步器",
  [SensorType.LIGHT_SENSOR]: "光线传感器",
  [SensorType.DEVICE_MOTION]: "设备运动",
};

/** 传感器类型 → 图标 */
export const SENSOR_ICONS: Record<SensorType, string> = {
  [SensorType.ACCELEROMETER]: "move",
  [SensorType.GYROSCOPE]: "sync",
  [SensorType.MAGNETOMETER]: "compass",
  [SensorType.BAROMETER]: "thermometer",
  [SensorType.PEDOMETER]: "walk",
  [SensorType.LIGHT_SENSOR]: "sunny",
  [SensorType.DEVICE_MOTION]: "phone-portrait",
};

/** 传感器类型 → 类别 */
export const SENSOR_CATEGORIES: Record<SensorType, SensorCategory> = {
  [SensorType.ACCELEROMETER]: SensorCategory.TRIAXIAL,
  [SensorType.GYROSCOPE]: SensorCategory.TRIAXIAL,
  [SensorType.MAGNETOMETER]: SensorCategory.TRIAXIAL,
  [SensorType.DEVICE_MOTION]: SensorCategory.TRIAXIAL,
  [SensorType.BAROMETER]: SensorCategory.SCALAR,
  [SensorType.LIGHT_SENSOR]: SensorCategory.SCALAR,
  [SensorType.PEDOMETER]: SensorCategory.PEDOMETER,
};

/** 传感器类型 → 单位 */
export const SENSOR_UNITS: Record<SensorType, { primary: string; secondary?: string }> = {
  [SensorType.ACCELEROMETER]: { primary: "g" },
  [SensorType.GYROSCOPE]: { primary: "rad/s" },
  [SensorType.MAGNETOMETER]: { primary: "μT" },
  [SensorType.BAROMETER]: { primary: "hPa", secondary: "m" },
  [SensorType.PEDOMETER]: { primary: "步" },
  [SensorType.LIGHT_SENSOR]: { primary: "lux" },
  [SensorType.DEVICE_MOTION]: { primary: "m/s²" },
};

/** 采样频率档位列表 */
export const SAMPLE_RATES = [
  { label: "慢速", intervalMs: 1000, frequencyHz: 1 },
  { label: "标准", intervalMs: 200, frequencyHz: 5 },
  { label: "快速", intervalMs: 50, frequencyHz: 20 },
];

// ==================== 工具函数 ====================

/**
 * 获取传感器中文名称
 */
export const getSensorName = (type: SensorType): string => {
  return SENSOR_NAMES[type] || `未知 (${type})`;
};

/**
 * 获取传感器图标
 */
export const getSensorIcon = (type: SensorType): string => {
  return SENSOR_ICONS[type] || "help-circle";
};

/**
 * 判断传感器是否为三轴类型
 */
export const isTriaxialSensor = (type: SensorType): boolean => {
  return SENSOR_CATEGORIES[type] === SensorCategory.TRIAXIAL;
};

// ==================== UI 文案 ====================

export const UI_TEXTS = {
  // 页面标题
  PAGE_TITLE: "传感器",
  DETAIL_PAGE_TITLE: (name: string) => `${name}详情`,

  // 状态
  STATUS_AVAILABLE: "可用",
  STATUS_UNAVAILABLE: "该设备不支持",
  STATUS_PERMISSION_DENIED: "权限未授予",
  STATUS_MONITORING: "采集中",
  STATUS_STOPPED: "已停止",

  // 按钮
  BUTTON_START: "开始",
  BUTTON_STOP: "停止",
  BUTTON_BACK: "返回",

  // 采样频率
  RATE_LABEL: "采样频率",
  BATTERY_WARNING: "高频率可能增加耗电",

  // 错误/空值
  ERROR_SENSOR_UNAVAILABLE: "传感器不可用",
  ERROR_PERMISSION_DENIED: "需要运动与健身权限才能使用计步器",
  ERROR_LOAD_FAILED: "加载传感器列表失败",
  LOADING: "正在检测传感器...",

  // 三轴标签
  AXIS_X: "X",
  AXIS_Y: "Y",
  AXIS_Z: "Z",

  // 气压计
  PRESSURE_LABEL: "气压",
  ALTITUDE_LABEL: "相对高度",

  // 计步器
  STEPS_LABEL: "累计步数",

  // 光线传感器
  ILLUMINANCE_LABEL: "照度",
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

  // 三轴颜色
  AXIS_X: "#EF5350",
  AXIS_Y: "#66BB6A",
  AXIS_Z: "#4FC3F7",

  // 状态颜色
  AVAILABLE: "#66BB6A",
  UNAVAILABLE: "#666666",
  PERMISSION_DENIED: "#FFA726",
} as const;

export const STYLE_CONFIG = {
  CARD: {
    borderRadius: 14,
    paddingH: 16,
    paddingV: 14,
    marginH: 16,
    marginV: 6,
  },
  VALUE_FONT_SIZE: 32,
  UNIT_FONT_SIZE: 14,
  SAMPLE_RATE: {
    borderRadius: 8,
    height: 36,
  },
} as const;
