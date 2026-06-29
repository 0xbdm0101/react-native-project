/**
 * API 调用 Demo — TanStack Query + 生成 API 的完整链路
 *
 * 参考 create-react-dex-app 的 Swap/services 模式
 */
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { usePets } from "../hooks/usePets";

export function ApiDemo() {
  const { data, error, isLoading, isFetching, refetch } = usePets();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>API 调用示例</Text>

      {/* 调用链路 */}
      <Text style={styles.codeBlock}>
        {`// 1️⃣ api/index.ts — 生成后导出\nexport const api = apiDefault;\n\n// 2️⃣ hooks/usePets.ts — TanStack Query\nexport function usePets() {\n  return useHttp(\n    ["pets", "available"],\n    () => http.pet\n      .findPetsByStatus({\n        status: ["available"],\n      }),\n  );\n}\n\n// 3️⃣ 组件 — 一行调用\nconst { data, isLoading,\n  refetch } = usePets();`}
      </Text>

      {/* 操作 */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={() => refetch()}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#000" size="small" />
        ) : (
          <Text style={styles.buttonText}>
            {data ? "刷新数据" : "调用 Petstore API"}
          </Text>
        )}
      </TouchableOpacity>

      {/* 缓存状态 */}
      {data && (
        <Text style={styles.cacheHint}>
          {isFetching
            ? "🔄 后台更新中..."
            : "✅ 缓存命中 (30s 内读缓存)"}
        </Text>
      )}

      {/* 错误 */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>❌ {String(error)}</Text>
        </View>
      )}

      {/* 结果 */}
      {data && (
        <ScrollView style={styles.resultBox}>
          <Text style={styles.resultText}>
            {JSON.stringify(
              Array.isArray(data)
                ? { count: (data as any).length, sample: data.slice(0, 2) }
                : data,
              null,
              2,
            )}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    padding: 16,
    backgroundColor: "#1C1C1E",
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  codeBlock: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "#4FC3F7",
    backgroundColor: "#2C2C2E",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    lineHeight: 14,
  },
  button: {
    backgroundColor: "#4FC3F7",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
  },
  cacheHint: {
    marginTop: 8,
    fontSize: 11,
    color: "#66BB6A",
    textAlign: "center",
  },
  errorBox: {
    marginTop: 12,
    backgroundColor: "rgba(239,83,80,0.15)",
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    color: "#EF5350",
    fontSize: 13,
  },
  resultBox: {
    marginTop: 12,
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    padding: 12,
    maxHeight: 200,
  },
  resultText: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#FFFFFF",
    lineHeight: 16,
  },
});
