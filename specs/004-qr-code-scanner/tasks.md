# Tasks: 扫码功能 (QR Code Scanner)

**Input**: Design documents from `/specs/004-qr-code-scanner/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: 无自动化测试要求（手动验证，参考 quickstart.md）

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 项目初始化、依赖安装、目录和路由创建

- [ ] T001 Install expo-clipboard via `npx expo install expo-clipboard` and verify in package.json
- [ ] T002 [P] Create directory structure: `src/pages/Scan/`, `src/pages/Scan/hooks/`, `src/pages/Scan/components/`
- [ ] T003 [P] Create route file `app/scan.tsx` that re-exports default from `src/pages/Scan/index.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 类型定义和常量配置 —— 所有用户故事都依赖这些基础文件

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Create type definitions in `src/pages/Scan/types.ts`: ScanResult, CameraState interfaces per data-model.md + all enum types (BarcodeFormat, ContentType, PermissionStatus, ScanMode, CameraErrorType)
- [ ] T005 [P] Create constants in `src/pages/Scan/constants.ts`: all enums, UI_TEXTS (camera permission, scan hints, error messages, button labels), BARCODE_FORMAT_NAMES mapping, CONTENT_TYPE_ACTIONS mapping, COLORS (viewfinder, highlight, background), SCAN_INTERVAL (debounce delay), TIMEOUTS

**Checkpoint**: 类型和常量就绪 —— 用户故事实现可以开始

---

## Phase 3: User Story 1 - 实时扫描二维码 (Priority: P1) 🎯 MVP

**Goal**: 用户打开扫码页面，摄像头实时预览二维码，识别成功后展示结果并可复制

**Independent Test**: 打开扫码页面对准二维码 → 1 秒内识别 → 结果显示 → 点击复制按钮 → 剪贴板有内容

### Implementation for User Story 1

- [ ] T006 [P] [US1] Create PermissionGuide component in `src/pages/Scan/components/PermissionGuide.tsx`: render when camera permission denied, show icon + explanation text + "前往设置" button that calls `Linking.openSettings()`
- [ ] T007 [US1] Create useScanner hook in `src/pages/Scan/hooks/useScanner.ts`: manage camera permission (`useCameraPermissions`), camera active state, torch toggle, barcode scan handler with debounce, scan result state, error state. Return: `{ permission, isActive, torchEnabled, scanResult, error, toggleTorch, clearResult, setIsActive }`
- [ ] T008 [US1] Create CameraPreview component in `src/pages/Scan/components/CameraPreview.tsx`: render `CameraView` from expo-camera with `barcodeScannerSettings` (QR only for US1), overlay viewfinder frame, highlight recognized barcode region via animated border, flash on/off based on torch state, handle camera errors
- [ ] T009 [US1] Create ScanResultPanel component in `src/pages/Scan/components/ScanResultPanel.tsx`: animated bottom panel showing scan result (format label, content text, timestamp), copy button with "已复制" toast feedback, clear/close action. Accept `ScanResult | null` prop
- [ ] T010 [US1] Create main page in `src/pages/Scan/index.tsx`: compose PageHeader + PermissionGuide (when denied) + CameraPreview + ScanResultPanel, wire useScanner hook, handle AppState changes (pause camera on background, resume on foreground), cleanup camera on unmount
- [ ] T011 [US1] Add app state lifecycle handling in `src/pages/Scan/index.tsx` (or via useScanner hook): listen to `AppState` changes, set `isActive=false` when backgrounded, `isActive=true` when foregrounded

**Checkpoint**: QR 码扫描 MVP 可用 —— 用户可扫码、看结果、复制

---

## Phase 4: User Story 2 - 条形码扫描 (Priority: P2)

**Goal**: 扩展扫描能力支持一维条形码（EAN-13/8, Code-128/39, UPC-A/E），正确展示条码内容

**Independent Test**: 对准商品条形码 → 识别并展示数字编码 → 复制、分享正常

### Implementation for User Story 2

- [ ] T012 [US2] Update `barcodeScannerSettings` in `src/pages/Scan/components/CameraPreview.tsx`: extend barcodeTypes from `['qr']` to full list `['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_a', 'upc_e']`, reference constants from `src/pages/Scan/constants.ts`
- [ ] T013 [US2] Update ScanResultPanel in `src/pages/Scan/components/ScanResultPanel.tsx`: display human-readable barcode format name using `BARCODE_FORMAT_NAMES` mapping, show format-specific icon (QR vs barcode), add format badge/tag in result card

**Checkpoint**: 二维码 + 条形码均已可用，码制信息正确展示

---

## Phase 5: User Story 3 - 结果分享与使用 (Priority: P3)

**Goal**: 扫码结果支持分享、打开 URL、智能处理不同内容类型

**Independent Test**: 扫 URL 码 → 点击"打开链接"→ 浏览器打开；扫文本码 → 点击"分享"→ 系统分享面板弹出

### Implementation for User Story 3

