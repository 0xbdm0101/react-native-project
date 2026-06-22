<!--
Sync Impact Report
Version change: N/A → 1.0.0 (Initial creation)
Modified principles: N/A (new document)
Added sections:
  - Core Principles (6 principles)
  - Technology Stack
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ checked
  - .specify/templates/spec-template.md ✅ checked
  - .specify/templates/tasks-template.md ✅ checked
Follow-up TODOs: None
-->

# 大苹果 IoT Constitution

## Core Principles

### I. 代码质量原则

所有业务变量必须提取到外部配置文件，禁止硬编码。

**规则：**
- 魔法数字、字符串、颜色必须定义为常量
- 配置项必须使用映射表管理
- 禁止在代码中直接使用字面量

**示例：**
```typescript
// ❌ 错误
if (status === "connected") { ... }
const color = "#4FC3F7";

// ✅ 正确
import { ConnectionStatus, COLORS } from './constants';
if (status === ConnectionStatus.CONNECTED) { ... }
const color = COLORS.PRIMARY;
```

**理由：** 提高代码可维护性，减少修改成本，避免拼写错误。

### II. 类型安全原则

使用 TypeScript 枚举类型代替字符串字面量，确保类型安全。

**规则：**
- 所有状态必须使用枚举类型
- 所有类型定义必须使用枚举
- 启用 TypeScript 严格模式
- 所有变量必须有明确的类型注解

**示例：**
```typescript
// ❌ 错误
type Status = "idle" | "scanning" | "error";

// ✅ 正确
export enum ScanStatus {
  IDLE = "idle",
  SCANNING = "scanning",
  ERROR = "error",
}
```

**理由：** 编译时类型检查，IDE 智能提示，减少运行时错误。

### III. 错误处理原则

统一的错误处理机制，提供用户友好的错误提示。

**规则：**
- 所有异步操作必须有错误处理
- 忽略特定错误（如 "cancelled"）
- 错误文案必须提取到常量文件
- 所有错误必须记录日志

**示例：**
```typescript
// ❌ 错误
catch (err) {
  console.log(err);
}

// ✅ 正确
catch (err: any) {
  if (!err.message.includes("cancelled")) {
    console.error("操作失败:", err);
    setError(`操作失败: ${err.message}`);
  }
}
```

**理由：** 提供清晰的错误反馈，帮助用户解决问题，便于调试。

### IV. 性能优化原则

合理的资源管理，防止内存泄漏，优化更新频率。

**规则：**
- 所有定时器必须清理
- 所有订阅必须取消
- 所有事件监听必须移除
- 实时数据必须有合理的更新间隔

**示例：**
```typescript
// ❌ 错误
useEffect(() => {
  setInterval(() => { ... }, 1000);
}, []);

// ✅ 正确
useEffect(() => {
  const interval = setInterval(() => { ... }, 1000);
  return () => clearInterval(interval);
}, []);
```

**理由：** 防止内存泄漏，优化电池消耗，提供流畅的用户体验。

### V. 文件组织原则

统一的目录结构，清晰的文件职责，规范的导入导出。

**规则：**
- 每个业务模块必须有独立目录
- 必须包含 constants.ts、types.ts、hooks/、components/
- 导入顺序：React → 第三方库 → 项目组件 → 业务常量 → 业务组件

**目录结构：**
```
feature/
├── index.tsx              # 主组件
├── constants.ts           # 常量、枚举、映射
├── types.ts               # 类型定义
├── utils.ts               # 工具函数
├── hooks/
│   └── useFeature.ts      # 业务逻辑
└── components/
    └── SubComponent.tsx   # 子组件
```

**理由：** 提高代码可读性，便于团队协作，降低维护成本。

### VI. 蓝牙生命周期管理原则

完整的蓝牙状态管理和连接生命周期处理。

**规则：**
- 必须监听蓝牙状态变化
- 必须处理蓝牙权限问题
- 必须监听设备断开事件
- 必须清理连接资源
- 必须提供状态反馈

**状态管理：**
```typescript
export enum BluetoothState {
  POWERED_OFF = "PoweredOff",
  POWERED_ON = "PoweredOn",
  UNAUTHORIZED = "Unauthorized",
  // ...
}

export enum ConnectionStatus {
  IDLE = "idle",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTING = "disconnecting",
}
```

**理由：** 确保蓝牙连接的稳定性，提供良好的用户体验，处理各种边界情况。

## Technology Stack

**核心框架：**
- React Native: 移动端跨平台框架
- Expo: 开发工具链和构建服务
- TypeScript: 类型安全的 JavaScript 超集

**UI 框架：**
- Tamagui: 跨平台 UI 组件库
- React Native StyleSheet: 样式管理

**状态管理：**
- Valtio: 响应式状态管理
- SWR: 数据请求和缓存

**路由：**
- Expo Router: 基于文件的路由系统

**蓝牙通信：**
- react-native-ble-plx: BLE 低功耗蓝牙通信

**开发工具：**
- ESLint: 代码规范检查
- Prettier: 代码格式化
- TypeScript Compiler: 类型检查

## Development Workflow

**1. 需求分析阶段**
- 明确功能需求和技术方案
- 评估工作量和风险点
- 确定验收标准

**2. 设计阶段**
- 设计数据结构和接口
- 设计组件层次和职责
- 设计文件结构和命名

**3. 实现阶段**
- 遵循编码规范
- 及时测试验证
- 及时重构优化

**4. 测试阶段**
- 单元测试覆盖核心逻辑
- 集成测试覆盖关键流程
- 用户测试验证体验

**5. 发布阶段**
- 代码审查确保质量
- 性能测试确保流畅
- 发布上线监控稳定性

**代码审查要求：**
- 所有 PR 必须通过代码审查
- 审查者必须检查原则合规性
- 不合规代码必须修改后合并

**质量门禁：**
- TypeScript 编译无错误
- ESLint 检查无警告
- 核心功能测试通过
- 性能指标达标

## Governance

**宪法效力：**
本 Constitution 是项目开发的最高指导原则，所有开发实践必须符合本 Constitution 的规定。

**修订流程：**
- 任何原则的修改必须记录在案
- 修改必须经过团队讨论和批准
- 修改必须提供迁移方案
- 修改必须更新版本号

**版本管理：**
- MAJOR: 原则删除或重大变更
- MINOR: 新增原则或重要扩展
- PATCH: 措辞澄清或小的调整

**合规检查：**
- 所有 PR 必须检查原则合规性
- 定期审查代码是否符合原则
- 不合规代码必须及时修复

**指导文件：**
使用 `.claude/rules/coding-standards.md` 作为运行时开发指导。

**Version**: 1.0.0 | **Ratified**: 2026-06-22 | **Last Amended**: 2026-06-22
