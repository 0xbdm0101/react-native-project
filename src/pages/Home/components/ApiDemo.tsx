/**
 * API 调用 Demo — 演示完整的 api → services → component 调用链路
 *
 * 参考 create-react-dex-app 的 Swap/services/index.ts 模式
 */
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { getPetsByStatus } from "../services";

export function ApiDemo() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const callApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 🎯 这就是标准调用方式：services 层封装，组件直接调
      const pets = await getPetsByStatus(["available"]);
      setResult(pets);
    } catch (err: any) {
      setError(err.message || "请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>API 调用示例</Text>

      {/* 调用链路说明 */}
      <Text style={styles.codeBlock}>
        {`// 1️⃣ src/api/index.ts — 生成后直接导出\nimport { Api as DefaultApi } from "./gen/Api";\nconst api = new Proxy(..., any);\n\nexport { api };\n\n// 2️⃣ services/index.ts — 业务封装\nimport { api as http } from "@/api";\n\nexport const getPetsByStatus = async (\n  status,\n) => {\n  const rs = await http.pet\n    .findPetsByStatus({ status });\n  return rs;\n};\n\n// 3️⃣ 组件调用\nimport { getPetsByStatus }\n  from "../services";\nconst pets = await getPetsByStatus(\n  ["available"],\n);`}
      </Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={callApi}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" size="small" />
        ) : (
          <Text style={styles.buttonText}>调用 Petstore API</Text>
        )}
      </TouchableOpacity>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      )}

      {result && (
        <ScrollView style={styles.resultBox}>
          <Text style={styles.resultTitle}>
            ✅ {Array.isArray(result) ? `${result.length} 条结果` : "成功"}
          </Text>
          <Text style={styles.resultText}>
            {JSON.stringify(
              Array.isArray(result) ? result.slice(0, 2) : result,
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
  resultTitle: {
    fontSize: 13,
    color: "#66BB6A",
    marginBottom: 8,
  },
  resultText: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#FFFFFF",
    lineHeight: 16,
  },
});
