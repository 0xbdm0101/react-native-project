/**
 * WebSocket 终端组件
 * 连接管理、消息列表、消息发送
 */

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Input } from "@/components/ui/Input";
import {
  WsStatus,
  Direction,
  UI_TEXTS,
  COLORS,
  WS_STATUS_COLORS,
  WS_STATUS_LABELS,
  DIRECTION_LABELS,
} from "../constants";
import type { WsMessage } from "../types";

interface Props {
  url: string;
  onUrlChange: (url: string) => void;
  status: WsStatus;
  messages: WsMessage[];
  reconnectCount: number;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onSend: (content: string) => void;
}

export default function WebSocketTerminal({
  url,
  onUrlChange,
  status,
  messages,
  reconnectCount,
  error,
  onConnect,
  onDisconnect,
  onSend,
}: Props) {
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const isConnected = status === WsStatus.CONNECTED;
  const isConnecting = status === WsStatus.CONNECTING;
  const isReconnecting = status === WsStatus.RECONNECTING;

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || !isConnected) return;
    onSend(trimmed);
    setInputText("");
  };

  const renderMessage = ({ item }: { item: WsMessage }) => {
    const isOutbound = item.direction === Direction.OUTBOUND;
    const timeStr = new Date(item.timestamp).toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return (
      <View
        style={[
          messageStyles.bubble,
          isOutbound ? messageStyles.outbound : messageStyles.inbound,
        ]}
      >
        <View style={messageStyles.meta}>
          <Text
            style={[
              messageStyles.direction,
              {
                color: isOutbound
                  ? COLORS.DIRECTION_OUTBOUND
                  : COLORS.DIRECTION_INBOUND,
              },
            ]}
          >
            {DIRECTION_LABELS[item.direction]}
          </Text>
          <Text style={messageStyles.time}>{timeStr}</Text>
        </View>
        <Text style={messageStyles.content} selectable>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* URL 输入 + 连接按钮 */}
      <View style={styles.urlRow}>
        <Input
          style={styles.urlInput}
          placeholder={UI_TEXTS.WS_URL_PLACEHOLDER}
          value={url}
          onChangeText={onUrlChange}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          editable={!isConnected && !isConnecting}
        />
        {isConnected || isConnecting ? (
          <TouchableOpacity style={styles.disconnectBtn} onPress={onDisconnect}>
            <Text style={styles.disconnectBtnText}>
              {UI_TEXTS.WS_DISCONNECT}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.connectBtn,
              !url.trim() && styles.connectBtnDisabled,
            ]}
            onPress={onConnect}
            disabled={!url.trim()}
          >
            <Text style={styles.connectBtnText}>
              {isReconnecting ? "..." : UI_TEXTS.WS_CONNECT}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 连接状态指示 */}
      <View style={styles.statusBar}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: WS_STATUS_COLORS[status] },
          ]}
        />
        <Text
          style={[
            styles.statusText,
            { color: WS_STATUS_COLORS[status] },
          ]}
        >
          {WS_STATUS_LABELS[status]}
        </Text>
        {isReconnecting && (
          <Text style={styles.reconnectInfo}>
            ({reconnectCount + 1}/3)
          </Text>
        )}
        {error && <Text style={styles.errorInfo}>{error}</Text>}
      </View>

      {/* 消息列表 */}
      <FlatList
        ref={flatListRef}
        style={styles.messageList}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyMessages}>
            <Text style={styles.emptyText}>
              {isConnected ? UI_TEXTS.WS_EMPTY : UI_TEXTS.WS_CONNECT_FIRST}
            </Text>
          </View>
        }
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
          }
        }}
      />

      {/* 消息输入栏 */}
      <View style={styles.inputBar}>
        <Input
          style={styles.messageInput}
          placeholder={UI_TEXTS.WS_MESSAGE_PLACEHOLDER}
          value={inputText}
          onChangeText={setInputText}
          autoCapitalize="none"
          editable={isConnected}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!isConnected || !inputText.trim()) && styles.sendBtnDisabled,
          ]}
          onPress={handleSend}
          disabled={!isConnected || !inputText.trim()}
        >
          <Text style={styles.sendBtnText}>{UI_TEXTS.WS_SEND}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  urlRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  urlInput: {
    flex: 1,
  },
  connectBtn: {
    backgroundColor: COLORS.SUCCESS,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  connectBtnDisabled: {
    opacity: 0.4,
  },
  connectBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  disconnectBtn: {
    backgroundColor: COLORS.ERROR,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  disconnectBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  reconnectInfo: {
    fontSize: 12,
    color: COLORS.WARNING,
  },
  errorInfo: {
    fontSize: 11,
    color: COLORS.ERROR,
    flex: 1,
    marginLeft: 8,
  },
  messageList: {
    flex: 1,
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 10,
    padding: 10,
  },
  emptyMessages: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
    textAlign: "center",
  },
  inputBar: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    marginBottom: 16,
  },
  messageInput: {
    flex: 1,
  },
  sendBtn: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
  sendBtnText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
  },
});

const messageStyles = StyleSheet.create({
  bubble: {
    borderRadius: 8,
    padding: 10,
    marginVertical: 3,
    maxWidth: "85%",
  },
  outbound: {
    backgroundColor: "rgba(79,195,247,0.15)",
    alignSelf: "flex-end",
    borderRightWidth: 3,
    borderRightColor: COLORS.DIRECTION_OUTBOUND,
  },
  inbound: {
    backgroundColor: "rgba(102,187,106,0.15)",
    alignSelf: "flex-start",
    borderLeftWidth: 3,
    borderLeftColor: COLORS.DIRECTION_INBOUND,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  direction: {
    fontSize: 11,
    fontWeight: "600",
  },
  time: {
    fontSize: 10,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 12,
  },
  content: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 13,
    lineHeight: 18,
  },
});
