/**
 * 网络通讯页面 — 枚举、常量、UI 文案
 */

import { TIMEOUT } from "@/api/config";

// ==================== 枚举类型 ====================

/** HTTP 请求方法 */
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

/** Body 内容类型 */
export enum BodyType {
  JSON = "application/json",
  TEXT = "text/plain",
  FORM = "application/x-www-form-urlencoded",
}

/** WebSocket 连接状态 */
export enum WsStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  RECONNECTING = "reconnecting",
  ERROR = "error",
}

/** 消息方向 */
export enum Direction {
  INBOUND = "inbound",
  OUTBOUND = "outbound",
}

/** HTTP 请求状态 */
export enum RequestStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

// ==================== 配置常量 ====================

/** HTTP 请求方法映射（用于 UI 展示） */
export const HTTP_METHODS: HttpMethod[] = [
  HttpMethod.GET,
  HttpMethod.POST,
  HttpMethod.PUT,
  HttpMethod.DELETE,
];

/** Body 类型映射 */
export const BODY_TYPE_LABELS: Record<BodyType, string> = {
  [BodyType.JSON]: "JSON",
  [BodyType.TEXT]: "Text",
  [BodyType.FORM]: "Form URL Encoded",
};

/** WebSocket 重连配置 */
export const WS_RECONNECT_CONFIG = {
  delays: [2000, 4000, 8000] as const, // 重连间隔（毫秒）
  maxAttempts: 3,
};

/** 请求历史最大保存条数 */
export const MAX_HISTORY_SIZE = 20;

/** 请求超时（毫秒） */
export const REQUEST_TIMEOUT = TIMEOUT.DEFAULT;

/** 最大响应展示体积 */
export const MAX_RESPONSE_DISPLAY_SIZE = 1 * 1024 * 1024; // 1MB

// ==================== 映射表 ====================

/** 请求状态文案 */
export const STATUS_LABELS: Record<RequestStatus, string> = {
  [RequestStatus.IDLE]: "准备就绪",
  [RequestStatus.LOADING]: "发送中...",
  [RequestStatus.SUCCESS]: "请求完成",
  [RequestStatus.ERROR]: "请求失败",
};

/** WebSocket 连接状态文案 */
export const WS_STATUS_LABELS: Record<WsStatus, string> = {
  [WsStatus.DISCONNECTED]: "未连接",
  [WsStatus.CONNECTING]: "连接中...",
  [WsStatus.CONNECTED]: "已连接",
  [WsStatus.RECONNECTING]: "重连中...",
  [WsStatus.ERROR]: "连接错误",
};

/** 消息方向文案 */
export const DIRECTION_LABELS: Record<Direction, string> = {
  [Direction.INBOUND]: "接收",
  [Direction.OUTBOUND]: "发送",
};

// ==================== UI 文案 ====================

export const UI_TEXTS = {
  // 页面
  PAGE_TITLE: "网络通讯",
  TAB_HTTP: "HTTP",
  TAB_WS: "WebSocket",

  // HTTP 请求构建器
  URL_PLACEHOLDER: "输入请求 URL，例如 https://httpbin.org/get",
  SEND_BUTTON: "发送",
  CANCEL_BUTTON: "取消",
  HEADER_KEY_PLACEHOLDER: "Header 名称",
  HEADER_VALUE_PLACEHOLDER: "Header 值",
  ADD_HEADER: "+ 添加 Header",
  BODY_PLACEHOLDER: '输入请求 Body，例如 {"key": "value"}',
  NO_BODY: "无 Body",
  SELECT_METHOD: "请求方法",
  SELECT_BODY_TYPE: "Body 类型",

  // 响应展示
  RESPONSE_STATUS: "状态码",
  RESPONSE_TIME: "耗时",
  RESPONSE_HEADERS: "响应头",
  RESPONSE_BODY: "响应体",
  NO_RESPONSE: "点击发送按钮发起请求",
  RESPONSE_SIZE: "大小",
  RESPONSE_TRUNCATED: "（响应体过大，已截断前 1MB 内容）",

  // WebSocket
  WS_URL_PLACEHOLDER: "输入 WebSocket URL，例如 wss://echo.websocket.org",
  WS_CONNECT: "连接",
  WS_DISCONNECT: "断开",
  WS_MESSAGE_PLACEHOLDER: "输入消息...",
  WS_SEND: "发送",
  WS_EMPTY: "暂无消息",
  WS_CONNECT_FIRST: "请先连接 WebSocket 服务器",

  // 请求历史
  HISTORY_TITLE: "请求历史",
  HISTORY_EMPTY: "暂无历史记录",
  HISTORY_CLEAR: "清空",
  HISTORY_CLEAR_CONFIRM: "确认清空所有历史记录？",

  // 错误信息
  URL_REQUIRED: "请输入 URL",
  URL_INVALID: "URL 格式不正确，需要以 http:// 或 https:// 开头",
  WS_URL_INVALID: "WebSocket URL 需要以 ws:// 或 wss:// 开头",
  NETWORK_ERROR: "网络错误，无法连接到服务器",
  TIMEOUT_ERROR: "请求超时，请检查网络连接",
  CANCELLED: "请求已取消",
  UNKNOWN_ERROR: "未知错误",
} as const;

// ==================== 样式常量 ====================

export const COLORS = {
  PRIMARY: "#4FC3F7",
  SUCCESS: "#66BB6A",
  ERROR: "#EF5350",
  WARNING: "#FFA726",
  TEXT_PRIMARY: "#FFFFFF",
  TEXT_SECONDARY: "#9E9E9E",
  BG_DARK: "#1C1C1E",
  BG_CARD: "#2C2C2E",
  BG_INPUT: "#3A3A3C",
  BORDER: "#3A3A3C",
  METHOD_GET: "#61AFFE",
  METHOD_POST: "#49CC90",
  METHOD_PUT: "#FCA130",
  METHOD_DELETE: "#F93E3E",
  WS_CONNECTED: "#66BB6A",
  WS_DISCONNECTED: "#9E9E9E",
  WS_RECONNECTING: "#FFA726",
  DIRECTION_INBOUND: "#66BB6A",
  DIRECTION_OUTBOUND: "#4FC3F7",
} as const;

export const METHOD_COLORS: Record<HttpMethod, string> = {
  [HttpMethod.GET]: COLORS.METHOD_GET,
  [HttpMethod.POST]: COLORS.METHOD_POST,
  [HttpMethod.PUT]: COLORS.METHOD_PUT,
  [HttpMethod.DELETE]: COLORS.METHOD_DELETE,
};

export const WS_STATUS_COLORS: Record<WsStatus, string> = {
  [WsStatus.DISCONNECTED]: COLORS.WS_DISCONNECTED,
  [WsStatus.CONNECTING]: COLORS.PRIMARY,
  [WsStatus.CONNECTED]: COLORS.WS_CONNECTED,
  [WsStatus.RECONNECTING]: COLORS.WS_RECONNECTING,
  [WsStatus.ERROR]: COLORS.ERROR,
};

export const STYLE_CONFIG = {
  CARD: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
  },
  INPUT: {
    backgroundColor: COLORS.BG_INPUT,
    borderRadius: 8,
    padding: 12,
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
  },
  BUTTON: {
    borderRadius: 8,
    padding: 12,
  },
} as const;
