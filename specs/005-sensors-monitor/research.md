# Research: 传感器监控 (Sensors Monitor)

**Date**: 2026-07-21

## 1. 传感器访问方案

**Decision**: 使用 `expo-sensors` ~15.0.8（已安装）的 `DeviceSensor` 基类 API 实现传感器数据采集。

**Rationale**:
- `expo-sensors` 已在项目中安装，无需额外依赖
- 所有传感器共用统一的 `addListener()` / `removeSubscription()` / `setUpdateInterval()` API
- Expo 官方维护，iOS/Android 双平台原生实现
- 本地离线工作，无网络依赖

**Alternatives considered**:
- `react-native-sensors`: 社区库，需要额外原生配置，API 不够统一
- 自研原生模块: 开发成本高，Expo 托管工作流不支持

## 2. 支持的传感器列表

**Decision**: 支持 7 种传感器，全部由 `expo-sensors` 原生支持。

| 传感器 | 类名 | 测量值 | 单位 | 平台 |
|--------|------|--------|------|------|
| 加速度计 | `Accelerometer` | x, y, z 三轴 | g-forces | iOS + Android |
| 陀螺仪 | `Gyroscope` | x, y, z 三轴 | rad/s | iOS + Android |
| 磁力计 | `Magnetometer` | x, y, z 三轴 | μT | iOS + Android |
| 气压计 | `Barometer` | pressure, relativeAltitude | hPa, m | iOS + Android |
| 计步器 | `Pedometer` | steps | 步数 | iOS + Android |
| 光线传感器 | `LightSensor` | illuminance | lux | Android only |
| 设备运动 | `DeviceMotion` | acceleration, rotation, orientation | 复合 | iOS + Android |

**Rationale**: `expo-sensors` 原生支持以上全部传感器，无需额外配置。

## 3. 采样频率方案

**Decision**: 使用 `setUpdateInterval(ms)` 设置采样间隔，预设三个档位。

| 档位 | 间隔 (ms) | 频率 (Hz) | 场景 |
|------|-----------|-----------|------|
| 慢速 | 1000 | 1 | 低功耗、长时间监测 |
| 标准 (默认) | 200 | 5 | 日常查看 |
| 快速 | 50 | 20 | 高精度、手势识别 |

**Rationale**:
- `setUpdateInterval()` 是 `DeviceSensor` 基类的标准方法
- 三档预设覆盖典型使用场景，简化交互
- 快速模式约 20Hz 刷新率，已满足手柄/手势识别需求
- 50ms 以下需要 Android `HIGH_SAMPLING_RATE_SENSORS` 权限，暂不涉及

**Note on Android**: 200ms 以下间隔需要在 `app.json` 中声明 `android.permissions: ["HIGH_SAMPLING_RATE_SENSORS"]`，但非强制。

## 4. 传感器可用性检测

**Decision**: 使用每个传感器类的 `isAvailableAsync()` 方法在列表页逐项检测。

**Rationale**:
- `Accelerometer.isAvailableAsync()` 等 API 返回 `Promise<boolean>`
- 光线传感器在 iOS 上返回 `false`，可据此标注"该设备不支持"
- 计步器在 iOS 上需要 `CMPedometer` 权限，`isAvailableAsync()` 和 `getPermissionsAsync()` 配合使用

## 5. App 生命周期管理

**Decision**: 使用 React Native `AppState` API 监听前后台切换，自动暂停/恢复传感器。

**Rationale**:
- 与现存扫码页面 (`src/pages/Scan/index.tsx`) 保持一致的生命周期管理模式
- `AppState.addEventListener("change", handler)` → 返回 `subscription.remove()`
- `"active"` → 恢复传感器监听；`"background"` / `"inactive"` → 移除传感器监听

## 6. 权限处理

**Decision**: 分传感器类型处理权限。

| 传感器 | 权限需求 | 处理方式 |
|--------|---------|---------|
| 加速度计/陀螺仪/磁力计/气压计 | 无特殊权限 | 直接使用 |
| 光线传感器 | 无特殊权限 | 直接使用（仅 Android） |
| 计步器 | iOS: `CMPedometer` | `requestPermissionsAsync()` |
| 设备运动 | `DeviceMotion` permissions on web | App 内无需 |

**Rationale**: 大部分传感器无需权限，计步器在 iOS 上需要运动与健身权限，使用 `Pedometer.requestPermissionsAsync()` 处理，权限拒绝时显示引导。

## 7. 实时数据展示策略

**Decision**: 数值直接显示 + 简单波形图。

**Rationale**:
- 三轴传感器：每轴一个数值标签 + 三色折线图（X 红 / Y 绿 / Z 蓝）
- 标量传感器：大号数值显示 + 迷你趋势线
- 计步器：累计步数 + 时间段统计
- 使用 React Native 原生 `View` 绘制波形（轻量，无需引入图表库）
- 不需要持久化数据，仅保留当前页面可见的最近 N 个数据点（如 100 个）

## 8. 路由设计

**Decision**: 两个 Expo Router 页面路由。

| 路由 | 页面 | 参数 |
|------|------|------|
| `/sensors` | 传感器列表 | 无 |
| `/sensor-detail` | 传感器详情 | `type`: 传感器类型标识 |

**Rationale**: 与 BLE 模块 (`/ble-search` + `/ble-device-detail`) 的双路由模式一致，符合项目惯例。
