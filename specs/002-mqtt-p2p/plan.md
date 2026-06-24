# Implementation Plan: MQTT/P2P 协议对接

**Branch**: `002-mqtt-p2p` | **Date**: 2026-06-24 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-mqtt-p2p/spec.md`

## Summary

实现 MQTT 协议对接功能，支持连接 MQTT Broker、订阅主题、接收消息、发送指令。使用 mqtt.js 库实现 MQTT 通信，支持 QoS 消息质量，实现自动重连机制。遵循项目 CONSTITUTION.md 中的 6 大核心原则。

## Technical Context

**Language/Version**: TypeScript 5.9.2, React Native 0.81.5, Expo SDK 54

**Primary Dependencies**:
- mqtt.js: MQTT 客户端库
- expo-router: 路由管理
- tamagui: UI 组件库
- valtio: 状态管理
- @react-native-async-storage/async-storage: 本地存储

**Storage**: AsyncStorage 存储 Broker 配置

**Testing**: TypeScript 编译检查, ESLint 代码规范

**Target Platform**: iOS 15+, Android 10+

**Project Type**: mobile-app

**Performance Goals**:
- Broker 连接时间 < 3 秒
- 消息延迟 < 1 秒
- 自动重连时间 < 5 秒
- UI 动画流畅 60fps

**Constraints**:
- 支持 MQTT v3.1.1 和 v5.0
- 支持 QoS 0、1、2
- 支持 TCP 和 WebSocket 协议
- 消息内容为文本格式

**Scale/Scope**: 单 Broker 连接，支持多主题订阅

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ 代码质量原则
- **检查**: 所有业务变量将提取到 constants.ts
- **状态**: PASS

### ✅ 类型安全原则
- **检查**: 使用 TypeScript 枚举定义所有状态
- **状态**: PASS

### ✅ 错误处理原则
- **检查**: 统一错误处理，友好的错误提示
- **状态**: PASS

### ✅ 性能优化原则
- **检查**: 定时器和订阅必须清理
- **状态**: PASS

### ✅ 文件组织原则
- **检查**: 独立目录，包含 constants.ts、hooks/、components/
- **状态**: PASS

### ✅ MQTT 生命周期管理原则
- **检查**: 完整的连接状态管理和重连机制
- **状态**: PASS

**Overall**: ✅ ALL GATES PASS

## Project Structure

### Documentation (this feature)

```text
specs/002-mqtt-p2p/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository root)

```text
src/pages/MQTT/
├── index.tsx              # 主页面 - Broker 连接和消息列表
├── TopicList.tsx          # 主题列表页面
├── MessageList.tsx        # 消息列表页面
├── constants.ts           # 常量、枚举、映射
├── hooks/
│   └── useMQTT.ts         # MQTT 逻辑 Hook
└── components/
    ├── BrokerCard.tsx      # Broker 信息卡片
    ├── TopicCard.tsx       # 主题卡片
    └── MessageCard.tsx     # 消息卡片
```

**Structure Decision**: 使用新的 MQTT 目录结构，与 BLE 目录并列，遵循项目规范。

## Phase 0: Research

### 研究任务

1. **MQTT 库选择**
   - Decision: 使用 mqtt.js
   - Rationale: 纯 JavaScript 实现，支持 React Native，API 简洁
   - Alternatives: react-native-mqtt, paho-mqtt

2. **MQTT 协议版本**
   - Decision: 支持 MQTT v3.1.1 和 v5.0
   - Rationale: v3.1.1 广泛支持，v5.0 功能更强大
   - Alternatives: 仅支持 v3.1.1

3. **QoS 等级**
   - Decision: 支持 QoS 0、1、2
   - Rationale: 覆盖所有使用场景
   - Alternatives: 仅支持 QoS 0 和 1

4. **自动重连机制**
   - Decision: 使用 mqtt.js 内置重连 + 自定义重连逻辑
   - Rationale: 内置重连简单可靠，自定义逻辑处理特殊情况
   - Alternatives: 完全自定义重连

