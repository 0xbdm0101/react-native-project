# Research: 扫码功能 (QR Code Scanner)

**Date**: 2026-07-08

## 1. 条码扫描方案选择

**Decision**: 使用 `expo-camera` 内置的 `onBarcodeScanned` 回调实现条码扫描，无需引入第三方扫描库。

**Rationale**:
- `expo-camera` ~17.0.10 已在项目中安装，内置条码扫描能力（`CameraView` 组件 + `barcodeScannerSettings` 属性）
- Expo SDK 54 的 `expo-camera` 支持扫码区域限制、多码制切换、扫描间隔控制
- 无需引入额外原生依赖（如 `expo-barcode-scanner` 已被废弃合并入 `expo-camera`）
- 本地离线识别，无需网络，满足 spec 中的离线要求

**Alternatives considered**:
- `expo-barcode-scanner`: 已被 Expo 官方废弃，功能已合并入 `expo-camera`
- `react-native-vision-camera` + `vision-camera-code-scanner`: 需要额外原生配置，不适合 Expo 托管工作流
- `@shopify/react-native-skia` + 自研识别: 过度设计，开发成本高

## 2. 支持的码制列表

**Decision**: 支持以下 7 种码制，覆盖 spec 要求的 6 种以上：

| 码制 | expo-camera 标识 | 类型 |
|------|-----------------|------|
| QR Code | `qr` | 二维码 |
| EAN-13 | `ean13` | 一维条形码 |
| EAN-8 | `ean8` | 一维条形码 |
| Code-128 | `code128` | 一维条形码 |
| Code-39 | `code39` | 一维条形码 |
| UPC-A | `upc_a` | 一维条形码 |
| UPC-E | `upc_e` | 一维条形码 |

**Rationale**: `expo-camera` 原生支持以上全部码制，无需额外配置。

## 3. 相机权限处理

**Decision**: 使用 `expo-camera` 的 `useCameraPermissions` hook 管理权限流程。

**Rationale**:
- `useCameraPermissions()` 返回 `[permission, requestPermission, getPermission]` 三元组
- `permission.status` 包含 `"granted" | "denied" | "undetermined"` 三种状态
- 权限被拒绝时，使用 `Linking.openSettings()` 引导用户前往系统设置

**States**:
```
[undetermined] → 调用 requestPermission() → [granted] → 打开摄像头
[undetermined] → 调用 requestPermission() → [denied] → 显示权限引导页
[denied] → 用户点击"去设置" → Linking.openSettings() → [granted/denied]
```

## 4. 剪贴板方案

**Decision**: 使用 `expo-clipboard` 的 `setStringAsync()` API。

**Rationale**:
- Expo 官方维护的剪贴板库，iOS/Android 双平台统一 API
- 支持字符串复制，满足 spec 需求
- 需要在 `app.json` 中添加 `expo-clipboard` 插件配置（Expo SDK 54+ 要求）

**Alternatives considered**:
- `@react-native-clipboard/clipboard`: 社区维护，需要额外原生配置
- React Native 内置 `Clipboard` 已废弃

## 5. 分享方案

**Decision**: 使用 React Native 内置的 `Share.share()` API。

**Rationale**:
- 无需额外依赖
- 调起系统原生分享面板（iOS Share Sheet / Android Intent）
- 支持分享文本内容到所有已安装应用

## 6. URL 打开方案

**Decision**: 使用 `expo-linking` 的 `openURL()` 打开 HTTP/HTTPS 链接；特殊协议使用 `Linking.canOpenURL()` 预检。

**Rationale**:
- `expo-linking` ~8.0.12 已在项目中安装
- 对于特殊协议（`wifi://`、`tel:` 等），先检测 `canOpenURL` 再尝试打开，无法处理的给出提示

## 7. 连续扫描 vs 单次扫描

**Decision**: 默认采用连续扫描模式，用户可手动切换为单次扫描。

**Rationale**:
- 连续扫描符合 spec 中"实时识别"的描述
- `expo-camera` 默认持续触发 `onBarcodeScanned`，通过间隔控制（如 2 秒内不重复扫描同一内容）避免重复识别
- spec 要求"上一次结果保留直到新结果覆盖"，连续模式天然支持

## 8. 闪光灯控制

**Decision**: 使用 `expo-camera` 的 `CameraView` 的 `enableTorch` 属性控制闪光灯。

**Rationale**:
- `CameraView` 组件原生支持 `enableTorch` 布尔值属性
- 简单开关切换，无需额外权限（Android 部分设备可能需要 `FLASHLIGHT` 权限，Expo 已内置处理）
