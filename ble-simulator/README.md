# BLE 温湿度传感器模拟器

在 MacBook 上模拟一个 BLE 温湿度传感器，用于测试 iPhone App 的蓝牙功能。

## 🚀 快速开始

### 1. 安装依赖

```bash
cd ble-simulator
npm install
```

### 2. 启动模拟器

```bash
npm start
```

启动后会看到：
```
🌡️  BLE 温湿度传感器模拟器
================================
🔵 蓝牙状态: poweredOn
🚀 开始广播: "TempHumiditySensor"
✅ 广播成功!
📱 现在可以用 iPhone App 连接了!
```

### 3. iPhone App 连接

1. 打开 App → 首页 → 蓝牙通讯
2. 点击"开始扫描"
3. 找到 **"TempHumiditySensor"** 设备
4. 点击"连接"
5. 读取温度和湿度数据

## 📡 模拟器功能

- **设备名**: TempHumiditySensor
- **服务 UUID**: 181A (环境传感)
- **温度特征值**: 2A6E
- **湿度特征值**: 2A6F
- **数据更新**: 每 2 秒随机波动

## 🔧 技术说明

- 使用 [bleno](https://github.com/abandonware/bleno) 库模拟 BLE 外设
- 遵循 Bluetooth SIG 标准 UUID
- 支持 read 和 notify 属性
- 数据格式: IEEE 11073 (16-bit float)

## ⚠️ 注意事项

- macOS 需要开启蓝牙权限
- 首次运行可能需要允许蓝牙访问
- 确保 iPhone 和 Mac 在蓝牙范围内（< 10 米）
