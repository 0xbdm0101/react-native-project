# 蓝牙设备搜索页面实现计划

## 目标
实现 BLE (蓝牙低功耗) 设备搜索页面，扫描附近设备并显示信号强度、设备信息。

## 技术方案
使用 `react-native-ble-plx` 库 + Expo Config Plugin

## 实现步骤

### 1. 安装依赖
```bash
npx expo install react-native-ble-plx
```

### 2. 配置 app.json
添加蓝牙权限和 Config Plugin：
```json
{
  "expo": {
    "plugins": [
      [
        "react-native-ble-plx",
        {
          "isBackgroundEnabled": false,
          "modes": ["central"],
          "bluetoothAlwaysPermission": "允许 $(PRODUCT_NAME) 使用蓝牙连接设备"
        }
      ]
    ]
  }
}
```

### 3. 创建页面文件结构
```
src/pages/BLE/
├── index.tsx              # 主页面组件
├── components/
│   ├── BLEDeviceCard.tsx  # 设备卡片组件
│   └── ScanButton.tsx     # 扫描按钮组件
├── hooks/
│   └── useBLE.ts          # 蓝牙逻辑 Hook
└── constants.ts           # 常量定义
```

### 4. 实现 useBLE Hook
核心功能：
- 蓝牙状态监听（开启/关闭/未授权）
- 扫描设备（带超时）
- 设备连接/断开
- 错误处理

### 5. 实现 UI 组件
- **BLEDeviceCard**: 显示设备名称、UUID、RSSI 信号强度、连接状态
- **ScanButton**: 扫描/停止扫描切换按钮，带动画
- **主页面**: 头部导航 + 设备列表 + 空状态提示

### 6. 路由集成
在 `app/(tabs)/explore.tsx` 中添加入口，或创建新的路由页面

## 功能特性
- ✅ 实时扫描附近 BLE 设备
- ✅ 显示设备名称、MAC 地址、RSSI
- ✅ 按信号强度排序
- ✅ 设备连接/断开功能
- ✅ 蓝牙权限请求和状态处理
- ✅ 扫描动画效果
- ✅ 暗色主题 UI（与现有风格一致）

## 依赖库
- `react-native-ble-plx`: BLE 核心库
- `@expo/vector-icons`: 图标（已有）
- `expo-router`: 路由（已有）

## 注意事项
- iOS 需要在 Xcode 中配置蓝牙权限描述
- Android 需要 BLUETOOTH_SCAN 和 BLUETOOTH_CONNECT 权限
- 真机调试需要重新 prebuild
- Expo Go 不支持原生模块，需要 Development Build
