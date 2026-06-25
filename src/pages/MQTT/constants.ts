/**
 * MQTT 协议常量和类型定义
 */

// ==================== 枚举类型 ====================

/** 连接状态 */
export enum ConnectionStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  RECONNECTING = "reconnecting",
  ERROR = "error",
}

/** QoS 等级 */
export enum QoS {
  QOS_0 = 0, // 最多一次
  QOS_1 = 1, // 至少一次
  QOS_2 = 2, // 恰好一次
}

/** 协议类型 */
export enum Protocol {
  TCP = "mqtt",
  WS = "ws",
  WSS = "wss",
}

/** 消息方向 */
export enum Direction {
  INBOUND = "inbound", // 接收的消息
  OUTBOUND = "outbound", // 发送的消息
}

// ==================== 类型定义 ====================

/** MQTT Broker 配置 */
export interface MQTTBroker {
  id: string;
  name: string;
  host: string;
  port: number;
  protocol: Protocol;
  username: string | null;
  password: string | null;
  clientId: string;
  keepAlive: number;
  cleanSession: boolean;
  ssl: boolean;
}

/** MQTT 主题 */
export interface MQTTTopic {
  topic: string;
  qos: QoS;
  subscribedAt: number;
  messageCount: number;
}

/** MQTT 消息 */
export interface MQTTMessage {
  id: string;
  topic: string;
  payload: string;
  qos: QoS;
  retain: boolean;
  timestamp: number;
  direction: Direction;
}

/** 连接配置 */
export interface ConnectionConfig {
  id: string;
  name: string;
  broker: MQTTBroker;
  autoConnect: boolean;
  lastConnected: number | null;
}

// ==================== 常量配置 ====================

/** 默认 Broker 配置 */
export const DEFAULT_BROKER: MQTTBroker = {
  id: "",
  name: "我的 Broker",
  host: "broker.emqx.io",
  port: 8084, // WSS 端口
  protocol: Protocol.WSS, // 使用 WSS (WebSocket SSL)
  username: null,
  password: null,
  clientId: `mqtt_${Date.now()}`,
  keepAlive: 60,
  cleanSession: true,
  ssl: true, // 启用 SSL
};

/** 消息存储限制 */
export const MESSAGE_LIMIT = 1000;

/** 重连配置 */
export const RECONNECT_CONFIG = {
  /** 重连间隔（毫秒） */
  interval: 5000,
  /** 最大重连次数 */
  maxAttempts: 5,
} as const;

// ==================== 工具函数 ====================

/**
 * 获取连接状态显示文本
 */
export function getConnectionStatusText(status: ConnectionStatus): string {
  const texts: Record<ConnectionStatus, string> = {
    [ConnectionStatus.DISCONNECTED]: "已断开",
    [ConnectionStatus.CONNECTING]: "连接中...",
    [ConnectionStatus.CONNECTED]: "已连接",
    [ConnectionStatus.RECONNECTING]: "重连中...",
    [ConnectionStatus.ERROR]: "连接错误",
  };
  return texts[status] || "未知状态";
}

/**
 * 获取 QoS 显示文本
 */
export function getQoSText(qos: QoS): string {
  const texts: Record<QoS, string> = {
    [QoS.QOS_0]: "QoS 0 (最多一次)",
    [QoS.QOS_1]: "QoS 1 (至少一次)",
    [QoS.QOS_2]: "QoS 2 (恰好一次)",
  };
  return texts[qos] || `QoS ${qos}`;
}

/**
 * 获取协议显示文本
 */
export function getProtocolText(protocol: Protocol): string {
  const texts: Record<Protocol, string> = {
    [Protocol.TCP]: "TCP (mqtt://)",
    [Protocol.WS]: "WebSocket (ws://)",
    [Protocol.WSS]: "WebSocket SSL (wss://)",
  };
  return texts[protocol] || protocol;
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 验证 Broker 配置
 */
export function validateBroker(broker: MQTTBroker): string[] {
  const errors: string[] = [];

  if (!broker.host) {
    errors.push("Broker 地址不能为空");
  }

  if (broker.port < 1 || broker.port > 65535) {
    errors.push("端口必须在 1-65535 之间");
  }

  if (!broker.clientId) {
    errors.push("客户端 ID 不能为空");
  }

  if (broker.keepAlive < 0 || broker.keepAlive > 65535) {
    errors.push("Keep Alive 必须在 0-65535 之间");
  }

  return errors;
}

/**
 * 验证发布主题格式（不能包含通配符）
 */
export function validatePublishTopic(topic: string): string[] {
  const errors: string[] = [];

  if (!topic) {
    errors.push("主题不能为空");
  }

  // 发布时主题不能包含通配符
  if (topic.includes("#") || topic.includes("+")) {
    errors.push("发布主题不能包含通配符 (# 或 +)");
  }

  return errors;
}

/**
 * 验证订阅主题格式（可以包含通配符）
 */
export function validateSubscribeTopic(topic: string): string[] {
  const errors: string[] = [];

  if (!topic) {
    errors.push("主题不能为空");
  }

  // 订阅时可以使用通配符，但需要符合规则
  // # 必须在最后，且前面必须是 /
  if (topic.includes("#")) {
    const hashIndex = topic.indexOf("#");
    if (hashIndex !== topic.length - 1) {
      errors.push("通配符 # 必须在主题末尾");
    }
    if (hashIndex > 0 && topic[hashIndex - 1] !== "/") {
      errors.push("通配符 # 前面必须是 /");
    }
  }

  // + 必须占据整个级别
  const levels = topic.split("/");
  for (const level of levels) {
    if (level.includes("+") && level !== "+") {
      errors.push("通配符 + 必须占据整个级别");
    }
  }

  return errors;
}
