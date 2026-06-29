/**
 * 网络通讯页面 — 类型定义
 */

import { HttpMethod, BodyType, WsStatus, Direction, RequestStatus } from "./constants";

// ==================== HTTP 相关类型 ====================

/** HTTP 请求头键值对 */
export interface HttpHeader {
  key: string;
  value: string;
  id: string; // UUID for React key
}

/** HTTP 请求 */
export interface HttpRequest {
  url: string;
  method: HttpMethod;
  headers: HttpHeader[];
  body: string;
  bodyType: BodyType;
  timeout: number;
}

/** HTTP 响应 */
export interface HttpResponse {
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
  size: number;
  error: string | null;
}

/** HTTP 请求状态 */
export interface HttpRequestState {
  status: RequestStatus;
  response: HttpResponse | null;
}

// ==================== WebSocket 相关类型 ====================

/** WebSocket 消息 */
export interface WsMessage {
  id: string;
  direction: Direction;
  content: string;
  timestamp: number;
}

/** WebSocket 连接状态 */
export interface WsConnectionState {
  url: string;
  status: WsStatus;
  messages: WsMessage[];
  reconnectCount: number;
  error: string | null;
}

// ==================== 请求历史相关类型 ====================

/** 请求历史记录（已保存的请求快照） */
export interface RequestHistoryItem {
  id: string;
  url: string;
  method: HttpMethod;
  headers: Array<{ key: string; value: string }>;
  body: string;
  bodyType: BodyType;
  timestamp: number;
}
