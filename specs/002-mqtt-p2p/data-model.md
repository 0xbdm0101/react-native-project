# Data Model: MQTT/P2P 协议对接

**Date**: 2026-06-24
**Feature**: 002-mqtt-p2p

## 实体定义

### 1. MQTTBroker (MQTT Broker)

**描述**: 代表一个 MQTT 服务器配置

**字段**:
- `id`: string - 配置唯一标识符
- `name`: string - 配置名称
- `host`: string - Broker 地址
- `port`: number - 端口号（默认 1883）
- `protocol`: Protocol - 协议类型（tcp、ws、wss）
- `username`: string | null - 用户名
- `password`: string | null - 密码
- `clientId`: string - 客户端 ID
- `keepAlive`: number - Keep Alive 间隔（秒）
- `cleanSession`: boolean - 清除会话
- `ssl`: boolean - 是否使用 SSL/TLS

**验证规则**:
- host 必须非空
- port 范围: 1 到 65535
- clientId 必须非空
- keepAlive 范围: 0 到 65535

### 2. MQTTTopic (MQTT 主题)

**描述**: 代表一个订阅的主题

**字段**:
- `topic`: string - 主题名
- `qos`: QoS - QoS 等级（0、1、2）
- `subscribedAt`: number - 订阅时间戳
- `messageCount`: number - 收到的消息数量

**验证规则**:
- topic 必须非空
- topic 格式符合 MQTT 规范
- qos 范围: 0 到 2

### 3. MQTTMessage (MQTT 消息)

**描述**: 代表一条 MQTT 消息

**字段**:
- `id`: string - 消息唯一标识符
- `topic`: string - 主题
- `payload`: string - 消息内容
- `qos`: QoS - QoS 等级
- `retain`: boolean - 是否保留消息
- `timestamp`: number - 时间戳
- `direction`: Direction - 消息方向（发送、接收）

**验证规则**:
- topic 必须非空
- payload 可以为空
- timestamp 必须有效

### 4. ConnectionConfig (连接配置)

**描述**: 代表一个 Broker 连接配置

**字段**:
- `id`: string - 配置唯一标识符
- `name`: string - 配置名称
- `broker`: MQTTBroker - Broker 信息
- `autoConnect`: boolean - 是否自动连接
- `lastConnected`: number | null - 最后连接时间

**验证规则**:
- name 必须非空
- broker 必须有效

## 枚举定义

### 1. ConnectionStatus (连接状态)

**描述**: MQTT 连接状态

**枚举值**:
- `DISCONNECTED`: 已断开
- `CONNECTING`: 连接中
- `CONNECTED`: 已连接
- `RECONNECTING`: 重连中
- `ERROR`: 错误

### 2. QoS (服务质量)

**描述**: MQTT QoS 等级

**枚举值**:
- `QOS_0`: 最多一次（0）
- `QOS_1`: 至少一次（1）
- `QOS_2`: 恰好一次（2）

### 3. Protocol (协议)

**描述**: MQTT 协议类型

**枚举值**:
- `TCP`: TCP 协议（mqtt://）
- `WS`: WebSocket 协议（ws://）
- `WSS`: WebSocket SSL 协议（wss://）

### 4. Direction (方向)

**描述**: 消息方向

**枚举值**:
- `INBOUND`: 接收的消息
- `OUTBOUND`: 发送的消息

## 关系定义

### MQTTBroker → MQTTTopic (1:N)
- 一个 Broker 可以有多个订阅的主题
- 主题属于特定 Broker 连接

### MQTTBroker → MQTTMessage (1:N)
- 一个 Broker 可以有多个消息
- 消息属于特定 Broker 连接

### MQTTTopic → MQTTMessage (1:N)
- 一个主题可以有多个消息
- 消息属于特定主题

### ConnectionConfig → MQTTBroker (1:1)
- 一个配置对应一个 Broker
- Broker 信息嵌入配置中

## 数据流

### 连接流程
```
用户输入 → 验证配置 → 建立连接 → 更新状态 → 保存配置
```

### 订阅流程
```
用户输入主题 → 验证主题 → 订阅主题 → 更新主题列表 → 监听消息
```

### 发送流程
```
用户输入消息 → 验证消息 → 发送消息 → 更新消息列表 → 确认发送
```

### 接收流程
```
收到消息 → 解析消息 → 更新消息列表 → 通知用户
```

## 数据转换

### Broker 配置转换
```typescript
// 从配置到连接选项
const connectOptions: IClientOptions = {
  host: broker.host,
  port: broker.port,
  protocol: broker.protocol,
  username: broker.username,
  password: broker.password,
  clientId: broker.clientId,
  keepalive: broker.keepAlive,
  clean: broker.cleanSession,
  rejectUnauthorized: broker.ssl,
};
```

### 消息转换
```typescript
// 从 MQTT 消息到应用消息
const appMessage: MQTTMessage = {
  id: generateId(),
  topic: message.topic,
  payload: message.payload.toString(),
  qos: message.qos,
  retain: message.retain,
  timestamp: Date.now(),
  direction: 'INBOUND',
};
```

### 主题转换
```typescript
// 从订阅选项到主题信息
const topicInfo: MQTTTopic = {
  topic: subscribeTopic,
  qos: subscribeQoS,
  subscribedAt: Date.now(),
  messageCount: 0,
};
```

## 验证规则汇总

### 必填字段
- MQTTBroker.host
- MQTTBroker.port
- MQTTBroker.clientId
- MQTTTopic.topic
- MQTTMessage.topic

### 范围验证
- port: 1 到 65535
- keepAlive: 0 到 65535
- qos: 0 到 2

### 格式验证
- topic: 符合 MQTT 规范
- host: 有效的 IP 或域名
- payload: 任意字符串

## 状态管理

### 全局状态
- `connectionStatus`: ConnectionStatus - 连接状态
- `broker`: MQTTBroker | null - 当前 Broker
- `topics`: MQTTTopic[] - 已订阅主题
- `messages`: MQTTMessage[] - 消息列表
- `error`: string | null - 错误信息

### 局部状态
- `isConnecting`: boolean - 是否正在连接
- `isSubscribing`: boolean - 是否正在订阅
- `isSending`: boolean - 是否正在发送

## 缓存策略

### Broker 配置缓存
- 使用 AsyncStorage 持久化
- 应用启动时加载
- 配置变更时保存

### 消息缓存
- 内存存储最近 1000 条消息
- 超出限制时删除旧消息
- 无需持久化

### 主题缓存
- 内存存储已订阅主题
- 连接断开时清空
- 重新连接时恢复订阅

## 错误处理

### 连接错误
- 地址不可达
- 认证失败
- 协议不支持
- 网络超时

### 订阅错误
- 主题格式错误
- 权限不足
- QoS 不支持

### 发送错误
- 连接断开
- 消息过大
- 主题格式错误

### 处理策略
- 提供默认值
- 显示友好提示
- 记录错误日志
- 支持重试

---

**Status**: ✅ COMPLETE
**Next**: quickstart.md
