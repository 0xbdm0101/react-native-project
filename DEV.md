# 开发调试流程

## 日常开发

### 模拟器
```bash
npx expo start -c
# 模拟器里按 R 重新加载
```

### 真机（WiFi 无线，推荐）
```bash
npx expo start --dev-client --lan
# 手机和电脑连同一个 WiFi，打开 App 自动连上
```

### 真机（USB 有线）
```bash
npx expo start --dev-client
# 插线时自动走 USB 通道
```

## 什么时候需要重新打包原生

- 安装了新的原生依赖（如蓝牙库、react-native-xxx）
- 修改了 `app.json` / `Info.plist`
- 更新了 `expo` 版本
- **纯 JS/TS 改动不需要重新打包，热更新即可**

## 重新打包命令（需 Xcode + 手机插线）
```bash
npx expo prebuild --clean
npx expo run:ios --device
```

## iOS 构建方式

| 方式 | 费用 | 场景 |
|------|------|------|
| Xcode 本地构建 | 免费 | 日常开发 |
| EAS Build 云端 | $99/年 | 上架 App Store |

## 真机调试注意事项

- **开发者模式**：设置 → 隐私与安全性 → 开发者模式 → 打开
- **信任证书**：设置 → 通用 → VPN与设备管理 → 信任开发者证书
- **Xcode 签名**：Signing & Capabilities → Automatically manage signing → 选 Apple ID
- **模拟器警告**：`hapticpatternlibrary.plist` 是系统警告，忽略即可
