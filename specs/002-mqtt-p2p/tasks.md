# 任务列表: MQTT/P2P 协议对接

**输入**: 设计文档来自 `/specs/002-mqtt-p2p/`

**前置条件**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅

**测试**: 功能规范中未请求测试任务

**组织方式**: 任务按用户故事分组，支持独立实现和测试

## 格式: `[ID] [P?] [Story] 描述`

- **[P]**: 可并行执行（不同文件，无依赖）
- **[Story]**: 任务所属的用户故事（如 US1, US2, US3）
- 描述中包含确切的文件路径

---

## 阶段 1: 初始化（共享基础设施）

**目的**: 项目初始化和基础结构

- [x] T001 安装 mqtt.js 依赖到 package.json
- [x] T002 [P] 创建 MQTT 目录结构 src/pages/MQTT/
- [x] T003 [P] 创建 constants.ts 枚举和配置文件 src/pages/MQTT/constants.ts

---

## 阶段 2: 基础设施（阻塞性前置条件）

**目的**: 所有用户故事必须完成的核心基础设施

**⚠️ 关键**: 用户故事实现必须等待此阶段完成

- [x] T004 创建 ConnectionStatus 枚举 src/pages/MQTT/constants.ts
- [x] T005 [P] 创建 QoS 枚举 src/pages/MQTT/constants.ts
- [x] T006 [P] 创建 Protocol 枚举 src/pages/MQTT/constants.ts
- [x] T007 [P] 创建 Direction 枚举 src/pages/MQTT/constants.ts
- [x] T008 [P] 创建 MQTTBroker 类型定义 src/pages/MQTT/constants.ts
- [x] T009 [P] 创建 MQTTTopic 类型定义 src/pages/MQTT/constants.ts
- [x] T010 [P] 创建 MQTTMessage 类型定义 src/pages/MQTT/constants.ts
- [x] T011 创建 useMQTT Hook 骨架 src/pages/MQTT/hooks/useMQTT.ts
- [x] T012 实现连接状态管理 src/pages/MQTT/hooks/useMQTT.ts
- [x] T013 实现错误处理机制 src/pages/MQTT/hooks/useMQTT.ts

**检查点**: 基础设施就绪 - 可以开始用户故事实现

---

## 阶段 3: 用户故事 1 - 连接 MQTT Broker (优先级: P1) 🎯 MVP

**目标**: 用户可以配置并连接到 MQTT Broker

**独立测试**: 输入 Broker 地址、点击连接、验证连接状态

### 用户故事 1 实现

- [x] T014 [P] [US1] 创建 BrokerCard 组件 src/pages/MQTT/components/BrokerCard.tsx
- [x] T015 [US1] 实现 MQTT 连接逻辑 src/pages/MQTT/hooks/useMQTT.ts
- [x] T016 [US1] 实现连接参数配置 src/pages/MQTT/hooks/useMQTT.ts
- [x] T017 [US1] 实现连接状态监听 src/pages/MQTT/hooks/useMQTT.ts
- [x] T018 [US1] 创建 MQTT 主页面 src/pages/MQTT/index.tsx
- [x] T019 [US1] 添加 Broker 配置表单 src/pages/MQTT/index.tsx
- [x] T020 [US1] 实现连接状态显示 src/pages/MQTT/index.tsx
- [x] T021 [US1] 实现连接错误处理 src/pages/MQTT/hooks/useMQTT.ts
- [x] T022 [US1] 实现断开连接功能 src/pages/MQTT/hooks/useMQTT.ts

**检查点**: 用户故事 1 完成 - Broker 连接功能正常

---

## 阶段 4: 用户故事 2 - 订阅主题 (优先级: P2)

**目标**: 用户可以订阅 MQTT 主题并管理订阅

**独立测试**: 输入主题名、点击订阅、验证主题出现在列表中

### 用户故事 2 实现

- [x] T023 [P] [US2] 创建 TopicCard 组件 src/pages/MQTT/components/TopicCard.tsx
- [x] T024 [US2] 实现主题订阅逻辑 src/pages/MQTT/hooks/useMQTT.ts
- [x] T025 [US2] 实现取消订阅逻辑 src/pages/MQTT/hooks/useMQTT.ts
- [x] T026 [US2] 实现订阅状态管理 src/pages/MQTT/hooks/useMQTT.ts
- [x] T027 [US2] 创建主题列表页面 src/pages/MQTT/TopicList.tsx
- [x] T028 [US2] 添加主题订阅表单 src/pages/MQTT/TopicList.tsx
- [x] T029 [US2] 实现主题列表显示 src/pages/MQTT/TopicList.tsx
- [x] T030 [US2] 实现订阅错误处理 src/pages/MQTT/hooks/useMQTT.ts

