# Feature Specification: 网络通讯工具

**Feature Branch**: `003-network-tools`

**Created**: 2026-06-29

**Status**: Draft

**Input**: 实现网络通讯功能：HTTP 请求构建器（GET/POST/PUT/DELETE，自定义 Header 和 Body）和 WebSocket 终端（实时收发消息、断线重连），从首页「网络通讯」菜单进入

## User Scenarios & Testing

### User Story 1 - HTTP 请求构建与发送 (Priority: P1)

开发者进入网络通讯页面后，可以输入 URL、选择请求方法（GET/POST/PUT/DELETE）、添加自定义 Header 和 Body，发送请求后查看完整的响应信息（状态码、响应头、响应体、耗时）。这是网络调试最基础也是最频繁使用的功能。

**Why this priority**: HTTP 请求调试是网络工具的核心价值，没有它整个页面就没有意义。这也是用户进入页面后首先看到和使用的功能。

**Independent Test**: 向公开测试 API（如 httpbin.org）发送一个 GET 请求，验证能成功收到响应并正确格式化展示。

**Acceptance Scenarios**:

1. **Given** 用户打开网络通讯页面，**When** 输入 URL `https://httpbin.org/get` 并点击发送按钮，**Then** 页面展示响应状态码 `200`、响应头列表、响应体 JSON 内容，以及请求耗时
2. **Given** 用户选择 POST 方法并输入 JSON Body `{"test": "hello"}`，**When** 输入 URL `https://httpbin.org/post` 并发送，**Then** 请求以 POST 方式发出，返回内容确认 Body 被正确传递
3. **Given** 用户添加自定义 Header `Authorization: Bearer token123`，**When** 发送请求，**Then** 服务端返回确认收到该 Header
4. **Given** 用户输入格式无效的 URL（如 `htp://bad-url`），**When** 点击发送，**Then** 页面显示清晰的错误提示，说明 URL 格式不正确
5. **Given** 请求正在发送中，**When** 用户点击取消按钮，**Then** 请求被中止，页面恢复为可编辑状态

---

### User Story 2 - WebSocket 实时通信终端 (Priority: P2)

开发者输入 WebSocket 服务器 URL 建立连接后，进入一个类似聊天终端的界面：可以输入消息发送到服务器，同时实时查看服务器推送过来的消息。连接意外断开时自动重连，连接状态实时可见。

**Why this priority**: WebSocket 是 IoT 设备实时通信的核心协议，对项目有直接业务价值。但它依赖 HTTP 基础功能已经就位，因此排在 P2。

**Independent Test**: 连接公共 WebSocket 回声服务（如 `wss://echo.websocket.org`），发送一条消息，验证消息列表中出现已发送的消息和服务器回显。

**Acceptance Scenarios**:

1. **Given** 用户切换到 WebSocket 标签页，**When** 输入 WebSocket URL `wss://echo.websocket.org` 并点击连接，**Then** 状态指示变为"已连接"，消息输入框变为可用
2. **Given** WebSocket 已连接，**When** 用户输入消息 "hello" 并发送，**Then** 消息列表中出现该条已发送消息，并显示时间戳
3. **Given** WebSocket 已连接，**When** 服务器推送一条消息过来，**Then** 消息实时出现在消息列表中，已接收和已发送消息用不同样式区分
4. **Given** WebSocket 连接意外断开，**When** 系统检测到断线，**Then** 状态变为"重连中"，自动尝试重新连接，连接恢复后状态恢复为"已连接"
5. **Given** 用户输入了不可达的 WebSocket 地址，**When** 点击连接，**Then** 显示连接失败的错误提示，并提供重试入口

---

### User Story 3 - 请求历史记录 (Priority: P3)

系统自动保存用户发送过的 HTTP 请求（URL、方法、Header、Body），用户可以查看历史列表，点击某条记录快速回填到请求表单，方便重复调试同一接口。

**Why this priority**: 这是提升效率的辅助功能，减少重复输入，但不影响核心的网络调试能力。

**Independent Test**: 发送几个不同 URL 的请求后查看历史列表，验证记录存在且点击后可回填表单并重新发送。

**Acceptance Scenarios**:

1. **Given** 用户发送过 3 个 HTTP 请求，**When** 打开历史记录，**Then** 按时间倒序显示这 3 条记录，每条显示 URL、方法和发送时间
2. **Given** 历史列表中有请求，**When** 用户点击某条记录，**Then** 请求表单自动填入该请求的 URL、方法、Header 和 Body
3. **Given** 请求历史已满 20 条，**When** 用户发送新请求，**Then** 最早的一条记录被自动移除，新记录出现在列表顶部

---

