# Research: MQTT/P2P 协议对接

**Date**: 2026-06-24
**Feature**: 002-mqtt-p2p

## 技术选型研究

### 1. MQTT 客户端库选择

**Decision**: 使用 mqtt.js

**Rationale**:
- 纯 JavaScript 实现，无原生依赖
- 支持 React Native 环境
- API 设计简洁，文档完善
- 社区活跃，维护良好
- 支持 MQTT v3.1.1 和 v5.0

**Alternatives Considered**:
- **react-native-mqtt**: 需要原生模块，配置复杂
- **paho-mqtt**: 功能较少，API 不够简洁
- **MQTT.js**: 与 mqtt.js 相同，名称不同

**结论**: mqtt.js 是最佳选择

### 2. MQTT 协议版本

**Decision**: 支持 MQTT v3.1.1 和 v5.0

**Rationale**:
- v3.1.1 广泛支持，兼容性好
- v5.0 功能更强大，支持共享订阅
- mqtt.js 同时支持两个版本
- 用户可根据 Broker 选择版本

**Alternatives Considered**:
- **仅支持 v3.1.1**: 简单但功能有限
- **仅支持 v5.0**: 可能兼容性问题

**结论**: 同时支持两个版本

### 3. QoS 等级

**Decision**: 支持 QoS 0、1、2

**Rationale**:
- QoS 0: 最快，适合实时数据
- QoS 1: 至少一次，适合一般消息
- QoS 2: 恰好一次，适合重要指令
- 覆盖所有使用场景

**Alternatives Considered**:
- **仅支持 QoS 0 和 1**: 简单但缺少重要场景
- **仅支持 QoS 0**: 最简单但功能有限

**结论**: 支持所有 QoS 等级

### 4. 自动重连机制

**Decision**: 使用 mqtt.js 内置重连 + 自定义重连逻辑

**Rationale**:
- mqtt.js 内置重连简单可靠
- 自定义逻辑处理特殊情况（如网络切换）
- 可配置重连间隔和次数
- 用户友好的重连状态提示

**Alternatives Considered**:
- **完全依赖内置重连**: 简单但不够灵活
- **完全自定义重连**: 复杂且容易出错

**结论**: 结合内置和自定义

### 5. 配置存储

**Decision**: 使用 AsyncStorage 存储 Broker 配置

**Rationale**:
- 项目已集成 AsyncStorage
- 简单可靠，无需数据库
- 支持多配置存储
- 异步操作，不阻塞 UI

**Alternatives Considered**:
- **文件存储**: 需要文件系统权限
- **云端存储**: 需要网络和账号
- **SQLite**: 过度设计

**结论**: AsyncStorage 是最佳选择

### 6. 消息存储

**Decision**: 内存存储最近 1000 条消息

**Rationale**:
- 轻量级，无需持久化
- 读写速度快
- 自动清理旧消息
- 节省存储空间

**Alternatives Considered**:
- **AsyncStorage 持久化**: 占用存储空间
- **SQLite 持久化**: 过度设计
- **无限制存储**: 可能内存溢出

**结论**: 内存存储 + 限制数量

## 最佳实践研究

### MQTT 开发最佳实践

1. **连接管理**
   - 使用 Client ID 避免重复连接
   - 设置合理的 Keep Alive 间隔
   - 处理连接断开事件
   - 实现自动重连机制

2. **主题设计**
   - 使用层级主题结构
   - 避免主题过深
   - 使用通配符订阅
   - 主题命名规范

3. **消息处理**
   - 解析消息格式（JSON、纯文本）
   - 处理大消息
   - 消息去重（QoS 1、2）
   - 消息排序

4. **错误处理**
   - 连接错误处理
   - 订阅错误处理
   - 发送错误处理
   - 网络错误处理

5. **性能优化**
   - 批量订阅
   - 消息缓冲
   - 内存管理
   - 电池优化

### React Native MQTT 开发模式

1. **Hook 模式**
   - 封装 MQTT 逻辑到自定义 Hook
   - 状态和操作分离
   - 便于复用和测试

2. **组件模式**
   - Broker 信息组件
   - 主题列表组件
   - 消息列表组件
   - 发送消息组件

3. **错误处理模式**
   - try-catch 包装
   - 用户友好提示
   - 日志记录

4. **生命周期模式**
   - useEffect 清理
   - 订阅管理
   - 定时器管理

## 技术风险评估

### 低风险
- mqtt.js 库稳定性
- 基础 UI 组件实现
- 路由导航

### 中风险
- 网络不稳定导致连接问题
- 不同 MQTT Broker 兼容性
- 消息格式解析

### 高风险
- 无

## 缓解措施

1. **网络不稳定**
   - 自动重连机制
   - 重连状态提示
   - 离线消息缓存

2. **Broker 兼容性**
   - 标准 MQTT 协议
   - 可配置参数
   - 错误处理

3. **消息解析**
   - 多格式支持
   - 错误处理
   - 默认值

## 结论

所有技术选型已完成，风险可控。mqtt.js 是成熟稳定的 MQTT 客户端库，符合项目要求。可以进入设计阶段。

**Status**: ✅ COMPLETE
**Next**: Phase 1 Design