**检查点**: 用户故事 2 完成 - 主题订阅功能正常

---

## 阶段 5: 用户故事 3 - 接收消息 (优先级: P3)

**目标**: 用户可以实时查看收到的 MQTT 消息

**独立测试**: 发送测试消息、验证消息实时显示

### 用户故事 3 实现

- [x] T031 [P] [US3] 创建 MessageCard 组件 src/pages/MQTT/components/MessageCard.tsx
- [x] T032 [US3] 实现消息接收逻辑 src/pages/MQTT/hooks/useMQTT.ts
- [x] T033 [US3] 实现消息解析功能 src/pages/MQTT/hooks/useMQTT.ts
- [x] T034 [US3] 实现消息存储管理 src/pages/MQTT/hooks/useMQTT.ts
- [x] T035 [US3] 创建消息列表页面 src/pages/MQTT/MessageList.tsx
- [x] T036 [US3] 实现消息列表显示 src/pages/MQTT/MessageList.tsx
- [x] T037 [US3] 实现消息时间戳显示 src/pages/MQTT/MessageList.tsx
- [x] T038 [US3] 实现消息筛选功能 src/pages/MQTT/MessageList.tsx

**检查点**: 用户故事 3 完成 - 消息接收功能正常

---

## 阶段 6: 用户故事 4 - 发送消息 (优先级: P4)

**目标**: 用户可以向指定主题发送 MQTT 消息

**独立测试**: 输入主题和消息、点击发送、验证消息发出

### 用户故事 4 实现

- [x] T039 [US4] 实现消息发送逻辑 src/pages/MQTT/hooks/useMQTT.ts
- [x] T040 [US4] 实现 QoS 等级选择 src/pages/MQTT/hooks/useMQTT.ts
- [x] T041 [US4] 实现 Retain 标志设置 src/pages/MQTT/hooks/useMQTT.ts
- [x] T042 [US4] 添加发送消息表单 src/pages/MQTT/index.tsx
- [x] T043 [US4] 实现发送状态显示 src/pages/MQTT/index.tsx
- [x] T044 [US4] 实现发送错误处理 src/pages/MQTT/hooks/useMQTT.ts
- [x] T045 [US4] 实现消息历史记录 src/pages/MQTT/hooks/useMQTT.ts

**检查点**: 用户故事 4 完成 - 消息发送功能正常

---

## 阶段 7: 用户故事 5 - 管理连接配置 (优先级: P5)

**目标**: 用户可以保存和管理多个 Broker 配置

**独立测试**: 保存配置、加载配置、验证连接参数

### 用户故事 5 实现

- [x] T046 [US5] 实现配置保存逻辑 src/pages/MQTT/hooks/useMQTT.ts
- [x] T047 [US5] 实现配置加载逻辑 src/pages/MQTT/hooks/useMQTT.ts
- [x] T048 [US5] 实现配置删除逻辑 src/pages/MQTT/hooks/useMQTT.ts
- [x] T049 [US5] 实现配置切换功能 src/pages/MQTT/hooks/useMQTT.ts
- [x] T050 [US5] 添加配置管理界面 src/pages/MQTT/index.tsx
- [x] T051 [US5] 实现自动连接功能 src/pages/MQTT/hooks/useMQTT.ts
- [x] T052 [US5] 实现配置导入导出 src/pages/MQTT/hooks/useMQTT.ts

**检查点**: 用户故事 5 完成 - 配置管理功能正常

---

## 阶段 8: 优化和完善

**目的**: 影响多个用户故事的改进

- [x] T053 [P] 实现自动重连机制 src/pages/MQTT/hooks/useMQTT.ts
- [x] T054 [P] 实现网络状态监听 src/pages/MQTT/hooks/useMQTT.ts
- [x] T055 实现消息去重功能 src/pages/MQTT/hooks/useMQTT.ts
- [x] T056 实现消息排序功能 src/pages/MQTT/MessageList.tsx
- [x] T057 实现消息清理功能 src/pages/MQTT/MessageList.tsx
- [x] T058 添加全面的错误提示信息 src/pages/MQTT/constants.ts
- [ ] T059 运行 quickstart.md 验证场景
- [ ] T060 更新文档 specs/002-mqtt-p2p/

