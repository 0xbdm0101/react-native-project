# 大苹果 IoT - 项目 Constitution

## 项目愿景
构建一个稳定、高效、易维护的蓝牙物联网设备管理应用，为用户提供流畅的设备连接和数据监控体验。

---

## 核心原则

### 1. 代码质量原则

#### 1.1 禁止硬编码
- **所有**业务变量必须提取到外部配置文件
- **所有**魔法数字、字符串、颜色必须定义为常量
- **所有**配置项必须使用映射表管理

```typescript
// ❌ 错误
if (status === "connected") { ... }
const color = "#4FC3F7";
setTimeout(() => { ... }, 3000);

// ✅ 正确
import { ConnectionStatus, COLORS, TIMEOUT } from './constants';
if (status === ConnectionStatus.CONNECTED) { ... }
const color = COLORS.PRIMARY;
setTimeout(() => { ... }, TIMEOUT.DEFAULT);
```

#### 1.2 枚举类型
- **所有**状态必须使用枚举类型
- **所有**类型定义必须使用枚举
- **禁止**使用字符串字面量作为类型

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

#### 1.3 映射表
- **所有**配置项必须使用映射表
- **所有**查找逻辑必须使用映射表
- **禁止**使用 if-else 链进行查找

```typescript
// ❌ 错误
const getName = (id: string) => {
  if (id === '1') return '设备A';
  if (id === '2') return '设备B';
  return '未知';
};

// ✅ 正确
export const DEVICE_NAMES: Record<string, string> = {
  '1': '设备A',
  '2': '设备B',
};
export const getName = (id: string): string => {
  return DEVICE_NAMES[id] || '未知';
};
```

---

### 2. 类型安全原则

#### 2.1 TypeScript 严格模式
- 启用 TypeScript 严格模式
- **所有**变量必须有明确的类型注解
- **所有**函数必须有返回类型注解
- **所有** Props 必须定义接口

```typescript
// ❌ 错误
const data = fetchData();
const process = (item) => { ... };

// ✅ 正确
const data: DeviceInfo[] = fetchData();
const process = (item: DeviceInfo): void => { ... };
```

#### 2.2 接口定义
- **所有**组件 Props 必须定义接口
- **所有**复杂数据结构必须定义接口
- **所有** API 响应必须定义接口

```typescript
// ❌ 错误
export function DeviceCard({ device, onPress }) { ... }

// ✅ 正确
interface DeviceCardProps {
  device: Device;
  onPress?: (device: Device) => void;
}
export function DeviceCard({ device, onPress }: DeviceCardProps) { ... }
```

---

### 3. 错误处理原则

#### 3.1 统一错误处理
- **所有**异步操作必须有错误处理
- **所有**错误必须有用户友好的提示
- **所有**错误必须记录日志

```typescript
// ❌ 错误
try {
  await connect();
} catch (err) {
  console.log(err);
}

// ✅ 正确
try {
  await connect();
} catch (err: any) {
  if (!err.message.includes("cancelled")) {
    console.error("连接失败:", err);
    setError(`连接失败: ${err.message}`);
  }
}
```

#### 3.2 错误文案
- **所有**错误文案必须提取到常量文件
- **所有**错误文案必须用户友好
- **所有**错误文案必须包含上下文信息

```typescript
export const ERROR_MESSAGES = {
  CONNECTION_FAILED: (name: string) => `连接 ${name} 失败`,
  TIMEOUT: '操作超时，请重试',
  PERMISSION_DENIED: '权限被拒绝，请在设置中开启',
} as const;
```

---

### 4. 性能优化原则

#### 4.1 资源清理
- **所有**定时器必须清理
- **所有**订阅必须取消
- **所有**事件监听必须移除
- **禁止**内存泄漏

```typescript
// ❌ 错误
useEffect(() => {
  setInterval(() => { ... }, 1000);
  device.onDisconnected(() => { ... });
}, []);

// ✅ 正确
useEffect(() => {
  const interval = setInterval(() => { ... }, 1000);
  const subscription = device.onDisconnected(() => { ... });
  
  return () => {
    clearInterval(interval);
    subscription.remove();
  };
}, []);
```

#### 4.2 更新频率
- **所有**定时更新必须有合理的频率
- **所有**实时数据必须有更新间隔配置
- **禁止**过于频繁的更新

```typescript
export const UPDATE_INTERVALS = {
  RSSI: 10000,      // 10 秒
  SENSOR_DATA: 5000, // 5 秒
  UI_REFRESH: 1000,  // 1 秒
} as const;
```

---

### 5. 文件组织原则

#### 5.1 目录结构
每个业务模块必须有独立目录，包含：
```
feature/
├── index.tsx              # 主组件
├── constants.ts           # 常量、枚举、映射
├── types.ts               # 类型定义（可选）
├── utils.ts               # 工具函数（可选）
├── hooks/
│   └── useFeature.ts      # 业务逻辑
└── components/
    └── SubComponent.tsx   # 子组件
```

