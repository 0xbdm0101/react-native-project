# Implementation Plan: 传感器监控 (Sensors Monitor)

**Branch**: `005-sensors-monitor` | **Date**: 2026-07-21 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-sensors-monitor/spec.md`

## Summary

在应用中新增「传感器监控」功能，用户可查看设备支持的 7 种传感器（加速度计/陀螺仪/磁力计/气压计/计步器/光线传感器/设备运动）的列表，点击进入详情页查看实时数据变化。支持三档采样频率调节（慢速/标准/快速），App 进入后台自动暂停、返回前台自动恢复，页面卸载释放传感器资源。使用已安装的 `expo-sensors` ~15.0.8，无需新增依赖。

## Technical Context

**Language/Version**: TypeScript 5.9

**Primary Dependencies**: expo-sensors ~15.0.8（传感器数据采集，已安装），expo-router ~6.0.24（路由），Tamagui（UI），Ionicons（图标），React Native AppState（生命周期）

**Storage**: 无持久化存储需求（实时数据仅保存在内存中）

**Testing**: 手动测试（真机验证传感器读取 + 模拟器验证可用性检测 + 前后台切换）

**Target Platform**: iOS + Android, Expo SDK 54, React Native 0.81.5

**Project Type**: Mobile app (React Native + Expo)

**Performance Goals**: 数据更新延迟 < 200ms，列表页加载 < 500ms，页面切换无卡顿

**Constraints**: 唯一新增依赖为 expo-sensors（已安装）；页面卸载必须释放传感器资源；支持离线条形码扫描；本地离线识别，无网络依赖

**Scale/Scope**: 2 个页面路由，7 种传感器，0 个辅助页面

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原则 | 状态 | 说明 |
|------|------|------|
| I. 代码质量 | ✅ PASS | 所有常量/枚举/映射提取到 constants.ts：传感器类型枚举、名称映射、图标映射、采样频率配置、UI 文案、颜色常量 |
| II. 类型安全 | ✅ PASS | SensorType、SensorAvailability、MonitorStatus 等状态用枚举，所有变量有类型注解 |
| III. 错误处理 | ✅ PASS | 统一错误处理：传感器不可用提示、权限拒绝引导、硬件异常提示，忽略 cancelled 错误 |
| IV. 性能优化 | ✅ PASS | useEffect cleanup 移除传感器监听、清理定时器、AppState 暂停/恢复机制 |
| V. 文件组织 | ✅ PASS | 遵循 feature/ 目录结构：constants.ts + types.ts + hooks/ + components/ |
| VI. 生命周期 | ✅ PASS | AppState 监听前后台切换，页面卸载时 remove 传感器 Subscription |

## Project Structure

### Documentation (this feature)

```text
specs/005-sensors-monitor/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
src/pages/Sensors/
├── index.tsx                     # 传感器列表页（主页面）
├── detail.tsx                    # 传感器详情页（实时数据）
├── constants.ts                  # 枚举、常量、UI 文案、映射表、颜色
├── types.ts                      # 类型定义
├── hooks/
│   ├── useSensorList.ts           # 传感器可用性检测 + 列表状态
│   └── useSensorData.ts           # 传感器数据采集 + 采样频率控制
└── components/
    ├── SensorCard.tsx             # 传感器列表卡片组件
    ├── TriaxialDisplay.tsx        # 三轴数据展示（加速度计/陀螺仪/磁力计）
    ├── ScalarDisplay.tsx          # 标量数据展示（气压计/光线传感器）
    ├── PedometerDisplay.tsx       # 计步器数据展示
    └── SampleRatePicker.tsx       # 采样频率选择器

app/
├── sensors.tsx                    # 路由 → src/pages/Sensors/index.tsx
└── sensor-detail.tsx             # 路由 → src/pages/Sensors/detail.tsx
```

**Structure Decision**: 遵循项目现有模式（与 Scan/BLE/Network 一致），`src/pages/Sensors/` 作为功能模块目录，`app/sensors.tsx` + `app/sensor-detail.tsx` 作为 Expo Router 路由入口。详情页采用单页面 + 传感器类型参数的模式，通过组件切换（TriaxialDisplay / ScalarDisplay / PedometerDisplay）适配不同传感器。

## Dependencies

### New
无（expo-sensors 已安装）

### Existing (reused)
| Package | Purpose |
|---------|---------|
| expo-sensors ~15.0.8 | 传感器数据采集（Accelerometer, Gyroscope, Magnetometer, Barometer, Pedometer, LightSensor, DeviceMotion） |
| expo-router ~6.0.24 | 路由导航 |
| Tamagui | UI 组件（Text、XStack、YStack 等） |
| @expo/vector-icons | Ionicons 传感器图标 |
| PageHeader | 复用现有公共顶部返回组件 |
| React Native AppState | 前后台生命周期管理 |

## Complexity Tracking

> 无违规项，无需填写。