---

## 依赖关系和执行顺序

### 阶段依赖

- **初始化 (阶段 1)**: 无依赖 - 可立即开始
- **基础设施 (阶段 2)**: 依赖初始化完成 - 阻塞所有用户故事
- **用户故事 (阶段 3-7)**: 全部依赖基础设施阶段完成
  - 用户故事可并行执行（如有团队）
  - 或按优先级顺序执行 (P1 → P2 → P3 → P4 → P5)
- **优化 (阶段 8)**: 依赖所有用户故事完成

### 用户故事依赖

- **用户故事 1 (P1)**: 基础设施完成后即可开始 - 无其他故事依赖
- **用户故事 2 (P2)**: US1 完成后开始 - 需要 Broker 连接
- **用户故事 3 (P3)**: US2 完成后开始 - 需要主题订阅
- **用户故事 4 (P4)**: US1 完成后开始 - 需要 Broker 连接
- **用户故事 5 (P5)**: US1 完成后开始 - 需要 Broker 连接

### 用户故事内部顺序

- 类型/模型先于组件
- 组件先于集成
- 核心实现先于优化
- 故事完成后再进入下一个优先级

### 并行机会

- 所有标记 [P] 的初始化任务可并行执行
- 所有标记 [P] 的基础设施任务可并行执行（阶段 2 内）
- 基础设施完成后，US1 和 US4 可并行开始
- US2 完成后，US3 可开始
- US1 完成后，US5 可开始
- 故事内标记 [P] 的任务可并行执行

---

## 并行示例: 用户故事 1

```bash
# 并行启动用户故事 1 的所有并行任务:
任务: "创建 BrokerCard 组件 src/pages/MQTT/components/BrokerCard.tsx"

# 然后顺序执行:
任务: "实现 MQTT 连接逻辑 src/pages/MQTT/hooks/useMQTT.ts"
任务: "实现连接参数配置 src/pages/MQTT/hooks/useMQTT.ts"
任务: "实现连接状态监听 src/pages/MQTT/hooks/useMQTT.ts"
任务: "创建 MQTT 主页面 src/pages/MQTT/index.tsx"
```

---

## 实现策略

### MVP 优先（仅用户故事 1）

1. 完成阶段 1: 初始化
2. 完成阶段 2: 基础设施（关键 - 阻塞所有故事）
3. 完成阶段 3: 用户故事 1
4. **停止并验证**: 独立测试 Broker 连接
5. 准备部署/演示

### 增量交付

1. 完成初始化 + 基础设施 → 基础就绪
2. 添加用户故事 1 → 测试连接 → 部署/演示 (MVP!)
3. 添加用户故事 2 → 测试订阅 → 部署/演示
4. 添加用户故事 3 → 测试接收 → 部署/演示
5. 添加用户故事 4 → 测试发送 → 部署/演示
6. 添加用户故事 5 → 测试配置 → 部署/演示
7. 优化和完善 → 最终发布

### 并行团队策略

多人开发时:

1. 团队共同完成初始化 + 基础设施
2. 基础设施完成后:
   - 开发者 A: 用户故事 1（连接）
   - 开发者 B: 用户故事 4（发送）
3. US1 完成后:
   - 开发者 A: 用户故事 2（订阅）
   - 开发者 B: 用户故事 5（配置）
4. US2 完成后:
   - 开发者 A: 用户故事 3（接收）
5. 故事独立完成并集成

---

## 任务统计

**总任务数**: 60

**各用户故事任务数**:
- 初始化: 3 个任务
- 基础设施: 10 个任务
- US1 (连接): 9 个任务
- US2 (订阅): 8 个任务
- US3 (接收): 8 个任务
- US4 (发送): 7 个任务
- US5 (配置): 7 个任务
- 优化: 8 个任务

**并行任务**: 15 个任务标记 [P]

**MVP 范围**: 阶段 1 + 阶段 2 + 阶段 3 (US1) = 22 个任务

---

## 注意事项

- [P] 任务 = 不同文件，无依赖
- [Story] 标签将任务映射到特定用户故事以便追踪
- 每个用户故事应可独立完成和测试
- 完成每个任务或逻辑分组后提交
- 在任何检查点停止以独立验证故事
- 遵循 CONSTITUTION.md 原则进行所有实现
- 使用 constants.ts 存储所有业务变量
- 使用枚举定义所有状态
- 清理所有定时器和订阅
