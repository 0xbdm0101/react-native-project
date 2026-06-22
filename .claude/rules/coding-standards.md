# 项目编码规范

## 核心原则
所有业务变量必须提取到外部配置文件，禁止硬编码。

---

## 1. 常量提取规则

### 禁止硬编码
```typescript
// ❌ 错误
if (status === "connected") { ... }
setTimeout(() => { ... }, 3000);
const color = "#4FC3F7";

// ✅ 正确
import { ConnectionStatus, TIMEOUT, COLORS } from './constants';
if (status === ConnectionStatus.CONNECTED) { ... }
setTimeout(() => { ... }, TIMEOUT.DEFAULT);
const color = COLORS.PRIMARY;
```

### 常量文件结构
每个业务模块必须有 `constants.ts`，包含：
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

## 2. 枚举类型规则

### 所有状态必须用枚举
```typescript
// ❌ 错误
type Status = "idle" | "scanning" | "error";
const [status, setStatus] = useState("idle");

// ✅ 正确
export enum ScanStatus {
  IDLE = "idle",
  SCANNING = "scanning",
  ERROR = "error",
}
const [status, setStatus] = useState<ScanStatus>(ScanStatus.IDLE);
```

### 枚举命名规范
- 枚举名：大驼峰 `ScanStatus`
- 枚举值：大写下划线 `SCANNING = "scanning"`
- 文件位置：`constants.ts` 或 `types.ts`

---

## 3. 映射表规则

### 所有配置项用映射表
```typescript
// ❌ 错误
const getServiceName = (uuid: string) => {
  if (uuid === '180F') return '电池服务';
  if (uuid === '181A') return '环境传感';
  return '未知';
};

// ✅ 正确
export const SERVICE_NAMES: Record<string, string> = {
  '180F': '电池服务',
  '181A': '环境传感服务',
};

export const getServiceName = (uuid: string): string => {
  return SERVICE_NAMES[uuid] || `未知 (${uuid})`;
};
```

### 映射表命名规范
- 常量名：大写下划线 `SERVICE_NAMES`
- 类型：`Record<string, string>` 或 `Record<string, SomeType>`
- 工具函数：小驼峰 `getServiceName`

---

## 4. UI 展示规则

### 文案必须提取
```typescript
// ❌ 错误
<Text>扫描中...</Text>
<Text>连接失败</Text>

// ✅ 正确
import { UI_TEXTS } from './constants';
<Text>{UI_TEXTS.SCANNING}</Text>
<Text>{UI_TEXTS.CONNECTION_FAILED}</Text>
```

### UI 文案文件结构
```typescript
// constants/ui.ts
export const UI_TEXTS = {
  // 状态文案
  SCANNING: '扫描中...',
  CONNECTING: '连接中...',
  CONNECTED: '已连接',
  
  // 错误文案
  CONNECTION_FAILED: '连接失败',
  SCAN_FAILED: '扫描失败',
  
  // 按钮文案
  SCAN: '开始扫描',
  CONNECT: '连接',
  DISCONNECT: '断开',
} as const;
```

### 样式常量提取
```typescript
// ❌ 错误
<View style={{ backgroundColor: '#1c1c1e', borderRadius: 14 }}>

// ✅ 正确
import { STYLE_CONFIG } from './constants';
<View style={STYLE_CONFIG.CARD}>
```

---

## 5. 文件组织规则

### 目录结构
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

### 导入顺序
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

---

## 6. 错误处理规则

### 忽略特定错误
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

### 错误文案提取
```typescript
export const ERROR_MESSAGES = {
  CONNECTION_FAILED: (name: string) => `连接 ${name} 失败`,
  TIMEOUT: '操作超时',
  PERMISSION_DENIED: '权限被拒绝',
} as const;
```

---

## 7. 定时器和订阅规则

### 必须清理
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

---

## 8. 日志规范

### 日志格式
```typescript
// ❌ 错误
console.log('connected');
console.log(err);

// ✅ 正确
console.log('✅ 已连接:', device.name);
console.log('📋 发现服务:', count, '个');
console.error('❌ 连接失败:', err.message);
```

---

## 9. 命名规范

### 文件命名
- 组件：大驼峰 `BLEDeviceCard.tsx`
- 工具：小驼峰 `bleUtils.ts`
- 常量：小驼峰 `constants.ts`
- 类型：小驼峰 `types.ts`

### 变量命名
- 常量：大写下划线 `SCAN_TIMEOUT`
- 枚举：大驼峰 `ScanStatus`
- 函数：小驼峰 `getServiceName`
- 组件：大驼峰 `DeviceCard`
- 布尔值：`is`/`has` 前缀 `isLoading`, `hasError`

---

## 10. 代码输出规则

### AI 输出时必须：
1. **先提取常量** - 在文件开头定义
2. **使用枚举** - 不用字符串字面量
3. **使用映射表** - 配置项提取到映射
4. **引用工具函数** - 复杂逻辑提取到 utils
5. **添加类型注解** - 明确类型定义

### 输出顺序
```typescript
// 1. 导入
import { ... } from '...';

// 2. 常量定义
const CONSTANT = 'value';

// 3. 类型定义
interface Props { ... }

// 4. 组件实现
export function Component() { ... }
```

---

## 快速检查清单

输出代码前检查：
- [ ] 是否有硬编码的字符串/数字？
- [ ] 是否有魔法值？
- [ ] 状态是否用枚举？
- [ ] 配置是否用映射表？
- [ ] 是否有 if-else 链？（应改为映射）
- [ ] 是否有重复代码？（应提取函数）
- [ ] 定时器/订阅是否清理？
- [ ] 错误是否处理？
