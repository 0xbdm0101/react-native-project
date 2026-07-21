# Data Model: 传感器监控 (Sensors Monitor)

**Date**: 2026-07-21

## Entity Definitions

### 1. SensorInfo（传感器信息）

传感器列表中的单个传感器项。

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `SensorType` | ✅ | 传感器类型标识 |
| `name` | `string` | ✅ | 传感器中文名称 |
| `icon` | `string` | ✅ | Ionicons 图标名称 |
| `availability` | `SensorAvailability` | ✅ | 可用性状态 |
| `isMonitoring` | `boolean` | ✅ | 是否有活跃的数据采集 |
| `unavailableReason` | `string` | ❌ | 不可用原因文案（仅 unavailable 时） |

**Validation**:
- `type` 必须为 `SensorType` 枚举值
- `unavailableReason` 在 `availability` 为 `UNAVAILABLE` 时必填

**States**: 无状态流转，仅在列表页展示当前设备能力快照。

---

### 2. SensorDataPoint（传感器数据点）

传感器的一次采样数据。

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `timestamp` | `number` | ✅ | 采样时间戳 (ms) |
| `sensorType` | `SensorType` | ✅ | 所属传感器类型 |
| `values` | `TriaxialValue \| ScalarValue` | ✅ | 采样数值（三轴或标量） |

**TriaxialValue** (三轴传感器：加速度计/陀螺仪/磁力计):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `x` | `number` | ✅ | X 轴值 |
| `y` | `number` | ✅ | Y 轴值 |
| `z` | `number` | ✅ | Z 轴值 |

**ScalarValue** (标量传感器：气压计/光线传感器):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `primary` | `number` | ✅ | 主值（气压 hPa / 照度 lux） |
| `secondary` | `number` | ❌ | 次值（相对高度 m，仅气压计） |

**PedometerValue** (计步器):
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `steps` | `number` | ✅ | 累计步数 |

**Validation**:
- `timestamp` 必须 > 0
- 三轴传感器数据点的 `values` 必须是 `TriaxialValue`
- 标量传感器数据点的 `values` 必须是 `ScalarValue`
- 计步器数据点的 `values` 必须是 `PedometerValue`

---

### 3. SampleRate（采样频率）

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | `string` | ✅ | 频率档位中文名称 |
| `intervalMs` | `number` | ✅ | 采样间隔（毫秒） |
| `frequencyHz` | `number` | ✅ | 等效频率（Hz） |

预设值:
| label | intervalMs | frequencyHz |
|-------|-----------|-------------|
| 慢速 | 1000 | 1 |
| 标准 (默认) | 200 | 5 |
| 快速 | 50 | 20 |

---

## Enum Types

```typescript
export enum SensorType {
  ACCELEROMETER = "accelerometer",
  GYROSCOPE = "gyroscope",
  MAGNETOMETER = "magnetometer",
  BAROMETER = "barometer",
  PEDOMETER = "pedometer",
  LIGHT_SENSOR = "light_sensor",
  DEVICE_MOTION = "device_motion",
}

export enum SensorAvailability {
  AVAILABLE = "available",
  UNAVAILABLE = "unavailable",
  PERMISSION_DENIED = "permission_denied",
}

export enum MonitorStatus {
  STOPPED = "stopped",
  RUNNING = "running",
  ERROR = "error",
}
```

## Mapping Tables

```typescript
/** 传感器类型 → 显示名称 */
export const SENSOR_NAMES: Record<SensorType, string> = {
  [SensorType.ACCELEROMETER]: "加速度计",
  [SensorType.GYROSCOPE]: "陀螺仪",
  [SensorType.MAGNETOMETER]: "磁力计",
  [SensorType.BAROMETER]: "气压计",
  [SensorType.PEDOMETER]: "计步器",
  [SensorType.LIGHT_SENSOR]: "光线传感器",
  [SensorType.DEVICE_MOTION]: "设备运动",
};

/** 传感器类型 → 图标 */
export const SENSOR_ICONS: Record<SensorType, string> = {
  [SensorType.ACCELEROMETER]: "move",
  [SensorType.GYROSCOPE]: "sync",
  [SensorType.MAGNETOMETER]: "compass",
  [SensorType.BAROMETER]: "thermometer",
  [SensorType.PEDOMETER]: "walk",
  [SensorType.LIGHT_SENSOR]: "sunny",
  [SensorType.DEVICE_MOTION]: "phone-portrait",
};

/** 采样频率档位列表 */
export const SAMPLE_RATES = [
  { label: "慢速", intervalMs: 1000, frequencyHz: 1 },
  { label: "标准", intervalMs: 200, frequencyHz: 5 },
  { label: "快速", intervalMs: 50, frequencyHz: 20 },
];
```
