# 任务列表: BLE设备实时监控管理

**输入**: 设计文档来自 `/specs/001-ble-device-monitoring/`

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

- [ ] T001 验证 package.json 中已安装 react-native-ble-plx 依赖
- [ ] T002 [P] 创建 BLE 目录结构 src/pages/BLE/
- [ ] T003 [P] 创建 constants.ts 枚举和配置文件 src/pages/BLE/constants.ts

---

## 阶段 2: 基础设施（阻塞性前置条件）

**目的**: 所有用户故事必须完成的核心基础设施

**⚠️ 关键**: 用户故事实现必须等待此阶段完成

- [ ] T004 创建 BluetoothState 枚举 src/pages/BLE/constants.ts
- [ ] T005 [P] 创建 ScanStatus 枚举 src/pages/BLE/constants.ts
- [ ] T006 [P] 创建 ConnectionStatus 枚举 src/pages/BLE/constants.ts
- [ ] T007 [P] 创建 SignalStrength 工具函数 src/pages/BLE/constants.ts
- [ ] T008 [P] 创建 BLE 服务 UUID 映射 src/pages/BLE/ble-protocols.ts
- [ ] T009 [P] 创建 BLE 特征值 UUID 映射 src/pages/BLE/ble-protocols.ts
- [ ] T010 [P] 创建设备类型映射 src/pages/BLE/ble-protocols.ts
- [ ] T011 创建 useBLE Hook 骨架 src/pages/BLE/hooks/useBLE.ts
- [ ] T012 实现蓝牙状态监听 src/pages/BLE/hooks/useBLE.ts
- [ ] T013 实现扫描超时配置 src/pages/BLE/constants.ts

**检查点**: 基础设施就绪 - 可以开始用户故事实现

---

## 阶段 3: 用户故事 1 - 扫描并发现BLE设备 (优先级: P1) 🎯 MVP

**目标**: 用户可以扫描附近的BLE设备并查看设备列表

**独立测试**: 启动扫描、等待设备出现、验证设备信息显示

### 用户故事 1 实现

- [ ] T014 [P] [US1] 创建 BLEDevice 类型定义 src/pages/BLE/constants.ts
- [ ] T015 [P] [US1] 创建 ScanButton 组件 src/pages/BLE/components/ScanButton.tsx
- [ ] T016 [US1] 实现设备扫描逻辑 src/pages/BLE/hooks/useBLE.ts
- [ ] T017 [US1] 实现扫描超时处理 src/pages/BLE/hooks/useBLE.ts
- [ ] T018 [US1] 创建 BLEDeviceCard 组件 src/pages/BLE/components/BLEDeviceCard.tsx
- [ ] T019 [US1] 实现设备列表显示 src/pages/BLE/index.tsx
- [ ] T020 [US1] 添加蓝牙状态横幅 src/pages/BLE/index.tsx
- [ ] T021 [US1] 添加扫描状态显示 src/pages/BLE/index.tsx
- [ ] T022 [US1] 实现按 RSSI 排序设备 src/pages/BLE/hooks/useBLE.ts
- [ ] T023 [US1] 添加设备类型检测 src/pages/BLE/ble-protocols.ts

**检查点**: 用户故事 1 完成 - 设备扫描和列表显示正常

---

## 阶段 4: 用户故事 2 - 连接到BLE设备 (优先级: P2)

**目标**: 用户可以选择设备进行连接并查看连接状态

**独立测试**: 选择设备、点击连接、验证连接状态变化

### 用户故事 2 实现

- [ ] T024 [P] [US2] 创建 ConnectionState 枚举 src/pages/BLE/constants.ts
- [ ] T025 [US2] 实现设备连接逻辑 src/pages/BLE/hooks/useBLE.ts
- [ ] T026 [US2] 实现连接状态管理 src/pages/BLE/hooks/useBLE.ts
- [ ] T027 [US2] 添加断开事件监听 src/pages/BLE/hooks/useBLE.ts
- [ ] T028 [US2] 更新 BLEDeviceCard 连接状态 src/pages/BLE/components/BLEDeviceCard.tsx
- [ ] T029 [US2] 实现连接进度指示器 src/pages/BLE/components/BLEDeviceCard.tsx
- [ ] T030 [US2] 添加自动跳转详情页 src/pages/BLE/index.tsx
- [ ] T031 [US2] 实现连接错误处理 src/pages/BLE/hooks/useBLE.ts

