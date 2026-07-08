/**
 * 网络通讯页面 — 主入口
 * HTTP 请求构建器 + WebSocket 终端双标签页
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { PageHeader } from "@/components/PageHeader";
import { useHttpRequest } from "./hooks/useHttpRequest";
import { useWebSocket } from "./hooks/useWebSocket";
import RequestBuilder from "./components/RequestBuilder";
import ResponseViewer from "./components/ResponseViewer";
import WebSocketTerminal from "./components/WebSocketTerminal";
import { UI_TEXTS, COLORS, HttpMethod, METHOD_COLORS } from "./constants";
import type { RequestHistoryItem } from "./types";

type TabKey = "http" | "websocket";

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("http");

  const http = useHttpRequest();
  const ws = useWebSocket();

  // 加载历史记录
  useEffect(() => {
    http.loadHistoryList();
  }, []);

  return (
    <View style={styles.container}>
      {/* 顶部标题 */}
      <PageHeader
        title={UI_TEXTS.PAGE_TITLE}
        right={
          activeTab === "http" ? (
            <Pressable
              onPress={() => http.setHistoryVisible(true)}
              style={styles.historyButton}
            >
              <Text style={styles.historyButtonText}>📋</Text>
            </Pressable>
          ) : undefined
        }
      />

      {/* 标签切换 */}
      <View style={styles.tabBar}>
        <TabButton
          label={UI_TEXTS.TAB_HTTP}
          active={activeTab === "http"}
          onPress={() => setActiveTab("http")}
        />
        <TabButton
          label={UI_TEXTS.TAB_WS}
          active={activeTab === "websocket"}
          onPress={() => setActiveTab("websocket")}
        />
      </View>

      {/* 内容区域 */}
      <View style={styles.content}>
        {activeTab === "http" ? (
          <>
            <RequestBuilder
              request={http.request}
              status={http.status}
              onUpdate={http.updateRequest}
              onSend={http.send}
              onCancel={http.cancel}
            />
            <View style={styles.divider} />
            <ResponseViewer response={http.response} />
          </>
        ) : (
          <WebSocketTerminal
            url={ws.url}
            onUrlChange={ws.setUrl}
            status={ws.status}
            messages={ws.messages}
            reconnectCount={ws.reconnectCount}
            error={ws.error}
            onConnect={ws.connect}
            onDisconnect={ws.disconnect}
            onSend={ws.sendMessage}
          />
        )}
      </View>

      {/* 历史记录 Modal */}
      <Modal
        visible={http.historyVisible}
        animationType="slide"
        transparent
        onRequestClose={() => http.setHistoryVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{UI_TEXTS.HISTORY_TITLE}</Text>
              <View style={styles.modalActions}>
                {http.history.length > 0 && (
                  <TouchableOpacity
                    onPress={http.clearHistory}
                    style={styles.clearButton}
                  >
                    <Text style={styles.clearButtonText}>
                      {UI_TEXTS.HISTORY_CLEAR}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => http.setHistoryVisible(false)}>
                  <Text style={styles.closeButtonText}>关闭</Text>
                </TouchableOpacity>
              </View>
            </View>

            {http.history.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryText}>
                  {UI_TEXTS.HISTORY_EMPTY}
                </Text>
              </View>
            ) : (
              <FlatList
                data={http.history}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <HistoryRow
                    item={item}
                    onPress={() => http.fillFromHistory(item)}
                  />
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ==================== 子组件 ====================

/** 标签按钮 */
function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <View style={[styles.tab, active && styles.tabActive]} onTouchEnd={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {label}
      </Text>
    </View>
  );
}

/** 历史记录行 */
function HistoryRow({
  item,
  onPress,
}: {
  item: RequestHistoryItem;
  onPress: () => void;
}) {
  const methodColor = METHOD_COLORS[item.method] || COLORS.TEXT_SECONDARY;
  const timeStr = new Date(item.timestamp).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TouchableOpacity style={historyStyles.row} onPress={onPress}>
      <View
        style={[historyStyles.methodBadge, { backgroundColor: methodColor }]}
      >
        <Text style={historyStyles.methodText}>{item.method}</Text>
      </View>
      <View style={historyStyles.rowContent}>
        <Text style={historyStyles.url} numberOfLines={1}>
          {item.url}
        </Text>
        <Text style={historyStyles.time}>{timeStr}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  historyButton: {
    padding: 8,
  },
  historyButtonText: {
    fontSize: 22,
  },
  tabBar: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_SECONDARY,
  },
  tabTextActive: {
    color: "#000000",
  },
  content: {
    flex: 1,
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  placeholderText: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    opacity: 0.6,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.BG_DARK,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
  },
  modalActions: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    color: COLORS.ERROR,
    fontSize: 14,
  },
  closeButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyHistory: {
    padding: 32,
    alignItems: "center",
  },
  emptyHistoryText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
});

const historyStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.BORDER,
  },
  methodBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 10,
    minWidth: 52,
    alignItems: "center",
  },
  methodText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "700",
  },
  rowContent: {
    flex: 1,
  },
  url: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 13,
  },
  time: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 11,
    marginTop: 2,
  },
});