- [ ] T014 [P] [US3] Implement share action in `src/pages/Scan/components/ScanResultPanel.tsx`: add "分享" button, call `Share.share({ message: scanResult.data })` from React Native, handle share cancel gracefully
- [ ] T015 [P] [US3] Implement open URL action in `src/pages/Scan/components/ScanResultPanel.tsx`: add "打开链接" button (visible only when contentType is URL), call `Linking.openURL(scanResult.data)`, handle invalid URL error with toast
- [ ] T016 [US3] Implement smart action logic in `src/pages/Scan/components/ScanResultPanel.tsx`: use `CONTENT_TYPE_ACTIONS` mapping to control button visibility (URL shows all 3 buttons, non-URL hides "打开链接"), add special protocol handling (tel:, mailto:, wifi:) with `Linking.canOpenURL()` pre-check
- [ ] T017 [US3] Add scan result indicator: show subtle haptic feedback on successful scan (optional, platform-dependent via `expo-haptics` if available, else skip)

**Checkpoint**: 全功能扫码 —— 扫描 + 复制 + 分享 + 打开链接

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 边界情况处理、错误覆盖、最终验证

- [ ] T018 [P] Handle scan timeout in `src/pages/Scan/hooks/useScanner.ts`: if no barcode detected within TIMEOUT.NO_SCAN period, show hint "未识别到条码，请调整角度或距离" below viewfinder
- [ ] T019 [P] Handle empty scan result in `src/pages/Scan/hooks/useScanner.ts`: if barcode data is empty string, show toast "二维码内容为空" and skip result update
- [ ] T020 [P] Handle camera errors in `src/pages/Scan/hooks/useScanner.ts`: catch camera unavailable/occupied errors, set error state with user-friendly message per `CameraErrorType` mapping
- [ ] T021 [P] Add dark/low-light hint in `src/pages/Scan/components/CameraPreview.tsx`: show floating torch toggle hint "光线不足？轻点开启闪光灯" when torch is off (purely UX enhancement)
- [ ] T022 Run through all quickstart.md validation scenarios (7 scenarios) on real device, verify all pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001) - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 → US2 → US3 recommended (each extends previous)
  - US3 can partially parallel with US2 (different components)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **US2 (P2)**: Depends on US1 completion (extends CameraPreview barcodeTypes + ScanResultPanel display)
- **US3 (P3)**: Depends on US1 completion (adds buttons to ScanResultPanel); can partially overlap with US2

### Within Each User Story

- Types and constants before components
- Hook (useScanner) before page composition
- Sub-components (PermissionGuide, CameraPreview, ScanResultPanel) can be built in parallel
- Page assembly (index.tsx) last in each phase

### Parallel Opportunities

- T002, T003 can run in parallel
- T004, T005 can run in parallel (different files)
- T006 (PermissionGuide), T008 (CameraPreview), T009 (ScanResultPanel) can start in parallel once T004+T005+T007 done
- T014, T015 can run in parallel (different action buttons)
- T018, T019, T020, T021 all run in parallel (different concerns)

---

## Parallel Example: User Story 1

```bash
# Phase 1 - parallel setup:
Task: "T002 Create directory structure"
Task: "T003 Create route file app/scan.tsx"

# Phase 2 - parallel foundations:
Task: "T004 Create type definitions in src/pages/Scan/types.ts"
Task: "T005 Create constants in src/pages/Scan/constants.ts"

# Phase 3 - parallel components after T007 (useScanner):
Task: "T006 Create PermissionGuide in src/pages/Scan/components/PermissionGuide.tsx"
Task: "T008 Create CameraPreview in src/pages/Scan/components/CameraPreview.tsx"
Task: "T009 Create ScanResultPanel in src/pages/Scan/components/ScanResultPanel.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T005)
3. Complete Phase 3: User Story 1 (T006-T011)
4. **STOP and VALIDATE**: Test QR scanning on real device per quickstart.md scenarios 1, 2, 6, 7
5. Deploy/demo — 已具备可用的 QR 码扫描能力

### Incremental Delivery

1. Setup + Foundational → 基础就绪
2. Add US1 → QR 码扫描 + 复制 → Demo (MVP!)
3. Add US2 → 条形码扫描 → Demo
4. Add US3 → 分享 + 打开链接 → Demo
5. Polish → 边界情况全覆盖 → 发布

### Task Count Summary

| Phase | Tasks | Count |
|-------|-------|-------|
| Phase 1: Setup | T001-T003 | 3 |
| Phase 2: Foundational | T004-T005 | 2 |
| Phase 3: US1 (P1) 🎯 | T006-T011 | 6 |
| Phase 4: US2 (P2) | T012-T013 | 2 |
| Phase 5: US3 (P3) | T014-T017 | 4 |
| Phase 6: Polish | T018-T022 | 5 |
| **Total** | | **22** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No tests included (manual verification via quickstart.md)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Real device required for scanning tests (simulator has no camera hardware)
