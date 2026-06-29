# Data Model: 网络通讯工具

**Date**: 2026-06-29

## Entity Definitions

### 1. HttpRequest（HTTP 请求）

用户构建的 HTTP 请求，可发送和保存为历史。

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | UUID，唯一标识 |
| `url` | `string` | ✅ | 请求目标 URL |
| `method` | `HttpMethod` | ✅ | GET / POST / PUT / DELETE |
| `headers` | `Record<string, string>` | ❌ | 自定义请求头键值对 |
| `body` | `string` | ❌ | 请求体内容 |
| `bodyType` | `BodyType` | ❌ | Body 内容类型（JSON/Text/Form） |
| `timestamp` | `number` | ✅ | 发送时间戳 (ms) |

**Validation**:
- `url` 非空，以 `http://` 或 `https://` 开头
- `method` 必须为 `HttpMethod` 枚举值之一
- `headers` 的 key 和 value 均为非空字符串

**States**: N/A（请求本身无状态流转，发送后即生成新的 HttpResponse）

---

### 2. HttpResponse（HTTP 响应）

请求发送后收到的服务器响应。

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `statusCode` | `number` | ✅ | HTTP 状态码（200、404、500 等） |
| `statusText` | `string` | ✅ | 状态文本（OK、Not Found 等） |
| `headers` | `Record<string, string>` | ✅ | 响应头键值对 |
| `body` | `string` | ✅ | 响应体原始文本 |
| `duration` | `number` | ✅ | 请求耗时（毫秒） |
| `error` | `string \| null` | ❌ | 错误信息（网络错误/超时时） |

**States**:
```
[请求中] → [成功] (statusCode 2xx-3xx)
[请求中] → [客户端错误] (statusCode 4xx)
[请求中] → [服务端错误] (statusCode 5xx)
[请求中] → [网络错误] (fetch 抛出异常)
[请求中] → [超时] (AbortController 超时取消)
```

---

### 3. WebSocket 连接 (WsConnection)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | `string` | ✅ | WebSocket 服务器地址 (`ws://` 或 `wss://`) |
| `status` | `WsStatus` | ✅ | 连接状态 |
| `reconnectCount` | `number` | ✅ | 当前已重连次数（重置为 0 当手动断开） |

**States**:
```
[未连接] → [连接中] → [已连接]
[已连接] → [断开] (手动关闭)
[已连接] → [重连中] → [已连接] (自动恢复，最多 3 次)
[重连中] → [错误] (超过 3 次重连失败)
```

---

### 4. WebSocket 消息 (WsMessage)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | UUID，唯一标识 |
| `direction` | `Direction` | ✅ | 发送 (outbound) / 接收 (inbound) |
| `content` | `string` | ✅ | 消息内容 |
| `timestamp` | `number` | ✅ | 消息时间戳 (ms) |

---

### 5. RequestHistory（历史记录）

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ | UUID，唯一标识 |
| `url` | `string` | ✅ | 请求 URL |
| `method` | `HttpMethod` | ✅ | HTTP 方法 |
| `headers` | `Record<string, string>` | ❌ | 请求头 |
| `body` | `string` | ❌ | 请求体 |
| `timestamp` | `number` | ✅ | 发送时间戳 |

**Constraints**:
- 最多保存 20 条
- 按 `timestamp` 倒序排列
- 超出上限时删除最早的记录

---

## Enum Types

```typescript
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum BodyType {
  JSON = "application/json",
  TEXT = "text/plain",
  FORM = "application/x-www-form-urlencoded",
}

export enum WsStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  RECONNECTING = "reconnecting",
  ERROR = "error",
}

export enum Direction {
  INBOUND = "inbound",
  OUTBOUND = "outbound",
}
```
