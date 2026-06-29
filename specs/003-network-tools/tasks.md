# Tasks: 网络通讯工具

**Input**: Design documents from `specs/003-network-tools/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅

**Tests**: 手动验证（见 quickstart.md），不生成自动化测试。

**Organization**: 按用户故事分组，每个故事可独立实现和验证。

---

## Phase 1: Setup

**Purpose**: 安装依赖 + 创建目录结构

- [x] T001 Install axios dependency with `npm install --save axios --legacy-peer-deps`
- [x] T002 [P] Create `src/api/` directory and file stubs per plan.md
- [x] T003 [P] Create `src/pages/Network/` directory structure per plan.md
- [x] T004 [P] Create `app/network.tsx` route file exporting Network page

---

## Phase 2: Foundational

**Purpose**: 核心基础设施，所有用户故事都依赖。完成后才能开始 US1-3。

**⚠️ CRITICAL**: 本阶段必须完成才能开始任何用户故事。

- [x] T005 Create API config in `src/api/config.ts` — 超时时间、默认 Content-Type、最大响应体积等常量
- [x] T006 [P] Create API utilities in `src/api/utils.ts` — 请求日志格式化、错误信息提取
- [x] T007 Create axios instance with interceptors in `src/api/index.ts` — 请求/响应拦截器（日志、错误处理、超时、取消）
- [x] T008 [P] Create all enums and UI text constants in `src/pages/Network/constants.ts` — HttpMethod, BodyType, WsStatus, Direction, UI_TEXTS, STYLE_CONFIG, 状态映射表
- [x] T009 [P] Create all type definitions in `src/pages/Network/types.ts` — HttpRequest, HttpResponse, WsConnection, WsMessage, RequestHistory, HttpHeader
- [x] T010 Create Network page shell with HTTP/WebSocket tab switcher in `src/pages/Network/index.tsx` (空壳，两个标签各放占位 Text)

**Checkpoint**: 骨架就绪 — 路由可访问，Tab 可切换，空页面显示正常。

---

## Phase 3: User Story 1 — HTTP 请求构建与发送 (Priority: P1) 🎯 MVP

**Goal**: 用户可以输入 URL、选择方法、添加 Header/Body、发送请求、查看响应。

**Independent Test**: 发 GET 到 `https://httpbin.org/get` → 看到状态码 200、响应 JSON、耗时。

### Services Layer

- [x] T011 [US1] Create HTTP request service in `src/pages/Network/services/index.ts` — 封装 `src/api/` 实例，导出 `sendRequest()` 函数（接受 HttpRequest 参数，返回 HttpResponse）

### Custom Hook

- [x] T012 [US1] Create useHttpRequest hook in `src/pages/Network/hooks/useHttpRequest.ts` — 管理请求状态（idle/loading/success/error）、响应数据、耗时计算

### Components

- [x] T013 [US1] Create RequestBuilder component in `src/pages/Network/components/RequestBuilder.tsx` — URL 输入框、方法选择器（GET/POST/PUT/DELETE）、Header 键值对编辑器（增删改）、Body 文本编辑器、发送按钮、取消按钮
- [x] T014 [US1] Create ResponseViewer component in `src/pages/Network/components/ResponseViewer.tsx` — 状态码 + 耗时展示、响应头可折叠列表、响应体格式化展示（JSON 缩进 / 原始文本）、无响应时显示空白状态

### Integration

- [x] T015 [US1] Integrate useHttpRequest hook + RequestBuilder + ResponseViewer into `src/pages/Network/index.tsx` HTTP tab

**Checkpoint**: HTTP 请求功能完整可用，可以独立验证。

---

## Phase 4: User Story 2 — WebSocket 实时通信终端 (Priority: P2)

**Goal**: 用户可以连接 WebSocket 服务器、发送消息、实时接收消息、断线自动重连。

**Independent Test**: 连接 `wss://echo.websocket.org` → 发送消息 → 收到回显 → 手动断网 → 显示重连中 → 恢复后重连成功。

### Custom Hook

