# MQTT 测试验证指南

## 测试目标

验证 MQTT 功能的完整性和稳定性，包括：
- Broker 连接
- 主题订阅/取消订阅
- 消息发送/接收
- QoS 等级
- Retain 消息

---

## 测试环境准备

### 1. 安装 MQTTX

**桌面版**（推荐）：
- 下载：https://mqttx.app/downloads
- 支持 macOS / Windows / Linux

**Web 版**：
- 访问：https://mqttx.app/web
- 无需安装，直接使用

### 2. 公共 Broker 信息

```
Broker: broker.emqx.io
WSS 端口: 8084
WS 端口: 8083
TCP 端口: 1883
```

---

## 测试步骤

### 测试 1：基础连接

**目标**：验证 App 能成功连接到 Broker

**步骤**：
1. 打开 App，进入 MQTT 页面
2. 确认默认 Broker 配置：
   - 地址：`broker.emqx.io`
   - 端口：`8084`
   - 协议：`WSS`
3. 点击「连接」按钮
4. 观察状态变化：`连接中...` → `已连接`

**预期结果**：
- ✅ 连接成功，状态显示「已连接」
- ✅ BrokerCard 显示连接信息
- ✅ 订阅和发送区域出现

**故障排查**：
- 如果连接失败，检查网络连接
- 尝试切换到 WS 协议（端口 8083）
- 查看错误提示信息

---

### 测试 2：主题订阅

**目标**：验证主题订阅功能

**步骤**：
1. 确保 App 已连接
2. 在「订阅主题」区域输入：`leo/test/app`
3. 点击订阅按钮（+）
4. 观察「已订阅主题」列表

**预期结果**：
- ✅ 主题出现在已订阅列表
- ✅ 显示 QoS 等级和消息计数
- ✅ 可以取消订阅

---

### 测试 3：消息发送（App → MQTTX）

**目标**：验证从 App 发送消息到 MQTTX

**步骤**：
1. 打开 MQTTX，连接到同一个 Broker
2. 在 MQTTX 中订阅主题：`leo/test/app`
3. 在 App 的「发送消息」区域：
   - 主题：`leo/test/app`
   - 内容：`Hello from App!`
4. 点击「发送」按钮
5. 查看 MQTTX 是否收到消息

**预期结果**：
- ✅ MQTTX 收到消息
- ✅ 消息内容正确
- ✅ App 消息列表显示发送的消息

---

### 测试 4：消息接收（MQTTX → App）

**目标**：验证从 MQTTX 发送消息到 App

**步骤**：
1. 确保 App 已订阅主题：`leo/test/app`
2. 在 MQTTX 中发布消息：
   - 主题：`leo/test/app`
   - 内容：`Hello from MQTTX!`
3. 查看 App 是否收到消息

**预期结果**：
- ✅ App 收到消息
- ✅ 消息显示在消息列表
- ✅ 显示正确的主题、内容、时间

---

### 测试 5：双向通讯

**目标**：验证双向实时通讯

**步骤**：
1. App 订阅：`leo/test/app`
2. MQTTX 订阅：`leo/test/mqttx`
3. App 发送到 `leo/test/mqttx`：`Message 1`
4. MQTTX 发送到 `leo/test/app`：`Message 2`
5. 交替发送多条消息

**预期结果**：
- ✅ 双方都能收到对方的消息
- ✅ 消息顺序正确
- ✅ 消息列表实时更新

---

### 测试 6：QoS 等级

**目标**：验证不同 QoS 等级的行为

**QoS 说明**：
- **QoS 0**：最多一次（可能丢失）- 最快
- **QoS 1**：至少一次（可能重复）- 平衡
- **QoS 2**：恰好一次（最可靠）- 最慢

**重要规则**：
- 订阅端 QoS 决定接收消息的最大 QoS
- 发布端 QoS 决定消息发送的 QoS
- 实际接收的 QoS = min(订阅 QoS, 发布 QoS)

**测试步骤**：

**测试 6.1：QoS 0 发送，QoS 0 接收**
1. App 订阅主题，QoS 设为 0
2. MQTTX 发布消息，QoS 设为 0
3. 观察 App 收到的消息 QoS 为 0

**测试 6.2：QoS 1 发送，QoS 0 接收**
1. App 订阅主题，QoS 设为 0
2. MQTTX 发布消息，QoS 设为 1
3. 观察 App 收到的消息 QoS 为 0（被降级）

**测试 6.3：QoS 0 发送，QoS 1 接收**
1. App 订阅主题，QoS 设为 1
2. MQTTX 发布消息，QoS 设为 0
3. 观察 App 收到的消息 QoS 为 0（发布端决定）

**测试 6.4：QoS 1 发送，QoS 1 接收**
1. App 订阅主题，QoS 设为 1
2. MQTTX 发布消息，QoS 设为 1
3. 观察 App 收到的消息 QoS 为 1

**测试 6.5：QoS 2 双向测试**
1. App 订阅主题，QoS 设为 2
2. MQTTX 发布消息，QoS 设为 2
3. 观察 App 收到的消息 QoS 为 2

**预期结果**：
- ✅ 实际接收 QoS = min(订阅 QoS, 发布 QoS)
- ✅ 消息列表显示正确的 QoS 等级
- ✅ QoS 2 消息最可靠但最慢

---

### 测试 7：Retain 消息

**目标**：验证 Retain 消息功能

**Retain 说明**：
- Retain 消息会保存在 Broker
- 新订阅者连接后会立即收到最后一条 Retain 消息