#### 5.2 导入顺序
```typescript
// 1. React 和第三方库
import React, { useState } from 'react';
import { View, Text } from 'react-native';

// 2. 项目公共组件
import { Button } from '@/components';

// 3. 业务常量和类型
import { STATUS, CONFIG } from './constants';
import { SomeType } from './types';

// 4. 业务组件
import { SubComponent } from './components';
```

#### 5.3 常量文件结构
```typescript
// 1. 枚举类型
export enum SomeStatus { ... }

// 2. 配置常量
export const CONFIG = { ... };

// 3. 映射表
export const MAPPING: Record<string, string> = { ... };

// 4. 工具函数
export const getSomething = (key: string) => { ... };
```

---

### 6. 蓝牙/IoT 专项原则

#### 6.1 蓝牙状态管理
- **必须**监听蓝牙状态变化
- **必须**处理蓝牙权限问题
- **必须**提供用户友好的状态提示

```typescript
export enum BluetoothState {
  UNKNOWN = "Unknown",
  POWERED_OFF = "PoweredOff",
  POWERED_ON = "PoweredOn",
  UNAUTHORIZED = "Unauthorized",
  // ...
}

export const getBluetoothStateText = (state: BluetoothState): string => {
  const texts: Record<BluetoothState, string> = {
    [BluetoothState.POWERED_OFF]: "蓝牙已关闭",
    [BluetoothState.UNAUTHORIZED]: "请授权蓝牙权限",
    // ...
  };
  return texts[state] || "蓝牙不可用";
};
```

#### 6.2 连接生命周期
- **必须**处理连接中、已连接、断开中、已断开状态
- **必须**监听设备断开事件
- **必须**清理连接资源

```typescript
export enum ConnectionStatus {
  IDLE = "idle",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTING = "disconnecting",
}
```

#### 6.3 数据解析
- **所有**BLE 数据解析必须统一管理
- **所有**UUID 映射必须统一管理
- **所有**设备类型必须统一管理

```typescript
// ble-protocols.ts
export const BLE_SERVICES: Record<string, string> = { ... };
export const BLE_CHARACTERISTICS: Record<string, string> = { ... };
export const DEVICE_TYPES: Record<string, DeviceType> = { ... };
```

---

## 质量标准

### 代码质量
- TypeScript 严格模式：✅ 必须
- ESLint 无警告：✅ 必须
- 测试覆盖率：> 80%（目标）

### 性能标准
- 启动时间：< 2 秒
- 动画流畅度：60fps
- 内存使用：合理，无泄漏

### 用户体验
- 响应时间：< 100ms
- 动画流畅：✅ 必须
- 状态反馈清晰：✅ 必须
- 错误提示友好：✅ 必须

---

## 开发流程

### 1. 需求分析
- 明确功能需求
- 确定技术方案
- 评估工作量

### 2. 设计阶段
- 设计数据结构
- 设计组件接口
- 设计文件结构

### 3. 实现阶段
- 遵循编码规范
- 及时测试验证
- 及时重构优化

### 4. 测试阶段
- 单元测试
- 集成测试
- 用户测试

### 5. 发布阶段
- 代码审查
- 性能测试
- 发布上线

---

## 工具和框架

### 核心框架
- React Native: 移动端框架
- Expo: 开发工具链
- TypeScript: 类型系统

### UI 框架
- Tamagui: 跨平台 UI
- React Native StyleSheet: 样式管理

### 状态管理
- Valtio: 响应式状态
- SWR: 数据请求

### 路由
- Expo Router: 文件路由

### 蓝牙
- react-native-ble-plx: BLE 通信

---

## 持续改进

### 定期审查
- 每周代码审查
- 每月性能优化
- 每季度架构评估

### 学习成长
- 关注新技术
- 分享最佳实践
- 持续重构优化

### 反馈循环
- 收集用户反馈
- 分析性能数据
- 持续迭代改进

---

## 附录：快速检查清单

### 代码输出前检查
- [ ] 是否有硬编码的字符串/数字？
- [ ] 是否有魔法值？
- [ ] 状态是否用枚举？
- [ ] 配置是否用映射表？
- [ ] 是否有 if-else 链？（应改为映射）
- [ ] 是否有重复代码？（应提取函数）
- [ ] 定时器/订阅是否清理？
- [ ] 错误是否处理？
- [ ] 类型是否明确？
- [ ] 命名是否规范？

### 文件组织检查
- [ ] 是否有独立的 constants.ts？
- [ ] 是否有独立的 types.ts？
- [ ] 导入顺序是否正确？
- [ ] 文件命名是否规范？

### 蓝牙功能检查
- [ ] 是否监听蓝牙状态？
- [ ] 是否处理权限问题？
- [ ] 是否监听连接断开？
- [ ] 是否清理连接资源？
- [ ] 是否有合理的更新频率？

---

**版本**: 1.0.0
**最后更新**: 2026-06-22
**维护者**: 开发团队
