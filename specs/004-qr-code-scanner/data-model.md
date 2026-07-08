# Data Model: 扫码功能 (QR Code Scanner)

**Date**: 2026-07-08

## Entity Definitions

### 1. ScanResult（扫码结果）

用户扫描二维码/条形码后得到的结果，保存在内存中。

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | `string` | ✅ | 扫码解析出的原始文本内容 |
| `format` | `BarcodeFormat` | ✅ | 码制类型（QR / EAN-13 / Code-128 等） |
| `contentType` | `ContentType` | ✅ | 内容分类（URL / 文本 / 数字 / 其他） |
| `timestamp` | `number` | ✅ | 识别时间戳 (ms) |
| `bounds` | `{ x: number, y: number, width: number, height: number }` | ❌ | 码在取景框中的位置坐标（用于高亮标记） |

**Validation**:
- `data` 不能为空字符串（空内容视为识别失败）
- `format` 必须为 `BarcodeFormat` 枚举值之一
- `contentType` 通过 `data` 内容自动推断（见下方推断规则）

**ContentType 推断规则**:
```
data 以 http:// 或 https:// 开头 → URL
data 全部由数字组成 → 数字
data 包含可打印字符 → 文本
其他 → 未知
```

**States**: N/A（不存在状态流转，每次扫描产生新结果覆盖旧结果）

---

### 2. CameraState（相机状态）

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `permissionStatus` | `PermissionStatus` | ✅ | 相机权限状态 |
| `isActive` | `boolean` | ✅ | 摄像头是否正在预览 |
| `torchEnabled` | `boolean` | ✅ | 闪光灯是否开启 |
| `error` | `string \| null` | ❌ | 相机错误信息（不可用/占用时） |

**States**:
```
[权限未请求] → 请求权限 → [权限已授权] → 激活摄像头 → [扫描中]
[权限未请求] → 请求权限 → [权限已拒绝] → 显示引导页
[扫描中] → 页面失焦/卸载 → [摄像头暂停]
[扫描中] → 摄像头错误 → [错误状态]
```

---

## Enum Types

```typescript
export enum BarcodeFormat {
  QR = "qr",
  EAN_13 = "ean13",
  EAN_8 = "ean8",
  CODE_128 = "code128",
  CODE_39 = "code39",
  UPC_A = "upc_a",
  UPC_E = "upc_e",
}

export enum ContentType {
  URL = "url",
  TEXT = "text",
  NUMBER = "number",
  UNKNOWN = "unknown",
}

export enum PermissionStatus {
  UNDETERMINED = "undetermined",
  GRANTED = "granted",
  DENIED = "denied",
}

export enum ScanMode {
  CONTINUOUS = "continuous",   // 连续扫描（默认）
  SINGLE = "single",           // 单次扫描
}

export enum CameraErrorType {
  NOT_AVAILABLE = "not_available",
  IN_USE = "in_use",
  UNKNOWN = "unknown",
}
```

## Mapping Tables

```typescript
// 码制 → 中文名称
export const BARCODE_FORMAT_NAMES: Record<BarcodeFormat, string> = {
  [BarcodeFormat.QR]: "QR 码",
  [BarcodeFormat.EAN_13]: "EAN-13 条形码",
  [BarcodeFormat.EAN_8]: "EAN-8 条形码",
  [BarcodeFormat.CODE_128]: "Code-128 条形码",
  [BarcodeFormat.CODE_39]: "Code-39 条形码",
  [BarcodeFormat.UPC_A]: "UPC-A 条形码",
  [BarcodeFormat.UPC_E]: "UPC-E 条形码",
};

// 内容类型 → 操作按钮可用性
export const CONTENT_TYPE_ACTIONS: Record<ContentType, { canOpen: boolean; canCopy: boolean; canShare: boolean }> = {
  [ContentType.URL]: { canOpen: true, canCopy: true, canShare: true },
  [ContentType.TEXT]: { canOpen: false, canCopy: true, canShare: true },
  [ContentType.NUMBER]: { canOpen: false, canCopy: true, canShare: true },
  [ContentType.UNKNOWN]: { canOpen: false, canCopy: true, canShare: true },
};
```
