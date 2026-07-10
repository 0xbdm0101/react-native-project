/**
 * 扫码结果展示面板
 * 显示识别到的内容、码制类型、操作按钮
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Share } from "react-native";
import { openURL, canOpenURL } from "expo-linking";
import {
  UI_TEXTS,
  COLORS,
  STYLE_CONFIG,
  CONTENT_TYPE_ACTIONS,
  getBarcodeFormatName,
  ContentType,
} from "../constants";
import type { ScanResult } from "../types";

// ==================== Props ====================

interface ScanResultPanelProps {
  /** 扫码结果（null 时不显示面板） */
  result: ScanResult | null;
  /** 显示分享按钮（US3 功能，默认 true） */
  showShare?: boolean;
  /** 显示打开链接按钮（US3 功能，默认 true） */
  showOpenLink?: boolean;
}

// ==================== 组件 ====================

export default function ScanResultPanel({
  result,
  showShare = true,
  showOpenLink = true,
}: ScanResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const [slideAnim] = useState(() => new Animated.Value(0));

  // 面板滑入动画
  React.useEffect(() => {
    if (result) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }).start();
      setCopied(false);
    } else {
      slideAnim.setValue(0);
    }
  }, [result, slideAnim]);

  // 无结果不渲染
  if (!result) return null;

  const actions =
    CONTENT_TYPE_ACTIONS[result.contentType] ??
    CONTENT_TYPE_ACTIONS[ContentType.UNKNOWN];

  // 复制
  const handleCopy = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(result.data);
      setCopied(true);
      console.log("📋 已复制到剪贴板");
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      console.error("❌ 复制失败:", err.message);
    }
  }, [result.data]);

  // 分享
  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: result.data,
      });
    } catch (err: any) {
      // 用户取消分享不报错
      if (!err.message?.includes("cancelled")) {
        console.error("❌ 分享失败:", err.message);
      }
    }
  }, [result.data]);

  // 打开链接
  const handleOpenLink = useCallback(async () => {
    try {
      const canOpen = await canOpenURL(result.data);
      if (canOpen) {
        await openURL(result.data);
        console.log("🔗 打开链接:", result.data);
      } else {
        console.log("⚠️ 无法打开的链接:", result.data);
      }
    } catch (err: any) {
      console.error("❌ 打开链接失败:", err.message);
    }
  }, [result.data]);

  // 解析时间
  const timeStr = new Date(result.timestamp).toLocaleTimeString("zh-CN");

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity: slideAnim,
        },
      ]}
    >
      {/* 内容区域 */}
      <View style={styles.content}>
        {/* 头部：码制 + 时间 */}
        <View style={styles.header}>
          <View style={styles.formatBadge}>
            <Text style={styles.formatText}>
              {getBarcodeFormatName(result.format)}
            </Text>
          </View>
          <Text style={styles.timeText}>{timeStr}</Text>
        </View>

        {/* 扫码数据 */}
        <View style={styles.dataContainer}>
          <Text style={styles.dataText} selectable>
            {result.data}
          </Text>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actions}>
          {/* 复制 */}
          <TouchableOpacity
            style={[styles.actionButton, copied && styles.actionButtonActive]}
            onPress={handleCopy}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionText, copied && styles.actionTextActive]}>
              {copied ? `✅ ${UI_TEXTS.BUTTON_COPIED}` : `📋 ${UI_TEXTS.BUTTON_COPY}`}
            </Text>
          </TouchableOpacity>

          {/* 分享 (US3) */}
          {showShare && actions.canShare && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>📤 {UI_TEXTS.BUTTON_SHARE}</Text>
            </TouchableOpacity>
          )}

          {/* 打开链接 (US3, 仅 URL) */}
          {showOpenLink && actions.canOpen && (
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={handleOpenLink}
              activeOpacity={0.7}
            >
              <Text style={styles.actionTextPrimary}>
                🔗 {UI_TEXTS.BUTTON_OPEN_LINK}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

// ==================== 样式 ====================

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.BG_CARD,
    borderTopLeftRadius: STYLE_CONFIG.RESULT_PANEL.borderRadius,
    borderTopRightRadius: STYLE_CONFIG.RESULT_PANEL.borderRadius,
    paddingBottom: 34, // safe area
    maxHeight: STYLE_CONFIG.RESULT_PANEL.maxHeight,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  formatBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  formatText: {
    color: COLORS.BG_DARK,
    fontSize: 12,
    fontWeight: "600",
  },
  timeText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
  },
  dataContainer: {
    backgroundColor: COLORS.BG_DARK,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dataText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
  },
  actionButtonActive: {
    backgroundColor: COLORS.SUCCESS,
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.PRIMARY,
  },
  actionText: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 13,
    fontWeight: "500",
  },
  actionTextActive: {
    color: COLORS.BG_DARK,
  },
  actionTextPrimary: {
    color: COLORS.BG_DARK,
    fontSize: 13,
    fontWeight: "600",
  },
});
