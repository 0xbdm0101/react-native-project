/**
 * HTTP 请求构建器组件
 * URL 输入、方法选择、Header 管理、Body 编辑
 */

import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Input } from "@/components/ui/Input";
import {
  HttpMethod,
  BodyType,
  HTTP_METHODS,
  BODY_TYPE_LABELS,
  RequestStatus,
  UI_TEXTS,
  COLORS,
  METHOD_COLORS,
  STYLE_CONFIG,
} from "../constants";
import type { HttpRequest, HttpHeader } from "../types";

interface Props {
  request: HttpRequest;
  status: RequestStatus;
  onUpdate: <K extends keyof HttpRequest>(
    field: K,
    value: HttpRequest[K]
  ) => void;
  onSend: () => void;
  onCancel: () => void;
}

export default function RequestBuilder({
  request,
  status,
  onUpdate,
  onSend,
  onCancel,
}: Props) {
  const isLoading = status === RequestStatus.LOADING;

  // 更新单个 Header
  const updateHeader = (id: string, field: "key" | "value", text: string) => {
    const updated = request.headers.map((h) =>
      h.id === id ? { ...h, [field]: text } : h
    );
    onUpdate("headers", updated);
  };

  // 添加 Header
  const addHeader = () => {
    const newHeader: HttpHeader = {
      key: "",
      value: "",
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    onUpdate("headers", [...request.headers, newHeader]);
  };

  // 删除 Header
  const removeHeader = (id: string) => {
    onUpdate(
      "headers",
      request.headers.filter((h) => h.id !== id)
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* URL 输入 */}
      <Text style={styles.label}>URL</Text>
      <Input
        placeholder={UI_TEXTS.URL_PLACEHOLDER}
        value={request.url}
        onChangeText={(text) => onUpdate("url", text)}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />

      {/* 方法选择 */}
      <Text style={styles.label}>{UI_TEXTS.SELECT_METHOD}</Text>
      <View style={styles.methodRow}>
        {HTTP_METHODS.map((method) => (
          <TouchableOpacity
            key={method}
            style={[
              styles.methodChip,
              request.method === method && {
                backgroundColor: METHOD_COLORS[method],
              },
            ]}
            onPress={() => onUpdate("method", method)}
          >
            <Text
              style={[
                styles.methodText,
                request.method === method && styles.methodTextActive,
              ]}
            >
              {method}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Body 类型选择 */}
      <Text style={styles.label}>{UI_TEXTS.SELECT_BODY_TYPE}</Text>
      <View style={styles.methodRow}>
        {Object.values(BodyType).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.bodyTypeChip,
              request.bodyType === type && styles.bodyTypeChipActive,
            ]}
            onPress={() => onUpdate("bodyType", type)}
          >
            <Text
              style={[
                styles.bodyTypeText,
                request.bodyType === type && styles.bodyTypeTextActive,
              ]}
            >
              {BODY_TYPE_LABELS[type]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Header 编辑器 */}
      <View style={styles.headerRow}>
        <Text style={styles.label}>Headers</Text>
        <TouchableOpacity onPress={addHeader}>
          <Text style={styles.addButton}>{UI_TEXTS.ADD_HEADER}</Text>
        </TouchableOpacity>
      </View>
      {request.headers.map((header) => (
        <View key={header.id} style={styles.headerPair}>
          <TextInput
            style={[styles.input, styles.headerInput]}
            placeholder={UI_TEXTS.HEADER_KEY_PLACEHOLDER}
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={header.key}
            onChangeText={(text) => updateHeader(header.id, "key", text)}
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, styles.headerInput]}
            placeholder={UI_TEXTS.HEADER_VALUE_PLACEHOLDER}
            placeholderTextColor={COLORS.TEXT_SECONDARY}
            value={header.value}
            onChangeText={(text) => updateHeader(header.id, "value", text)}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeHeader(header.id)}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Body 编辑器（非 GET 方法时显示） */}
      {request.method !== HttpMethod.GET && (
        <>
          <Text style={styles.label}>Body</Text>
          <Input
            style={styles.bodyInput}
            inputStyle={{ fontFamily: "monospace", fontSize: 13 }}
            placeholder={UI_TEXTS.BODY_PLACEHOLDER}
            value={request.body}
            onChangeText={(text) => onUpdate("body", text)}
            multiline
            textAlignVertical="top"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </>
      )}

      {/* 发送/取消按钮 */}
      <View style={styles.actionRow}>
        {isLoading ? (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>{UI_TEXTS.CANCEL_BUTTON}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.sendButton} onPress={onSend}>
            <Text style={styles.sendButtonText}>{UI_TEXTS.SEND_BUTTON}</Text>
          </TouchableOpacity>
        )}
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
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.TEXT_SECONDARY,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.BG_INPUT,
    borderRadius: 8,
    padding: 12,
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
  },
  methodRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  methodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.BG_CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  methodText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_SECONDARY,
  },
  methodTextActive: {
    color: "#000000",
  },
  bodyTypeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.BG_CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  bodyTypeChipActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  bodyTypeText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  bodyTypeTextActive: {
    color: "#000000",
    fontWeight: "600",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  addButton: {
    color: COLORS.PRIMARY,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
  },
  headerPair: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginTop: 6,
  },
  headerInput: {
    flex: 1,
    padding: 8,
  },
  removeButton: {
    padding: 6,
  },
  removeButtonText: {
    color: COLORS.ERROR,
    fontSize: 16,
    fontWeight: "700",
  },
  bodyInput: {
    minHeight: 100,
  },
  actionRow: {
    marginTop: 16,
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: COLORS.ERROR,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
