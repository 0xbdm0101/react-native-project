/**
 * WebSocket 连接逻辑 Hook
 * 管理连接状态、消息收发、自动重连
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { WsStatus, Direction, WS_RECONNECT_CONFIG } from "../constants";
import type { WsMessage } from "../types";

/** React Native WebSocket close event 实际类型 */
interface WsCloseEvent {
  code: number;
  reason: string;
}

interface UseWebSocketReturn {
  url: string;
  setUrl: (url: string) => void;
  status: WsStatus;
  messages: WsMessage[];
  connect: () => void;
  disconnect: () => void;
  sendMessage: (content: string) => void;
  reconnectCount: number;
  error: string | null;
}

export function useWebSocket(): UseWebSocketReturn {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<WsStatus>(WsStatus.DISCONNECTED);
  const [messages, setMessages] = useState<WsMessage[]>([]);
  const [reconnectCount, setReconnectCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const shouldReconnectRef = useRef<boolean>(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldReconnectRef.current = false;
      wsRef.current?.close();
    };
  }, []);

  // 连接 WebSocket
  const connect = useCallback(() => {
    if (!url.trim()) {
      setError("请输入 WebSocket 服务器地址");
      return;
    }

    // 关闭旧连接
    wsRef.current?.close();

    setStatus(WsStatus.CONNECTING);
    setError(null);
    shouldReconnectRef.current = true;

    try {
      const ws = new WebSocket(url.trim());
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("✅ WebSocket 已连接:", url);
        setStatus(WsStatus.CONNECTED);
        setReconnectCount(0);
      };

      ws.onmessage = (event: WebSocketMessageEvent) => {
        const message: WsMessage = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          direction: Direction.INBOUND,
          content: typeof event.data === "string" ? event.data : JSON.stringify(event.data),
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, message]);
      };

      ws.onerror = (event: Event) => {
        console.error("❌ WebSocket 错误:", event);
        setError("WebSocket 连接发生错误");
      };

      ws.onclose = (event: WsCloseEvent) => {
        console.log("🔌 WebSocket 已关闭:", event.code, event.reason);

        // 手动调用 disconnect 时不重连
        if (!shouldReconnectRef.current) {
          setStatus(WsStatus.DISCONNECTED);
          return;
        }

        // 非正常关闭（code !== 1000）时尝试重连
        if (event.code !== 1000 && reconnectCount < WS_RECONNECT_CONFIG.maxAttempts) {
          const delay = WS_RECONNECT_CONFIG.delays[reconnectCount] || 8000;
          setStatus(WsStatus.RECONNECTING);
          console.log(`🔄 将在 ${delay}ms 后重连 (${reconnectCount + 1}/${WS_RECONNECT_CONFIG.maxAttempts})`);

          setTimeout(() => {
            if (shouldReconnectRef.current) {
              setReconnectCount((prev) => prev + 1);
              connect();
            }
          }, delay);
        } else {
          setStatus(WsStatus.ERROR);
          setError(
            event.code === 1000
              ? "连接已关闭"
              : `重连失败，已尝试 ${WS_RECONNECT_CONFIG.maxAttempts} 次`
          );
        }
      };
    } catch (err: any) {
      console.error("❌ 创建 WebSocket 失败:", err.message);
      setStatus(WsStatus.ERROR);
      setError(`创建连接失败: ${err.message}`);
    }
  }, [url, reconnectCount]);

  // 断开连接（手动，不触发重连）
  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    wsRef.current?.close();
    setStatus(WsStatus.DISCONNECTED);
    setReconnectCount(0);
    setError(null);
  }, []);

  // 发送消息
  const sendMessage = useCallback(
    (content: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(content);
        const message: WsMessage = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          direction: Direction.OUTBOUND,
          content,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, message]);
      }
    },
    []
  );

  return {
    url,
    setUrl,
    status,
    messages,
    connect,
    disconnect,
    sendMessage,
    reconnectCount,
    error,
  };
}
