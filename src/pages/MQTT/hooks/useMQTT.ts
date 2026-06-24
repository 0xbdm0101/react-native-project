import { useState, useEffect, useCallback, useRef } from "react";
import mqtt, { MqttClient, IClientOptions } from "mqtt";
import {
  ConnectionStatus,
  QoS,
  Protocol,
  Direction,
  MQTTBroker,
  MQTTTopic,
  MQTTMessage,
  DEFAULT_BROKER,
  MESSAGE_LIMIT,
  RECONNECT_CONFIG,
  generateId,
  validateBroker,
  validateTopic,
} from "../constants";

export function useMQTT() {
  // ==================== 状态 ====================
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [broker, setBroker] = useState<MQTTBroker>(DEFAULT_BROKER);
  const [topics, setTopics] = useState<MQTTTopic[]>([]);
  const [messages, setMessages] = useState<MQTTMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ==================== 引用 ====================
  const clientRef = useRef<MqttClient | null>(null);
  const reconnectAttemptsRef = useRef(0);

  // ==================== 连接管理 ====================

  /**
   * 连接到 MQTT Broker
   */
  const connect = useCallback(async (brokerConfig: MQTTBroker) => {
    // 验证配置
    const errors = validateBroker(brokerConfig);
    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }

    try {
      setError(null);
      setConnectionStatus(ConnectionStatus.CONNECTING);
      setBroker(brokerConfig);

      // 构建连接 URL（需要添加 /mqtt 路径）
      const protocol = brokerConfig.ssl ? "wss" : brokerConfig.protocol;
      const url = `${protocol}://${brokerConfig.host}:${brokerConfig.port}/mqtt`;

      // 构建连接选项
      const options: IClientOptions = {
        clientId: brokerConfig.clientId,
        keepalive: brokerConfig.keepAlive,
        clean: brokerConfig.cleanSession,
        reconnectPeriod: RECONNECT_CONFIG.interval,
        connectTimeout: 10000,
      };

      // 添加认证（如果有）
      if (brokerConfig.username) {
        options.username = brokerConfig.username;
      }
      if (brokerConfig.password) {
        options.password = brokerConfig.password;
      }

      console.log("正在连接 MQTT Broker:", url);

      // 创建连接
      const client = mqtt.connect(url, options);
      clientRef.current = client;

      // 监听连接事件
      client.on("connect", () => {
        console.log("✅ MQTT 连接成功");
        setConnectionStatus(ConnectionStatus.CONNECTED);
        reconnectAttemptsRef.current = 0;
      });

      // 监听消息事件
      client.on("message", (topic, payload, packet) => {
        const message: MQTTMessage = {
          id: generateId(),
          topic,
          payload: payload.toString(),
          qos: packet.qos as QoS,
          retain: packet.retain,
          timestamp: Date.now(),
          direction: Direction.INBOUND,
        };

        setMessages((prev) => {
          const next = [message, ...prev];
          // 限制消息数量
          if (next.length > MESSAGE_LIMIT) {
            return next.slice(0, MESSAGE_LIMIT);
          }
          return next;
        });

        // 更新主题消息计数
        setTopics((prev) =>
          prev.map((t) =>
            t.topic === topic
              ? { ...t, messageCount: t.messageCount + 1 }
              : t
          )
        );
      });

      // 监听错误事件
      client.on("error", (err) => {
        console.error("❌ MQTT 错误:", err);
        setError(err.message);
        setConnectionStatus(ConnectionStatus.ERROR);
      });

      // 监听断开事件
      client.on("close", () => {
        console.log("MQTT 连接断开");
        if (connectionStatus === ConnectionStatus.CONNECTED) {
          setConnectionStatus(ConnectionStatus.DISCONNECTED);
        }
      });

      // 监听重连事件
      client.on("reconnect", () => {
        reconnectAttemptsRef.current++;
        console.log(`MQTT 正在重连... (${reconnectAttemptsRef.current}/${RECONNECT_CONFIG.maxAttempts})`);
        setConnectionStatus(ConnectionStatus.RECONNECTING);

        // 检查是否达到最大重连次数
        if (reconnectAttemptsRef.current >= RECONNECT_CONFIG.maxAttempts) {
          console.log("❌ 达到最大重连次数，停止重连");
          client.end(true);
          clientRef.current = null;
          setConnectionStatus(ConnectionStatus.ERROR);
          setError("连接失败：达到最大重连次数");
        }
      });

      // 监听离线事件
      client.on("offline", () => {
        console.log("MQTT 离线");
        setConnectionStatus(ConnectionStatus.DISCONNECTED);
      });

    } catch (err: any) {
      console.error("MQTT 连接失败:", err);
      setError(err.message);
      setConnectionStatus(ConnectionStatus.ERROR);
    }
  }, []);

  /**
   * 断开连接
   */
  const disconnect = useCallback(() => {
    if (clientRef.current) {
      console.log("断开 MQTT 连接");
      clientRef.current.end(true);
      clientRef.current = null;
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      setTopics([]);
    }
  }, []);

  // ==================== 主题订阅 ====================

  /**
   * 订阅主题
   */
  const subscribe = useCallback(
    (topic: string, qos: QoS = QoS.QOS_0) => {
      // 验证主题
      const errors = validateTopic(topic);
      if (errors.length > 0) {
        setError(errors.join(", "));
        return;
      }

      if (!clientRef.current || connectionStatus !== ConnectionStatus.CONNECTED) {
        setError("未连接到 Broker");
        return;
      }

      console.log("订阅主题:", topic, "QoS:", qos);

      clientRef.current.subscribe(topic, { qos }, (err) => {
        if (err) {
          console.error("订阅失败:", err);
          setError(`订阅失败: ${err.message}`);
          return;
        }

        console.log("✅ 订阅成功:", topic);

        // 添加到主题列表
        const newTopic: MQTTTopic = {
          topic,
          qos,
          subscribedAt: Date.now(),
          messageCount: 0,
        };

        setTopics((prev) => {
          // 检查是否已订阅
          if (prev.some((t) => t.topic === topic)) {
            return prev;
          }
          return [...prev, newTopic];
        });
      });
    },
    [connectionStatus]
  );

  /**
   * 取消订阅
   */
  const unsubscribe = useCallback(
    (topic: string) => {
      if (!clientRef.current || connectionStatus !== ConnectionStatus.CONNECTED) {
        setError("未连接到 Broker");
        return;
      }

      console.log("取消订阅:", topic);

      clientRef.current.unsubscribe(topic, (err) => {
        if (err) {
          console.error("取消订阅失败:", err);
          setError(`取消订阅失败: ${err.message}`);
          return;
        }

        console.log("✅ 取消订阅成功:", topic);

        // 从列表中移除
        setTopics((prev) => prev.filter((t) => t.topic !== topic));
      });
    },
    [connectionStatus]
  );

  // ==================== 消息发送 ====================

  /**
   * 发送消息
   */
  const publish = useCallback(
    (topic: string, payload: string, qos: QoS = QoS.QOS_0, retain: boolean = false) => {
      // 验证主题
      const errors = validateTopic(topic);
      if (errors.length > 0) {
        setError(errors.join(", "));
        return;
      }

      if (!clientRef.current || connectionStatus !== ConnectionStatus.CONNECTED) {
        setError("未连接到 Broker");
        return;
      }

      console.log("发送消息:", topic, payload);

      clientRef.current.publish(topic, payload, { qos, retain }, (err) => {
        if (err) {
          console.error("发送失败:", err);
          setError(`发送失败: ${err.message}`);
          return;
        }

        console.log("✅ 发送成功:", topic);

        // 添加到消息列表
        const message: MQTTMessage = {
          id: generateId(),
          topic,
          payload,
          qos,
          retain,
          timestamp: Date.now(),
          direction: Direction.OUTBOUND,
        };

        setMessages((prev) => {
          const next = [message, ...prev];
          if (next.length > MESSAGE_LIMIT) {
            return next.slice(0, MESSAGE_LIMIT);
          }
          return next;
        });
      });
    },
    [connectionStatus]
  );

  // ==================== 消息管理 ====================

  /**
   * 清空消息
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * 清空错误
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ==================== 清理 ====================

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.end(true);
        clientRef.current = null;
      }
    };
  }, []);

  // ==================== 返回 ====================

  return {
    // 状态
    connectionStatus,
    broker,
    topics,
    messages,
    error,

    // 连接管理
    connect,
    disconnect,

    // 主题订阅
    subscribe,
    unsubscribe,

    // 消息发送
    publish,

    // 消息管理
    clearMessages,
    clearError,
  };
}
