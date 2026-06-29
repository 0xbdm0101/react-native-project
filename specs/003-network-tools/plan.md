# Implementation Plan: 网络通讯工具

**Branch**: `003-network-tools` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-network-tools/spec.md`

## Summary

在应用中新增「网络通讯」页面，提供 HTTP 请求构建器（GET/POST/PUT/DELETE + 自定义 Header/Body + 响应展示）和 WebSocket 实时通信终端（发送/接收消息 + 断线自动重连）。从首页「网络通讯」菜单进入。HTTP 使用业界最流行的 axios 库，WebSocket 基于 React Native 内置 API 并自行实现自动重连机制。

## Technical Context

**Language/Version**: TypeScript 5.9

**Primary Dependencies**: axios（HTTP 客户端，最流行），React Native 内置 WebSocket API，Tamagui（UI），Expo Router（路由），AsyncStorage（历史持久化）

**Storage**: AsyncStorage（请求历史记录，最多 20 条）

**Testing**: 手动测试（公开 API + WebSocket 回声服务）

**Target Platform**: iOS (simulator + device), Expo SDK 54

**Project Type**: Mobile app (React Native + Expo)

**Performance Goals**: WebSocket 消息延迟 <100ms，HTTP 响应体 1MB 内渲染 <500ms

**Constraints**: 唯一新增依赖为 axios；页面卸载必须清理连接

**Scale/Scope**: 单页面，2 个核心功能（HTTP + WebSocket），1 个辅助功能（历史记录）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原则 | 状态 | 说明 |
|------|------|------|
| I. 代码质量 | ✅ PASS | 所有常量/枚举/映射提取到 constants.ts |
| II. 类型安全 | ✅ PASS | 所有状态用枚举，所有变量有类型注解 |
| III. 错误处理 | ✅ PASS | axios 拦截器统一错误处理，忽略 cancelled 错误 |
| IV. 性能优化 | ✅ PASS | useEffect cleanup 清理 axios CancelToken + WebSocket |
| V. 文件组织 | ✅ PASS | 遵循 feature/ 目录结构：constants.ts + types.ts + hooks/ + components/ |
| VI. 生命周期 | ✅ PASS | WebSocket 连接状态管理，断开事件监听，资源清理 |

## Project Structure

### Documentation (this feature)

```text
specs/003-network-tools/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
src/api/                          # 主入口：API 配置（参考 orswap 模式）
├── index.ts                      # axios 实例 + 请求/响应拦截器
├── config.ts                     # API 常量（超时、默认 Header 等）
└── utils.ts                      # 工具函数（请求日志、错误格式化）

src/pages/Network/
├── index.tsx                     # 主页面（HTTP + WebSocket 双标签）
├── constants.ts                  # 枚举、常量、UI 文案
├── types.ts                      # 类型定义
├── hooks/
│   ├── useHttpRequest.ts         # HTTP 请求逻辑（调用 services）
│   └── useWebSocket.ts           # WebSocket 连接 + 自动重连
├── services/
│   └── index.ts                  # 业务入口：HTTP 请求封装（引用 src/api）
└── components/
    ├── RequestBuilder.tsx        # HTTP 请求构建器
    ├── ResponseViewer.tsx        # 响应展示组件
    ├── WebSocketTerminal.tsx      # WebSocket 消息终端
    └── RequestHistory.tsx        # 请求历史记录

app/
└── network.tsx                   # 路由文件 → src/pages/Network/
```

**Structure Decision**: 
- `src/api/` 作为主入口统一管理 axios 实例和拦截器配置（参考 orswap 的 `src/api/index.ts` 模式）
- `src/pages/Network/services/` 作为业务入口，调用 `src/api/` 的实例，不直接引用 axios（参考 orswap 的 `Swap/services/index.ts` 模式）
- 其余结构遵循项目现有模式（与 MQTT/BLE 一致）

## Dependencies

### New
| Package | Version | Purpose |
|---------|---------|---------|
| axios | latest | HTTP 客户端，业界最流行 |

### Existing (reused)
| Package | Purpose |
|---------|---------|
| React Native WebSocket | WebSocket 通信（内置） |
| AsyncStorage | 请求历史持久化 |
| Tamagui | UI 组件 |
| expo-router | 路由 |

## Complexity Tracking

> 无违规项，无需填写。