- [x] T016 [US2] Create useWebSocket hook in `src/pages/Network/hooks/useWebSocket.ts` — 管理连接状态（WsStatus）、消息列表（WsMessage[]）、连接/断开/发送/重连逻辑、指数递增重连（2s→4s→8s 最多 3 次）、cleanup 自动断开

### Component

- [x] T017 [US2] Create WebSocketTerminal component in `src/pages/Network/components/WebSocketTerminal.tsx` — URL 输入框、连接/断开按钮、连接状态指示、消息列表（区分发送/接收样式）、消息输入框 + 发送按钮、连接中/断开时输入框禁用

### Integration

- [x] T018 [US2] Integrate useWebSocket hook + WebSocketTerminal into `src/pages/Network/index.tsx` WebSocket tab

**Checkpoint**: WebSocket 功能完整可用，HTTP + WebSocket 均可独立工作。

---

## Phase 5: User Story 3 — 请求历史记录 (Priority: P3)

**Goal**: 自动保存最近 20 条 HTTP 请求，用户可查看列表、点击回填到表单。

**Independent Test**: 发 3 个不同 URL 请求 → 查看历史 → 看到 3 条记录 → 点击一条 → 表单自动填入。

### Implementation

- [x] T019 [US3] Add history persistence to useHttpRequest in `src/pages/Network/hooks/useHttpRequest.ts` — 每次请求成功后自动保存到 AsyncStorage（最多 20 条，按时间倒序）

### Component

- [x] T020 [US3] Create RequestHistory component in `src/pages/Network/components/RequestHistory.tsx` — 历史列表（URL + 方法 + 时间）、点击回填到请求表单、下拉刷新

### Integration

- [x] T021 [US3] Integrate RequestHistory + history load into `src/pages/Network/index.tsx` — 历史按钮打开 BottomSheet 或 Modal 展示列表

**Checkpoint**: 全部三个用户故事可独立验证。

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 收尾优化

- [x] T022 Wire up Home page navigation: update MenuGrid/MENU_LIST to navigate to `/network` for "网络通讯" item
- [x] T023 Run quickstart.md validation (HTTP GET/POST, WebSocket echo, timeout test, history test)
- [x] T024 Code cleanup: verify all constants extracted, enums used, error messages in Chinese, no hardcoded values

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 6 (Polish)
                                                   ↘ Phase 4, 5 可与 US1 并行（不同文件）
```

### User Story Dependencies

- **US1 (P1)**: 依赖 Phase 2 完成，不依赖其他故事。**必须是 MVP 第一步。**
- **US2 (P2)**: 依赖 Phase 2 完成，可与 US1 并行。仅 index.tsx 集成时有轻微依赖（US1 先写的 Tab 结构）
- **US3 (P3)**: 依赖 US1 完成（需要 useHttpRequest hook 已有发送逻辑和表单组件引用）

### Within Each User Story

```
Services → Hook → Components → Integration
```

### Parallel Opportunities

- T002, T003, T004 可并行（Phase 1 不同目录）
- T006 可与 T005 并行（不同文件）
- T008, T009 可并行（不同文件）
- Phase 4 整体可与 Phase 3 并行（不同 hooks、不同 components）

---

## Implementation Strategy

### MVP First (仅 User Story 1)

1. Phase 1 → Phase 2 → Phase 3
2. **STOP & VALIDATE**: 用 quickstart.md 验证 HTTP 请求
3. MVP 可用

### Incremental Delivery

1. Setup + Foundational → 骨架
2. US1 → HTTP 工具可用 (MVP!)
3. US2 → WebSocket 可用
4. US3 → 历史记录可用
5. Polish → 上线

---

## Task Summary

| Phase | Tasks | Story |
|-------|-------|-------|
| Phase 1: Setup | T001-T004 | — |
| Phase 2: Foundational | T005-T010 | — |
| Phase 3: US1 (P1) | T011-T015 | HTTP |
| Phase 4: US2 (P2) | T016-T018 | WebSocket |
| Phase 5: US3 (P3) | T019-T021 | History |
| Phase 6: Polish | T022-T024 | — |
| **Total** | **24 tasks** | **3 stories** |
