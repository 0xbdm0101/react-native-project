# Implementation Plan: 扫码功能 (QR Code Scanner)

**Branch**: `004-qr-code-scanner` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-qr-code-scanner/spec.md`

## Summary

在应用中新增「扫码」页面，通过后置摄像头实时识别二维码（QR Code）和一维条形码（EAN/UPC/Code-128 等），解析内容后展示结果，支持复制、分享、打开链接等后续操作。使用 Expo SDK 54 内置的 `expo-camera` 条码扫描能力（无需额外扫描库），从首页功能入口进入。

## Technical Context

**Language/Version**: TypeScript 5.9

**Primary Dependencies**: expo-camera ~17.0.10（摄像头预览 + 条码扫描），expo-clipboard（剪贴板），expo-linking ~8.0.12（打开 URL），React Native Share API（系统分享），Tamagui（UI），Expo Router ~6.0.24（路由）

**Storage**: 无持久化存储需求（扫码结果仅保存在内存中）

**Testing**: 手动测试（真实二维码/条形码 + 模拟弱光/权限拒绝场景）

**Target Platform**: iOS + Android, Expo SDK 54, React Native 0.81.5

**Project Type**: Mobile app (React Native + Expo)

**Performance Goals**: 正常光照下扫码识别 < 1 秒，摄像头预览维持 30fps

**Constraints**: 唯一新增依赖为 expo-clipboard；页面卸载必须释放摄像头资源；本地离线识别，无网络依赖

**Scale/Scope**: 单页面，3 个核心功能（扫描识别、结果展示、结果操作），0 个辅助页面

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原则 | 状态 | 说明 |
|------|------|------|
| I. 代码质量 | ✅ PASS | 所有常量/枚举/映射提取到 constants.ts：码制映射、UI 文案、错误信息、颜色常量 |
| II. 类型安全 | ✅ PASS | CameraState、ScanResult 等状态用枚举，所有变量有类型注解 |
| III. 错误处理 | ✅ PASS | 统一错误处理：权限拒绝引导、摄像头不可用提示、空内容提示，忽略 cancelled 错误 |
| IV. 性能优化 | ✅ PASS | useEffect cleanup 释放摄像头、清理定时器、移除事件监听 |
| V. 文件组织 | ✅ PASS | 遵循 feature/ 目录结构：constants.ts + types.ts + hooks/ + components/ |
| VI. 生命周期 | ✅ PASS | 页面可见性变化时暂停/恢复摄像头，组件卸载时释放摄像头资源 |

## Project Structure

### Documentation (this feature)

```text
specs/004-qr-code-scanner/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
src/pages/Scan/
├── index.tsx                     # 主页面（相机预览 + 取景框 + 结果面板）
├── constants.ts                  # 枚举、常量、UI 文案、码制映射、颜色
├── types.ts                      # 类型定义
├── hooks/
│   └── useScanner.ts             # 条码扫描逻辑 + 相机权限 + 闪光灯控制
└── components/
    ├── CameraPreview.tsx         # 摄像头预览 + 取景框 + 识别高亮
    ├── ScanResultPanel.tsx       # 扫码结果展示 + 复制/分享/打开按钮
    └── PermissionGuide.tsx       # 相机权限被拒绝时的引导页面

app/
└── scan.tsx                      # 路由文件 → src/pages/Scan/
```

**Structure Decision**: 遵循项目现有模式（与 Network/MQTT/BLE 一致），`src/pages/Scan/` 作为功能模块目录，`app/scan.tsx` 作为 Expo Router 路由入口。

## Dependencies

### New
| Package | Version | Purpose |
|---------|---------|---------|
| expo-clipboard | latest | 复制扫码结果到系统剪贴板 |

### Existing (reused)
| Package | Purpose |
|---------|---------|
| expo-camera ~17.0.10 | 摄像头预览 + 内置条码扫描 (onBarcodeScanned) |
| expo-linking ~8.0.12 | 在浏览器中打开扫码得到的 URL |
| React Native Share API | 系统原生分享面板 |
| Tamagui | UI 组件（Button、Text、XStack、YStack 等） |
| expo-router ~6.0.24 | 路由导航 |
| PageHeader | 复用现有公共顶部返回组件 |

## Complexity Tracking

> 无违规项，无需填写。
