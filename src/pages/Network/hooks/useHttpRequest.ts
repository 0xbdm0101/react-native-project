/**
 * HTTP 请求逻辑 Hook
 * 管理请求状态、发送请求、取消请求
 */

import { useState, useCallback, useRef } from "react";
import { RequestStatus, HttpMethod, BodyType, REQUEST_TIMEOUT, MAX_HISTORY_SIZE } from "../constants";
import type { HttpRequest, HttpResponse, HttpHeader, RequestHistoryItem } from "../types";
import { executeHttpRequest } from "../services";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "network_request_history";

// ==================== 默认请求模板 ====================

const createDefaultRequest = (): HttpRequest => ({
  url: "",
  method: HttpMethod.GET,
  headers: [],
  body: "",
  bodyType: BodyType.JSON,
  timeout: REQUEST_TIMEOUT,
});

// ==================== 历史存储工具 ====================

const loadHistory = async (): Promise<RequestHistoryItem[]> => {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as RequestHistoryItem[];
  } catch {
    return [];
  }
};

const saveHistory = async (history: RequestHistoryItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error("❌ 保存历史记录失败:", err);
  }
};

/** 将 RequestHistoryItem 转换为 HttpRequest（回填表单） */
export const historyToRequest = (item: RequestHistoryItem): HttpRequest => ({
  url: item.url,
  method: item.method,
  headers: item.headers.map((h) => ({
    key: h.key,
    value: h.value,
    id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  })),
  body: item.body,
  bodyType: item.bodyType,
  timeout: REQUEST_TIMEOUT,
});

/** 将 HttpRequest 保存为 RequestHistoryItem */
const requestToHistory = (request: HttpRequest): RequestHistoryItem => ({
  id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  url: request.url,
  method: request.method,
  headers: request.headers.map((h) => ({ key: h.key, value: h.value })),
  body: request.body,
  bodyType: request.bodyType,
  timestamp: Date.now(),
});

// ==================== Hook ====================

export function useHttpRequest() {
  const [request, setRequest] = useState<HttpRequest>(createDefaultRequest());
  const [status, setStatus] = useState<RequestStatus>(RequestStatus.IDLE);
  const [response, setResponse] = useState<HttpResponse | null>(null);
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  // 更新请求字段
  const updateRequest = useCallback(
    <K extends keyof HttpRequest>(field: K, value: HttpRequest[K]) => {
      setRequest((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // 发送请求
  const send = useCallback(async () => {
    setStatus(RequestStatus.LOADING);
    setResponse(null);

    const controller = new AbortController();
    abortRef.current = controller;

    const result = await executeHttpRequest(request, controller.signal);
    setResponse(result);
    setStatus(result.error ? RequestStatus.ERROR : RequestStatus.SUCCESS);

    // 保存到历史
    if (!result.error || result.statusCode > 0) {
      const item = requestToHistory(request);
      const currentHistory = await loadHistory();
      const updated = [item, ...currentHistory].slice(0, MAX_HISTORY_SIZE);
      await saveHistory(updated);
      setHistory(updated);
    }
  }, [request]);

  // 取消请求
  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setStatus(RequestStatus.IDLE);
  }, []);

  // 加载历史
  const loadHistoryList = useCallback(async () => {
    const items = await loadHistory();
    setHistory(items);
  }, []);

  // 从历史回填
  const fillFromHistory = useCallback((item: RequestHistoryItem) => {
    setRequest(historyToRequest(item));
    setHistoryVisible(false);
  }, []);

  // 清空历史
  const clearHistory = useCallback(async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  return {
    request,
    updateRequest,
    status,
    response,
    send,
    cancel,
    history,
    historyVisible,
    setHistoryVisible,
    loadHistoryList,
    fillFromHistory,
    clearHistory,
  };
}
