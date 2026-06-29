# Technical Research: 网络通讯工具

**Date**: 2026-06-29

## 1. HTTP Client: axios

### Decision
使用 axios，业界最流行的 HTTP 客户端库。

### Rationale
- 最流行的 JS HTTP 库（npm 周下载量 6000 万+）
- 内置请求/响应拦截器，方便统一错误处理
- 自动 JSON 解析，无需手动 `.json()`
- 支持请求超时配置（`timeout` 参数）
- 支持请求取消（`CancelToken` / `AbortController`）
- 更好的错误信息（`AxiosError` 包含 status、config 等）

### Alternatives Considered
| 方案 | 优点 | 缺点 | 结论 |
|------|------|------|------|
| axios | 最流行、拦截器、自动 JSON、超时 | 额外依赖（~100KB） | ✅ 选用 |
| fetch (内置) | 零依赖 | 无拦截器、手动 JSON、超时需自行封装 | ❌ |
| ky | 现代 fetch 封装 | 非主流 | ❌ |

### Installation
```bash
npx expo install axios
```

### Key APIs
```typescript
// 基础请求
const response = await axios.get(url, { headers: {...} });
const response = await axios.post(url, body, { headers: {...} });

// 超时控制（axios 内置）
const response = await axios.get(url, { timeout: 10000 });

// 请求取消
const controller = new AbortController();
axios.get(url, { signal: controller.signal });
controller.abort();

// axios 实例（统一配置）
const instance = axios.create({
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// 响应拦截器
instance.interceptors.response.use(
  response => response,
  error => {
    if (axios.isCancel(error)) return; // 忽略取消
    if (error.code === 'ECONNABORTED') return '超时';
    return error.message;
  }
);
```

---

## 2. WebSocket: React Native Built-in API + Auto-Reconnect

### Decision
使用 React Native 内置 `WebSocket` 类，在 `useWebSocket` Hook 中实现指数递增间隔自动重连。

### Rationale
- React Native 内置，零依赖，W3C 标准 API
- 自动重连自行实现（简单可靠，不需要 socket.io）

### Key APIs
```typescript
const ws = new WebSocket('wss://echo.websocket.org');
ws.onopen = () => {};    // 连接成功
ws.onmessage = (e) => {}; // 收到消息
ws.onerror = (e) => {};   // 连接错误
ws.onclose = (e) => {};   // 连接关闭
ws.send('hello');
ws.close();
```

### Auto-Reconnect Strategy
```typescript
// 指数递增间隔：2s → 4s → 8s（最多 3 次）
const RECONNECT_DELAYS = [2000, 4000, 8000];
// 手动调用 disconnect() 不触发重连
// 异常断开（onclose wasClean=false）触发重连
// 连接成功时重置 reconnectCount
```

---

## 3. React Native Compatibility

### axios in React Native
- axios 在 React Native 中完全可用
- 使用 `XMLHttpRequest`（RN 内置支持）
- 无需额外 polyfill

---

## 4. Request History Storage

### Decision
使用已有 AsyncStorage，存储最近 20 条请求。

### Key Format
```json
{
  "network_request_history": [
    {
      "id": "uuid",
      "url": "https://httpbin.org/get",
      "method": "GET",
      "headers": {"Authorization": "Bearer xxx"},
      "body": "",
      "timestamp": 1719600000000
    }
  ]
}
```

---

## Summary

| 需求 | 技术 | 来源 |
|------|------|------|
| HTTP 请求 | axios | 新增依赖 |
| 请求取消/超时 | axios 内置 | axios |
| WebSocket 通信 | `WebSocket` | React Native 内置 |
| 自动重连 | 自实现（useWebSocket） | Hook 封装 |
| 历史存储 | `AsyncStorage` | 已有依赖 |
| UI 组件 | `Tamagui` | 已有依赖 |
| 路由 | `expo-router` | 已有依赖 |
