# Quickstart: 网络通讯工具

**Prerequisites**: 模拟器已安装 development build（`npx expo run:ios`），Node 20+

## 1. 安装依赖

```bash
npx expo install axios
```

## 2. 启动应用

```bash
npx expo start --ios
```

## 3. HTTP 请求测试

1. 从首页点击「网络通讯」进入页面（默认在 HTTP 标签页）
2. 输入 URL：`https://httpbin.org/get`
3. 方法保持 `GET`
4. 点击发送
5. **预期结果**：响应区显示状态码 `200`，响应体包含你的 IP 等 JSON 数据，耗时 < 3000ms

### POST 测试
1. 方法选择 `POST`
2. Body 输入：`{"hello": "world"}`
3. URL：`https://httpbin.org/post`
4. 点击发送
5. **预期结果**：响应体 `json` 字段为 `{"hello": "world"}`

### 超时/错误测试
1. 输入不可达的 URL：`https://10.255.255.1` 或 `htp://bad`
2. **预期结果**：显示中文错误提示

## 4. WebSocket 测试

1. 切换到 WebSocket 标签页
2. 输入 URL：`wss://echo.websocket.org`
3. 点击连接
4. **预期结果**：状态变为「已连接」
5. 输入消息 "hello" 并发送
6. **预期结果**：消息列表中出现已发送消息，服务器回声也出现在列表中

### 重连测试
1. 连接成功后在外部断开网络（或 Mac 关了 WiFi）
2. **预期结果**：状态显示「重连中」，自动尝试重连
3. 恢复网络后，连接自动恢复

## 5. 请求历史测试

1. 发送 3 个不同的 HTTP 请求
2. 打开历史记录
3. **预期结果**：3 条记录按时间倒序显示
4. 点击一条历史记录
5. **预期结果**：表单自动填入该请求的 URL、方法、Header 和 Body