### Edge Cases

- HTTP 请求超时（服务器无响应）时如何向用户展示？应显示超时提示和大概等待时长
- 服务器返回的响应体非常大（如几 MB）时，页面如何展示而不卡顿？
- WebSocket 服务端主动断开连接时，客户端如何区分"正常关闭"和"异常断开"？
- 用户在 WebSocket 已连接状态下切换到 HTTP 标签页或离开页面，连接是否需要保持？
- HTTP Body 为非 JSON 格式（如表单编码 `application/x-www-form-urlencoded`、纯文本、XML）时如何编辑和发送？
- 同时发送多个 HTTP 请求时如何管理（串行还是并行，如何取消其中一个）？
- 应用进入后台时 WebSocket 连接如何处理？

## Requirements

### Functional Requirements

- **FR-001**: 系统必须提供 HTTP 请求构建器，支持用户输入目标 URL
- **FR-002**: 系统必须支持选择 HTTP 方法：GET、POST、PUT、DELETE
- **FR-003**: 系统必须支持用户添加、编辑、删除自定义请求 Header（键值对形式）
- **FR-004**: 系统必须支持用户编辑请求 Body，支持 JSON 格式（结构化和纯文本两种视图）
- **FR-005**: 系统必须展示 HTTP 响应信息：状态码、响应头（可折叠）、响应体（格式化展示）、请求耗时（毫秒）
- **FR-006**: 系统必须在请求进行中显示加载状态，并提供取消请求的能力
- **FR-007**: 系统必须提供 WebSocket 连接功能，支持用户输入 WebSocket 服务器 URL（`ws://` 或 `wss://`）
- **FR-008**: 系统必须支持 WebSocket 消息的发送和实时接收，已发送和已接收消息用不同样式区分
- **FR-009**: 系统必须在 WebSocket 连接断开时自动尝试重连，最多重连 3 次，并显示当前重连状态
- **FR-010**: 系统必须实时显示 WebSocket 连接状态：未连接、连接中、已连接、重连中、错误
- **FR-011**: 系统必须自动保存最近 20 条 HTTP 请求记录（URL、方法、Header、Body、发送时间）
- **FR-012**: 用户必须能够查看请求历史列表，并点击某条记录将参数回填到请求表单
- **FR-013**: 系统必须对所有网络错误提供清晰的中文错误提示
- **FR-014**: 页面卸载时系统必须正确清理所有网络连接和定时器

### Key Entities

- **HTTP 请求（HttpRequest）**: URL 地址、请求方法（GET/POST/PUT/DELETE）、Header 键值对列表、Body 内容及类型、发送时间戳
- **HTTP 响应（HttpResponse）**: 状态码、响应头列表、响应体内容、请求耗时（毫秒）
- **WebSocket 连接（WsConnection）**: 服务器 URL、连接状态（未连接/连接中/已连接/重连中/错误）、当前重连次数
- **WebSocket 消息（WsMessage）**: 消息方向（发送/接收）、消息内容、时间戳
- **请求历史记录（RequestHistory）**: HTTP 请求快照，按时间倒序排列，最大 20 条

## Success Criteria

### Measurable Outcomes

- **SC-001**: 用户能够在 30 秒内完成一个 HTTP 请求的完整构建和发送流程（从进入页面到看到响应）
- **SC-002**: WebSocket 消息从发送到出现在列表中，延迟不超过 100 毫秒（本地网络环境）
- **SC-003**: 请求历史记录的加载和回填操作在 1 秒内完成
- **SC-004**: 所有网络错误场景都有对应的中文错误提示，用户无需外部文档即可理解失败原因
- **SC-005**: 离开页面后 WebSocket 连接正确断开，不产生内存泄漏或后台流量
- **SC-006**: HTTP 响应体在 1MB 以内时，格式化和渲染在 500 毫秒内完成

## Assumptions

- 目标用户具备基础的网络协议知识（了解 HTTP 方法和 WebSocket 概念）
- 用户处于可用的网络环境中（WiFi 或蜂窝数据）
- 项目已有的 Expo Router 路由系统可直接使用，从首页「网络通讯」菜单跳转到新页面
- 项目已有的编码规范（常量提取、枚举类型、错误处理模板）适用于本功能
- HTTP Body 编辑以 JSON 为主要格式，支持查看原始文本，其他 Content-Type 可在后续版本扩展
- WebSocket 使用标准协议（`ws://` 和 `wss://`），不涉及自定义子协议协商
- 请求历史数据存储使用项目已有的本地存储方案（AsyncStorage），不引入新的存储基础设施
- iOS 模拟器/真机的网络权限已在项目配置中处理（App Transport Security 等）