**步骤**：
1. MQTTX 发布 Retain 消息：
   - 主题：`leo/test/retain`
   - 内目：`Retained message`
   - 勾选「Retain」
2. App 订阅 `leo/test/retain`
3. 观察是否立即收到 Retain 消息

**预期结果**：
- ✅ App 订阅后立即收到 Retain 消息
- ✅ 消息标记为 Retain

---

### 测试 8：通配符订阅

**目标**：验证通配符订阅功能

**通配符说明**：
- `+`：匹配单级（必须占据整个级别）
- `#`：匹配多级（必须在末尾）

**正确用法**：
- ✅ `leo/test/+` - 匹配 `leo/test/a`、`leo/test/b`
- ✅ `leo/test/#` - 匹配 `leo/test/a`、`leo/test/a/b`、`leo/test/a/b/c`
- ✅ `+/test/+` - 匹配 `any/test/any`
- ❌ `leo/test/a+` - 错误，+ 必须占据整个级别
- ❌ `leo/test/a#` - 错误，# 前面必须是 /
- ❌ `leo/#/test` - 错误，# 必须在末尾

**测试步骤**：

**测试 8.1：单级通配符 +**
1. App 订阅：`leo/test/+`（QoS 0）
2. MQTTX 发送到 `leo/test/a` → ✅ 应收到
3. MQTTX 发送到 `leo/test/b` → ✅ 应收到
4. MQTTX 发送到 `leo/test/c/d` → ❌ 不应收到（多级）
5. MQTTX 发送到 `leo/other/a` → ❌ 不应收到（不匹配）

**测试 8.2：多级通配符 #**
1. App 订阅：`leo/test/#`（QoS 0）
2. MQTTX 发送到 `leo/test/a` → ✅ 应收到
3. MQTTX 发送到 `leo/test/a/b` → ✅ 应收到
4. MQTTX 发送到 `leo/test/a/b/c` → ✅ 应收到
5. MQTTX 发送到 `leo/other/a` → ❌ 不应收到（不匹配）

**测试 8.3：混合通配符**
1. App 订阅：`+/test/#`（QoS 0）
2. MQTTX 发送到 `any/test/a` → ✅ 应收到
3. MQTTX 发送到 `any/test/a/b` → ✅ 应收到
4. MQTTX 发送到 `other/test/a` → ✅ 应收到
5. MQTTX 发送到 `any/other/a` → ❌ 不应收到（不匹配）

**预期结果**：
- ✅ 通配符正确匹配主题
- ✅ 不匹配的主题不接收消息
- ✅ 消息列表显示正确的主题名

---

### 测试 9：取消订阅

**目标**：验证取消订阅功能

**步骤**：
1. App 订阅：`leo/test/unsub`
2. 发送几条消息验证能收到
3. 点击取消订阅
4. MQTTX 继续发送消息

**预期结果**：
- ✅ 取消订阅成功
- ✅ 主题从列表移除
- ✅ 不再收到该主题的消息

---

### 测试 10：断开连接

**目标**：验证断开连接功能

**步骤**：
1. 确保 App 已连接并订阅主题
2. 点击「断开」按钮
3. 观察状态变化
4. 尝试发送消息

**预期结果**：
- ✅ 状态变为「已断开」
- ✅ 订阅和发送区域隐藏
- ✅ 无法发送消息

---

## 测试记录表

| 测试项 | 状态 | 备注 |
|--------|------|------|
| 基础连接 | ⬜ | |
| 主题订阅 | ⬜ | |
| 消息发送 | ⬜ | |
| 消息接收 | ⬜ | |
| 双向通讯 | ⬜ | |
| QoS 等级 | ⬜ | |
| Retain 消息 | ⬜ | |
| 通配符订阅 | ⬜ | |
| 取消订阅 | ⬜ | |
| 断开连接 | ⬜ | |

---

## 常见问题

### Q1: 连接失败怎么办？

**可能原因**：
- 网络问题
- Broker 地址/端口错误
- 协议不匹配

**解决方案**：
1. 检查网络连接
2. 尝试不同的 Broker：
   - `broker.hivemq.com:8000` (WS)
   - `broker.emqx.io:8083` (WS)
   - `broker.emqx.io:8084` (WSS)
3. 切换协议（TCP/WS/WSS）

### Q2: 收不到消息怎么办？

**可能原因**：
- 主题名不匹配
- 订阅未成功
- 消息未发送

**解决方案**：
1. 检查主题名是否完全一致
2. 确认订阅状态
3. 使用 MQTTX 的日志功能查看

### Q3: 消息延迟怎么办？

**可能原因**：
- 网络延迟
- Broker 负载高

**解决方案**：
1. 使用更近的 Broker
2. 检查网络质量
3. 减少消息频率

---

## 测试完成后

### 1. 记录测试结果
- 填写测试记录表
- 记录发现的问题
- 截图保存关键步骤

### 2. 报告问题
如果发现问题，请记录：
- 问题描述
- 复现步骤
- 预期行为
- 实际行为
- 错误信息

### 3. 下一步
测试通过后，可以进行：
- 配置保存功能
- 多 Broker 管理
- 消息筛选和搜索
- 真实设备对接（ESP32）

---

## 参考资源

- [MQTTX 官方文档](https://mqttx.app/docs)
- [MQTT 协议规范](https://mqtt.org/mqtt-specification/5.0/)
- [EMQX 公共 Broker](https://www.emqx.com/en/mqtt/public-mqtt5-broker)
- [HiveMQ 公共 Broker](https://www.hivemq.com/mqtt/public-mqtt-broker/)