**检查点**: 用户故事 2 完成 - 设备连接正常

---

## 阶段 5: 用户故事 3 - 查看设备实时数据 (优先级: P3)

**目标**: 用户可以查看设备的实时数据并订阅更新

**独立测试**: 连接设备、等待数据加载、验证数据更新

### 用户故事 3 实现

- [ ] T032 [P] [US3] 创建 SensorData 类型 src/pages/BLE/constants.ts
- [ ] T033 [P] [US3] 创建 DeviceDetail 组件 src/pages/BLE/DeviceDetail.tsx
- [ ] T034 [US3] 实现服务发现 src/pages/BLE/DeviceDetail.tsx
- [ ] T035 [US3] 实现特征值发现 src/pages/BLE/DeviceDetail.tsx
- [ ] T036 [US3] 实现可读特征值数据读取 src/pages/BLE/DeviceDetail.tsx
- [ ] T037 [US3] 实现温度数据解析器 src/pages/BLE/DeviceDetail.tsx
- [ ] T038 [US3] 实现湿度数据解析器 src/pages/BLE/DeviceDetail.tsx
- [ ] T039 [US3] 实现电池数据解析器 src/pages/BLE/DeviceDetail.tsx
- [ ] T040 [US3] 创建传感器数据展示卡片 src/pages/BLE/DeviceDetail.tsx
- [ ] T041 [US3] 实现数据订阅（每10秒） src/pages/BLE/DeviceDetail.tsx
- [ ] T042 [US3] 添加 RSSI 更新（每10秒） src/pages/BLE/DeviceDetail.tsx

**检查点**: 用户故事 3 完成 - 实时数据监控正常

---

## 阶段 6: 用户故事 4 - 管理设备连接 (优先级: P4)

**目标**: 用户可以断开连接并处理自动断开

**独立测试**: 点击断开、验证状态变化、测试自动断开

### 用户故事 4 实现

- [ ] T043 [US4] 实现手动断开连接 src/pages/BLE/hooks/useBLE.ts
- [ ] T044 [US4] 添加断开按钮 src/pages/BLE/DeviceDetail.tsx
- [ ] T045 [US4] 实现返回按钮行为（保持连接） src/pages/BLE/DeviceDetail.tsx
- [ ] T046 [US4] 实现自动断开检测 src/pages/BLE/DeviceDetail.tsx
- [ ] T047 [US4] 添加断开后自动导航 src/pages/BLE/DeviceDetail.tsx
- [ ] T048 [US4] 实现断开时资源清理 src/pages/BLE/hooks/useBLE.ts
- [ ] T049 [US4] 添加断开错误处理（忽略"cancelled"） src/pages/BLE/hooks/useBLE.ts

**检查点**: 用户故事 4 完成 - 连接管理正常

---

## 阶段 7: 用户故事 5 - 查看设备详细信息 (优先级: P5)

**目标**: 用户可以查看设备的完整信息和服务列表

**独立测试**: 进入详情页、查看服务列表、验证信息完整性

### 用户故事 5 实现

- [ ] T050 [P] [US5] 创建服务列表显示 src/pages/BLE/DeviceDetail.tsx
- [ ] T051 [P] [US5] 创建特征值列表显示 src/pages/BLE/DeviceDetail.tsx
- [ ] T052 [US5] 实现服务名称映射 src/pages/BLE/ble-protocols.ts
- [ ] T053 [US5] 实现特征值名称映射 src/pages/BLE/ble-protocols.ts
- [ ] T054 [US5] 添加特征值属性显示 src/pages/BLE/DeviceDetail.tsx
- [ ] T055 [US5] 添加空状态处理 src/pages/BLE/DeviceDetail.tsx
- [ ] T056 [US5] 添加错误状态处理 src/pages/BLE/DeviceDetail.tsx
- [ ] T057 [US5] 添加加载状态显示 src/pages/BLE/DeviceDetail.tsx