5. **配置存储**
   - Decision: 使用 AsyncStorage 存储 Broker 配置
   - Rationale: 简单可靠，无需数据库
   - Alternatives: 文件存储、云端存储

6. **消息存储**
   - Decision: 内存存储最近 1000 条消息
   - Rationale: 轻量级，无需持久化
   - Alternatives: SQLite、AsyncStorage

### 研究结论

所有技术选择已确定，无需进一步澄清。mqtt.js 是成熟稳定的 MQTT 客户端库，符合项目要求。

## Phase 1: Design & Contracts

### 数据模型

详见 [data-model.md](data-model.md)

### 接口契约

本功能为内部移动应用，无外部接口暴露。MQTT 通信使用标准 MQTT 协议。

### 快速验证指南

详见 [quickstart.md](quickstart.md)

## Implementation Approach

### 核心组件

1. **useMQTT Hook**
   - MQTT 连接管理
   - 主题订阅管理
   - 消息收发
   - 自动重连
   - 资源清理

2. **MQTTPage (index.tsx)**
   - Broker 连接界面
   - 连接状态显示
   - 消息列表
   - 发送消息界面

3. **TopicList**
   - 已订阅主题列表
   - 订阅/取消订阅操作
   - 主题状态显示

4. **MessageList**
   - 消息列表显示
   - 消息详情查看
   - 消息筛选

5. **BrokerCard**
   - Broker 信息显示
   - 连接状态指示
   - 快速连接/断开

### 关键实现点

1. **MQTT 连接管理**
   - 支持 TCP 和 WebSocket
   - 支持用户名密码认证
   - 支持 SSL/TLS
   - 连接状态监听

2. **主题订阅**
   - 动态订阅/取消订阅
   - 支持通配符主题
   - QoS 等级选择
   - 订阅状态管理

3. **消息处理**
   - 实时消息接收
   - 消息格式解析
   - 消息历史管理
   - 消息筛选

4. **自动重连**
   - 网络断开检测
   - 自动重连机制
   - 重连间隔策略
   - 重连状态提示

5. **配置管理**
   - Broker 配置保存
   - 配置快速切换
   - 配置导入导出

### 代码规范

遵循 CONSTITUTION.md 中的所有原则：
- 常量提取到 constants.ts
- 使用枚举定义状态
- 统一错误处理
- 定时器清理
- 文件组织规范

## Risk Assessment

### 低风险
- mqtt.js 库稳定性（成熟库）
- 基础 UI 组件实现（已有设计）

### 中风险
- 网络不稳定导致连接问题
- 不同 MQTT Broker 兼容性

### 缓解措施
- 自动重连机制
- 错误处理和重试
- 用户友好的状态提示

## Dependencies

### 外部依赖
- mqtt.js: 需要安装
- @react-native-async-storage/async-storage: 已安装
- expo: 已安装
- react-native: 已安装

### 内部依赖
- 路由系统: expo-router
- UI 组件: tamagui
- 图标: @expo/vector-icons

## Timeline

### Phase 0: Research ✅
- 技术选型完成
- 最佳实践确认

### Phase 1: Design ✅
- 数据模型设计
- 接口定义
- 验证指南

### Phase 2: Implementation
- 核心 Hook 实现
- UI 组件开发
- 集成测试

### Phase 3: Testing
- 功能测试
- 性能测试
- 用户测试

## Success Metrics

### 功能完整性
- ✅ Broker 连接功能
- ✅ 主题订阅功能
- ✅ 消息收发功能
- ✅ 自动重连功能
- ✅ 配置管理功能

### 性能指标
- 连接时间 < 3 秒
- 消息延迟 < 1 秒
- 重连时间 < 5 秒
- UI 流畅 60fps

### 用户体验
- 操作直观
- 状态清晰
- 错误友好
- 响应及时

## Next Steps

1. **执行实现**: `/speckit-implement`
2. **生成任务**: `/speckit-tasks`
3. **质量检查**: `/speckit-checklist`

---

**Plan Status**: ✅ COMPLETE
**Ready for**: `/speckit-tasks` or `/speckit-implement`
