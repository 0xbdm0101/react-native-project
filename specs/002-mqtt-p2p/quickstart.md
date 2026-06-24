# Quickstart: MQTT/P2P 协议对接

**Date**: 2026-06-24
**Feature**: 002-mqtt-p2p

## 快速验证指南

本指南帮助你验证 MQTT 功能是否正常工作。

## 前置条件

### 环境要求
- Node.js 18+
- Expo CLI
- iOS 模拟器或真机 / Android 模拟器或真机
- 可用的 MQTT Broker（如 Mosquitto、EMQX）

### 依赖检查
```bash
# 检查 mqtt.js 是否安装
npm list mqtt

# 如果未安装，执行
npm install mqtt
```

### MQTT Broker 准备

**选项 1: 使用公共 Broker（推荐测试）**
- Broker: broker.emqx.io
- Port: 1883
- 无需认证

**选项 2: 本地 Mosquitto**
```bash
# 安装 Mosquitto
brew install mosquitto  # macOS
# 或
sudo apt install mosquitto  # Ubuntu

# 启动 Mosquitto
mosquitto -v
```

**选项 3: Docker EMQX**
```bash
docker run -d --name emqx -p 1883:1883 -p 8083:8083 emqx/emqx:latest
```

## 验证场景

### 场景 1: 连接 Broker

**目标**: 验证 MQTT 连接功能

**步骤**:
1. 启动应用
2. 进入 MQTT 页面
3. 输入 Broker 地址（如 broker.emqx.io）
4. 点击"连接"按钮

**预期结果**:
- 显示"连接中..."状态
- 连接成功后显示"已连接"
- Broker 信息可见

**验证命令**:
```bash
# 启动开发服务器
npx expo start

# 在模拟器中运行
npx expo run:ios
# 或
npx expo run:android
```

### 场景 2: 订阅主题

**目标**: 验证主题订阅功能

**步骤**:
1. 确保已连接到 Broker
2. 输入主题名（如 test/topic）
3. 选择 QoS 等级
4. 点击"订阅"按钮

**预期结果**:
- 主题出现在已订阅列表中
- 显示订阅时间
- 显示消息计数

### 场景 3: 接收消息

**目标**: 验证消息接收功能

**步骤**:
1. 订阅主题后
2. 使用 MQTT 客户端发送消息到该主题
3. 观察应用中的消息列表

**测试工具**:
```bash
# 使用 mosquitto_pub 发送消息
mosquitto_pub -h broker.emqx.io -t "test/topic" -m "Hello MQTT"

# 或使用 MQTTX 桌面客户端
```

**预期结果**:
- 消息实时显示在列表中
- 显示主题、内容、时间戳
- 消息按时间排序

### 场景 4: 发送消息

**目标**: 验证消息发送功能

**步骤**:
1. 确保已连接到 Broker
2. 输入主题和消息内容
3. 选择 QoS 等级
4. 点击"发送"按钮

**预期结果**:
- 消息发送成功
- 消息出现在消息列表中
- 显示发送时间

### 场景 5: 取消订阅

**目标**: 验证取消订阅功能

**步骤**:
1. 在已订阅主题列表中
2. 点击主题的"取消订阅"按钮

**预期结果**:
- 主题从列表中移除
- 不再接收该主题的消息

### 场景 6: 断开连接

**目标**: 验证断开连接功能

**步骤**:
1. 点击"断开"按钮

**预期结果**:
- 连接状态变为"已断开"
- 停止接收消息
- 可以重新连接

## 性能验证

### 连接性能
- **目标**: 连接时间 < 3 秒
- **测试**: 点击连接到连接成功的时间
- **工具**: 使用秒表

### 消息延迟
- **目标**: 消息延迟 < 1 秒
- **测试**: 发送消息到接收消息的时间
- **工具**: 使用 MQTT 客户端和应用对比

### 重连性能
- **目标**: 重连时间 < 5 秒
- **测试**: 断开网络后恢复，观察重连时间
- **工具**: 使用秒表

### UI 流畅度
- **目标**: 动画流畅 60fps
- **测试**: 滑动消息列表、切换页面
- **工具**: 使用 React Native 性能监控

## 故障排除

### 问题 1: 连接失败

**可能原因**:
- Broker 地址错误
- 网络不可用
- 认证失败
- 防火墙阻止

**解决方法**:
1. 检查 Broker 地址和端口
2. 检查网络连接
3. 检查用户名密码
4. 检查防火墙设置

### 问题 2: 订阅失败

**可能原因**:
- 主题格式错误
- 权限不足
- QoS 不支持

**解决方法**:
1. 检查主题格式
2. 检查 Broker 权限
3. 降低 QoS 等级

### 问题 3: 消息接收不到

**可能原因**:
- 主题订阅失败
- 消息发送到错误主题
- QoS 不匹配

**解决方法**:
1. 检查订阅状态
2. 检查主题名称
3. 检查 QoS 设置

### 问题 4: 应用崩溃

**可能原因**:
- 依赖未安装
- 配置错误
- 内存不足

**解决方法**:
1. 检查依赖安装
2. 检查配置文件
3. 重启应用

## 调试工具

### 控制台日志
```typescript
// 启用详细日志
console.log('连接状态:', connectionStatus);
console.log('已订阅主题:', topics);
console.log('消息列表:', messages);
```

### React Native 调试器
- 打开开发者菜单
- 选择"Debug"
- 查看组件状态

### MQTT 调试工具
- MQTTX: 桌面客户端
- MQTT Explorer: 可视化工具
- mosquitto_sub: 命令行工具

## 自动化测试

### 单元测试
```bash
# 运行单元测试
npm test
```

### 集成测试
```bash
# 运行集成测试
npm run test:integration
```

### E2E 测试
```bash
# 运行 E2E 测试
npm run test:e2e
```

## 验证清单

### 功能验证
- [ ] Broker 连接
- [ ] 主题订阅
- [ ] 消息接收
- [ ] 消息发送
- [ ] 取消订阅
- [ ] 断开连接
- [ ] 自动重连

### 性能验证
- [ ] 连接时间 < 3 秒
- [ ] 消息延迟 < 1 秒
- [ ] 重连时间 < 5 秒
- [ ] UI 流畅 60fps

### 用户体验验证
- [ ] 操作直观
- [ ] 状态清晰
- [ ] 错误友好
- [ ] 响应及时

### 边界情况验证
- [ ] 网络断开处理
- [ ] 认证失败处理
- [ ] 主题格式错误
- [ ] 消息过大
- [ ] 连接超时

## 下一步

验证完成后，可以：
1. 执行 `/speckit-tasks` 生成任务列表
2. 执行 `/speckit-implement` 开始实现
3. 执行 `/speckit-checklist` 进行质量检查

---

**Status**: ✅ COMPLETE
**Ready for**: Implementation or Testing