**检查点**: 用户故事 5 完成 - 设备详情显示正常

---

## 阶段 8: 优化和完善

**目的**: 影响多个用户故事的改进

- [ ] T058 [P] 添加设备图标映射 src/pages/BLE/ble-protocols.ts
- [ ] T059 [P] 添加设备类别映射 src/pages/BLE/ble-protocols.ts
- [ ] T060 代码清理和重构所有 BLE 文件
- [ ] T061 扫描和连接性能优化
- [ ] T062 添加全面的错误提示信息 src/pages/BLE/constants.ts
- [ ] T063 运行 quickstart.md 验证场景
- [ ] T064 更新文档 specs/001-ble-device-monitoring/

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
- **用户故事 2 (P2)**: 基础设施完成后即可开始 - 与 US1 集成但可独立测试
- **用户故事 3 (P3)**: US2 完成后开始 - 需要设备连接
- **用户故事 4 (P4)**: US2 完成后开始 - 需要设备连接
- **用户故事 5 (P5)**: US2 完成后开始 - 需要设备连接

### 用户故事内部顺序

- 类型/模型先于组件
- 组件先于集成
- 核心实现先于优化
- 故事完成后再进入下一个优先级

### 并行机会

- 所有标记 [P] 的初始化任务可并行执行
- 所有标记 [P] 的基础设施任务可并行执行（阶段 2 内）
- 基础设施完成后，US1 和 US2 可并行开始
- US2 完成后，US3、US4、US5 可并行开始
- 故事内标记 [P] 的任务可并行执行

---

## 并行示例: 用户故事 1

```bash
# 并行启动用户故事 1 的所有并行任务:
任务: "创建 BLEDevice 类型定义 src/pages/BLE/constants.ts"
任务: "创建 ScanButton 组件 src/pages/BLE/components/ScanButton.tsx"

# 然后顺序执行:
任务: "实现设备扫描逻辑 src/pages/BLE/hooks/useBLE.ts"
任务: "实现扫描超时处理 src/pages/BLE/hooks/useBLE.ts"
任务: "创建 BLEDeviceCard 组件 src/pages/BLE/components/BLEDeviceCard.tsx"
任务: "实现设备列表显示 src/pages/BLE/index.tsx"
```

---

## 实现策略

### MVP 优先（仅用户故事 1）

1. 完成阶段 1: 初始化
2. 完成阶段 2: 基础设施（关键 - 阻塞所有故事）
3. 完成阶段 3: 用户故事 1
4. **停止并验证**: 独立测试设备扫描
5. 准备部署/演示

### 增量交付

1. 完成初始化 + 基础设施 → 基础就绪
2. 添加用户故事 1 → 测试扫描 → 部署/演示 (MVP!)
3. 添加用户故事 2 → 测试连接 → 部署/演示
4. 添加用户故事 3 → 测试数据监控 → 部署/演示
5. 添加用户故事 4 → 测试连接管理 → 部署/演示
6. 添加用户故事 5 → 测试设备详情 → 部署/演示
7. 优化和完善 → 最终发布

### 并行团队策略

多人开发时:

1. 团队共同完成初始化 + 基础设施
2. 基础设施完成后:
   - 开发者 A: 用户故事 1（扫描）
   - 开发者 B: 用户故事 2（连接）
3. US2 完成后:
   - 开发者 A: 用户故事 3（数据监控）
   - 开发者 B: 用户故事 4（连接管理）
   - 开发者 C: 用户故事 5（设备详情）
4. 故事独立完成并集成

---

## 任务统计

**总任务数**: 64

**各用户故事任务数**:
- 初始化: 3 个任务
- 基础设施: 10 个任务
- US1 (扫描): 10 个任务
- US2 (连接): 8 个任务
- US3 (数据监控): 11 个任务
- US4 (连接管理): 7 个任务
- US5 (设备详情): 8 个任务
- 优化: 7 个任务

**并行任务**: 20 个任务标记 [P]

**MVP 范围**: 阶段 1 + 阶段 2 + 阶段 3 (US1) = 23 个任务

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
