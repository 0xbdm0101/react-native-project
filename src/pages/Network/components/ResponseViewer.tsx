/**
 * HTTP 响应展示组件
 * 状态码、耗时、响应头、响应体
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { formatDuration, formatSize } from "@/api/utils";
import { COLORS, UI_TEXTS, MAX_RESPONSE_DISPLAY_SIZE } from "../constants";
import type { HttpResponse } from "../types";

interface Props {
  response: HttpResponse | null;
}

export default function ResponseViewer({ response }: Props) {
  const [showHeaders, setShowHeaders] = useState(false);

  if (!response) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{UI_TEXTS.NO_RESPONSE}</Text>
      </View>
    );
  }

  const isSuccess = response.statusCode >= 200 && response.statusCode < 400;
  const statusColor = isSuccess ? COLORS.SUCCESS : COLORS.ERROR;

  // 截断过大的响应体
  const displayBody =
    response.size > MAX_RESPONSE_DISPLAY_SIZE
      ? response.body.substring(0, MAX_RESPONSE_DISPLAY_SIZE)
      : response.body;

  // 尝试格式化 JSON
  const formattedBody = (() => {
    try {
      const parsed = JSON.parse(displayBody);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return displayBody;
    }
  })();

  const isTruncated = response.size > MAX_RESPONSE_DISPLAY_SIZE;

  return (
    <ScrollView style={styles.container}>
      {/* 状态栏 */}
      <View style={styles.statusBar}>
        {/* 状态码 + 耗时 */}
        <View style={styles.statusLeft}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusBadgeText}>
              {response.statusCode || "ERR"}
            </Text>
          </View>
          <Text style={styles.statusText}>{response.statusText}</Text>
        </View>
        <View style={styles.statusRight}>
          <Text style={styles.durationLabel}>{UI_TEXTS.RESPONSE_TIME}</Text>
          <Text style={styles.durationValue}>
            {formatDuration(response.duration)}
          </Text>
          <Text style={styles.sizeText}>
            {formatSize(response.size)}
          </Text>
        </View>
      </View>

      {/* 错误信息 */}
      {response.error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{response.error}</Text>
        </View>
      )}

      {/* 响应头（可折叠） */}
      {Object.keys(response.headers).length > 0 && (
        <>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowHeaders(!showHeaders)}
          >
            <Text style={styles.sectionTitle}>
              {UI_TEXTS.RESPONSE_HEADERS} ({Object.keys(response.headers).length})
            </Text>
            <Text style={styles.arrow}>{showHeaders ? "▼" : "▶"}</Text>
          </TouchableOpacity>
          {showHeaders && (
            <View style={styles.headersBox}>
              {Object.entries(response.headers).map(([key, value]) => (
                <View key={key} style={styles.headerRow}>
                  <Text style={styles.headerKey}>{key}</Text>
                  <Text style={styles.headerValue}>{value as string}</Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {/* 响应体 */}
      <Text style={styles.sectionTitle}>{UI_TEXTS.RESPONSE_BODY}</Text>
      {isTruncated && (
        <Text style={styles.truncatedNotice}>
          {UI_TEXTS.RESPONSE_TRUNCATED}
        </Text>
      )}
      <View style={styles.bodyBox}>
        <Text style={styles.bodyText} selectable>
          {formattedBody || UI_TEXTS.NO_BODY}
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.TEXT_SECONDARY,
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "800",
  },
  statusText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  statusRight: {
    alignItems: "flex-end",
  },
  durationLabel: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
  },
  durationValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.PRIMARY,
  },
  sizeText: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  errorBox: {
    backgroundColor: "rgba(239,83,80,0.15)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.ERROR,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
    marginTop: 12,
  },
  arrow: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
  },
  headersBox: {
    backgroundColor: COLORS.BG_INPUT,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 3,
  },
  headerKey: {
    color: COLORS.PRIMARY,
    fontSize: 12,
    fontWeight: "600",
    marginRight: 8,
  },
  headerValue: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 12,
    flex: 1,
  },
  truncatedNotice: {
    color: COLORS.WARNING,
    fontSize: 11,
    marginBottom: 4,
  },
  bodyBox: {
    backgroundColor: COLORS.BG_INPUT,
    borderRadius: 8,
    padding: 12,
  },
  bodyText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 18,
  },
});
