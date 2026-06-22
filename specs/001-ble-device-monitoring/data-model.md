# Data Model: BLE设备实时监控管理

**Date**: 2026-06-22
**Feature**: 001-ble-device-monitoring

## 实体定义

### 1. BLEDevice (BLE设备)

**描述**: 代表一个蓝牙低功耗设备

**字段**:
- `id`: string - 设备唯一标识符（MAC地址或UUID）
- `name`: string | null - 设备名称（可能为空）
- `rssi`: number | null - 信号强度（dBm）
- `isConnectable`: boolean | null - 是否可连接
- `manufacturerData`: string | null - 制造商数据
- `serviceUUIDs`: string[] - 服务UUID列表
- `txPowerLevel`: number | null - 发射功率级别

**状态**:
- 未连接 (disconnected)
- 连接中 (connecting)
- 已连接 (connected)
- 断开中 (disconnecting)

**验证规则**:
- id 必须非空
- rssi 范围: -100 到 0 dBm
- name 最大长度: 100 字符

### 2. BLEService (BLE服务)

**描述**: 设备提供的功能模块

**字段**:
- `uuid`: string - 服务UUID
- `name`: string - 服务名称（从映射表获取）
- `isPrimary`: boolean - 是否为主要服务
- `characteristics`: Characteristic[] - 特征值列表

**验证规则**:
- uuid 必须符合UUID格式
- name 必须非空

### 3. BLECharacteristic (BLE特征值)

**描述**: 服务中的数据点

**字段**:
- `uuid`: string - 特征值UUID
- `name`: string - 特征值名称（从映射表获取）
- `value`: string | null - 数据值（Base64编码）
- `isReadable`: boolean - 是否可读
- `isWritableWithResponse`: boolean - 是否可写（需要响应）
- `isWritableWithoutResponse`: boolean - 是否可写（无需响应）
- `isNotifiable`: boolean - 是否可通知
- `isIndicatable`: boolean - 是否可指示

**验证规则**:
- uuid 必须符合UUID格式
- 至少一个属性必须为true

### 4. ConnectionState (连接状态)

**描述**: 设备的连接生命周期状态

**枚举值**:
- `IDLE`: 空闲状态
- `CONNECTING`: 连接中
- `CONNECTED`: 已连接
- `DISCONNECTING`: 断开中

**状态转换**:
```
IDLE → CONNECTING → CONNECTED → DISCONNECTING → IDLE
         ↓                         ↓
       IDLE (失败)               IDLE (完成)
```

### 5. BluetoothState (蓝牙状态)

**描述**: 设备蓝牙状态

**枚举值**:
- `UNKNOWN`: 未知状态
- `RESETTING`: 重置中
- `UNSUPPORTED`: 不支持
- `UNAUTHORIZED`: 未授权
- `POWERED_OFF`: 已关闭
- `POWERED_ON`: 已开启
- `TURNING_ON`: 开启中
- `TURNING_OFF`: 关闭中

### 6. ScanStatus (扫描状态)

**描述**: 设备扫描状态

**枚举值**:
- `IDLE`: 空闲
- `SCANNING`: 扫描中
- `ERROR`: 错误

### 7. SensorData (传感器数据)

**描述**: 设备传感器读数

**字段**:
- `temperature`: number | null - 温度（°C）
- `humidity`: number | null - 湿度（%）
- `battery`: number | null - 电池电量（%）
- `timestamp`: number - 更新时间戳

**验证规则**:
- temperature 范围: -40 到 85°C
- humidity 范围: 0 到 100%
- battery 范围: 0 到 100%

## 关系定义

### BLEDevice → BLEService (1:N)
- 一个设备可以有多个服务
- 服务属于特定设备

### BLEService → BLECharacteristic (1:N)
- 一个服务可以有多个特征值
- 特征值属于特定服务

### BLEDevice → ConnectionState (1:1)
- 一个设备同时只有一个连接状态
- 状态随操作变化

### BLEDevice → SensorData (1:1)
- 一个设备同时只有一组传感器数据
- 数据随时间更新

## 数据流

### 扫描流程
```
用户操作 → 启动扫描 → 发现设备 → 更新设备列表 → 停止扫描
```

### 连接流程
```
用户操作 → 启动连接 → 连接成功 → 发现服务 → 发现特征值 → 进入详情页
```

### 数据读取流程
```
进入详情页 → 读取特征值 → 解析数据 → 显示数据 → 订阅更新
```

### 断开流程
```
用户操作/自动断开 → 断开连接 → 清理资源 → 返回列表
```

## 数据转换

### 设备信息转换
```typescript
// 从Device到BLEDevice的转换
const deviceInfo: BLEDevice = {
  id: device.id,
  name: device.name || '未知设备',
  rssi: device.rssi,
  isConnectable: device.isConnectable,
  // ...
};
```

### 服务信息转换
```typescript
// 从Service到BLEService的转换
const serviceInfo: BLEService = {
  uuid: service.uuid,
  name: getServiceName(service.uuid),
  isPrimary: service.isPrimary,
  // ...
};
```

### 特征值转换
```typescript
// 从Characteristic到BLECharacteristic的转换
const charInfo: BLECharacteristic = {
  uuid: characteristic.uuid,
  name: getCharacteristicName(characteristic.uuid),
  value: characteristic.value,
  isReadable: characteristic.isReadable,
  // ...
};
```

### 数据解析
```typescript
// 温度数据解析 (IEEE 11073)
const parseTemperature = (base64: string): number => {
  const buffer = Buffer.from(base64, 'base64');
  return buffer.readInt16LE(0) / 100;
};

// 湿度数据解析
const parseHumidity = (base64: string): number => {
  const buffer = Buffer.from(base64, 'base64');
  return buffer.readUInt16LE(0) / 100;
};

// 电池数据解析
const parseBattery = (base64: string): number => {
  const buffer = Buffer.from(base64, 'base64');
  return buffer.readUInt8(0);
};
```

## 验证规则汇总

### 必填字段
- BLEDevice.id
- BLEService.uuid
- BLECharacteristic.uuid

### 范围验证
- rssi: -100 到 0 dBm
- temperature: -40 到 85°C
- humidity: 0 到 100%
- battery: 0 到 100%

### 格式验证
- UUID格式: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
- Base64格式: 有效的Base64编码字符串

## 状态管理

### 全局状态
- `bluetoothState`: BluetoothState - 蓝牙状态
- `scanStatus`: ScanStatus - 扫描状态
- `connectionStatus`: ConnectionStatus - 连接状态
- `devices`: Map<string, BLEDevice> - 设备列表
- `connectedDevice`: BLEDevice | null - 当前连接设备

### 局部状态
- `services`: BLEService[] - 服务列表
- `characteristics`: Map<string, BLECharacteristic[]> - 特征值映射
- `sensorData`: SensorData - 传感器数据
- `currentRSSI`: number | null - 当前RSSI

## 缓存策略

### 设备列表缓存
- 使用Map数据结构
- 按设备ID索引
- 扫描时更新

### 服务和特征值缓存
- 连接后发现并缓存
- 断开后清除

### 传感器数据缓存
- 实时更新
- 无需持久化

## 错误处理

### 数据验证错误
- 必填字段缺失
- 范围超出限制
- 格式不正确

### 转换错误
- Base64解码失败
- 数据格式不支持
- 解析异常

### 处理策略
- 提供默认值
- 显示友好提示
- 记录错误日志

---

**Status**: ✅ COMPLETE
**Next**: quickstart.md
