# Tasks: 传感器监控 (Sensors Monitor)

**Input**: Design documents from `specs/005-sensors-monitor/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: 无自动化测试要求（手动验证，参考 quickstart.md）

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 目录创建和路由注册

- [x] T001 Create directory structure: `src/pages/Sensors/`, `src/pages/Sensors/hooks/`, `src/pages/Sensors/components/`
- [x] T002 [P] Create route file `app/sensors.tsx` that re-exports default from `src/pages/Sensors/index.tsx`
- [x] T003 [P] Create route file `app/sensor-detail.tsx` that re-exports default from `src/pages/Sensors/detail.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 类型定义和常量配置 —— 所有用户故事都依赖这些基础文件

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create type definitions in `src/pages/Sensors/types.ts`: SensorInfo, SensorDataPoint, SampleRate interfaces per data-model.md + all enum types (SensorType, SensorAvailability, MonitorStatus)
- [x] T005 [P] Create constants in `src/pages/Sensors/constants.ts`: all enums (duplicate for self-contained module), UI_TEXTS (page titles, status labels, button labels, error messages, permission guidance), SENSOR_NAMES mapping, SENSOR_ICONS mapping, SAMPLE_RATES config, COLOR constants, STYLE_CONFIG

**Checkpoint**: 类型和常量就绪 —— 用户故事实现可以开始

---

## Phase 3: User Story 1 - 传感器列表浏览 (Priority: P1) 🎯 MVP

**Goal**: 用户打开传感器页面，看到 7 种传感器列表，每个显示名称/图标/可用状态，可用的可点击进入详情页

**Independent Test**: 打开传感器页面 → 看到 7 种传感器 → 每个显示名称和可用状态 → 不可用置灰 → 点击可用传感器进入详情页

### Implementation for User Story 1

- [x] T006 [P] [US1] Create SensorCard component in `src/pages/Sensors/components/SensorCard.tsx`: render sensor name + icon + availability status badge, grey out unavailable items, handle press callback. Props: `SensorInfo`, `onPress`. Unavailable cards show reason text and are non-interactive
- [x] T007 [US1] Create useSensorList hook in `src/pages/Sensors/hooks/useSensorList.ts`: check availability of all 7 sensor types via `isAvailableAsync()`, build `SensorInfo[]` list with availability status, handle permissions for Pedometer. Return: `{ sensors, loading, error }`
- [x] T008 [US1] Create sensor list page in `src/pages/Sensors/index.tsx`: compose PageHeader + FlatList of SensorCard, wire useSensorList hook, navigate to `/sensor-detail?type=xxx` on card press
- [x] T009 [US1] Add route mapping `sensors: "/sensors"` in `src/pages/Home/index.tsx` ROUTE_MAP

**Checkpoint**: 传感器列表 MVP 可用 —— 用户可浏览传感器、查看可用状态、进入详情页

---

## Phase 4: User Story 2 - 实时数据监控 (Priority: P1)

**Goal**: 用户进入传感器详情页，看到实时变化的传感器数据，可启动/停止采集

**Independent Test**: 从列表点击加速度计 → 进入详情页 → X/Y/Z 数值随手机移动实时变化 → 点击停止数值定格 → 点击开始恢复

### Implementation for User Story 2

- [x] T010 [P] [US2] Create TriaxialDisplay component in `src/pages/Sensors/components/TriaxialDisplay.tsx`: display X/Y/Z three-axis values with colored labels (X=red, Y=green, Z=blue), show latest data point, auto-update on new data. Props: `data: TriaxialValue | null`
- [x] T011 [P] [US2] Create ScalarDisplay component in `src/pages/Sensors/components/ScalarDisplay.tsx`: display primary value in large font, secondary value (if exists) below, with unit label. Props: `data: ScalarValue | null`, `unit: string`, `secondaryUnit?: string`
- [x] T012 [P] [US2] Create PedometerDisplay component in `src/pages/Sensors/components/PedometerDisplay.tsx`: display cumulative step count in large font, loading state. Props: `steps: number | null`, `loading: boolean`
- [x] T013 [US2] Create useSensorData hook in `src/pages/Sensors/hooks/useSensorData.ts`: accept `SensorType` param, instantiate corresponding sensor class (Accelerometer/Gyroscope/etc.), subscribe via `addListener()`, set update interval default to 200ms, return `{ data, monitorStatus, startMonitoring, stopMonitoring }`. Cleanup subscription on unmount. Handle sensor not available error
- [x] T014 [US2] Create sensor detail page in `src/pages/Sensors/detail.tsx`: read `type` query param from route, get sensor name from SENSOR_NAMES, compose PageHeader + TriaxialDisplay/ScalarDisplay/PedometerDisplay (based on sensor type) + start/stop button, wire useSensorData hook, auto-start monitoring on mount

**Checkpoint**: 实时数据监控可用 —— 用户可查看任意传感器的实时数据变化

---

## Phase 5: User Story 3 - 采样频率调节 (Priority: P2)

**Goal**: 用户在详情页可切换采样频率档位，切换后立即生效

**Independent Test**: 在加速度计详情页 → 切换频率为"慢速"→ 观察到数值更新变慢 → 切换为"快速"→ 数值更新变快 + 耗电提示

### Implementation for User Story 3

- [x] T015 [US3] Create SampleRatePicker component in `src/pages/Sensors/components/SampleRatePicker.tsx`: render three preset buttons (慢速/标准/快速) with current selection highlighted, show battery warning text when "快速" is selected. Props: `currentRate`, `onRateChange`
- [x] T016 [US3] Integrate SampleRatePicker into `src/pages/Sensors/detail.tsx` and `src/pages/Sensors/hooks/useSensorData.ts`: add `sampleRate` state, pass to useSensorData, call `setUpdateInterval()` on rate change. Display rate picker between header and data display

**Checkpoint**: 采样频率调节可用 —— 三档切换即时生效

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 边界情况处理、错误覆盖、最终验证

- [x] T017 [P] Add AppState lifecycle handling in `src/pages/Sensors/hooks/useSensorData.ts`: listen to AppState changes, pause monitoring on background (remove subscription), resume on foreground (re-add subscription with same config)
- [x] T018 [P] Handle edge cases: (a) permission denied guidance for Pedometer in `src/pages/Sensors/detail.tsx` via `requestPermissionsAsync()`, (b) sensor error state with user-friendly message in useSensorData, (c) loading skeleton while checking availability in useSensorList
- [x] T019 Run through all 7 quickstart.md validation scenarios on real device, verify all pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001) - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 → US2 → US3 推荐顺序（每个后续故事扩展前一个）
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **US2 (P1)**: Depends on US1 (detail page navigation from list); can partially overlap with US1 sub-components
- **US3 (P2)**: Depends on US2 completion (adds SampleRatePicker to detail page + useSensorData integration)

### Within Each User Story

- Constants and types before components
- Hooks before page composition
- Sub-components (SensorCard, TriaxialDisplay, ScalarDisplay, PedometerDisplay) can be built in parallel
- Page assembly last in each phase

### Parallel Opportunities

- T002, T003 can run in parallel (different route files)
- T004, T005 can run in parallel (different files: types.ts, constants.ts)
- T010, T011, T012 can run in parallel (different display components, no dependencies)
- T017, T018 can run in parallel (different concerns)

---

## Parallel Example: User Story 2

```bash
# Parallel sub-components:
Task: "T010 Create TriaxialDisplay in src/pages/Sensors/components/TriaxialDisplay.tsx"
Task: "T011 Create ScalarDisplay in src/pages/Sensors/components/ScalarDisplay.tsx"
Task: "T012 Create PedometerDisplay in src/pages/Sensors/components/PedometerDisplay.tsx"

# Then sequential:
Task: "T013 Create useSensorData hook" (depends on T010-T012 completion)
Task: "T014 Create sensor detail page" (depends on T013)
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T005)
3. Complete Phase 3: User Story 1 (T006-T009)
4. Complete Phase 4: User Story 2 (T010-T014)
5. **STOP and VALIDATE**: Test sensor list + real-time data on real device per quickstart.md scenarios 1, 2, 3, 5, 6, 7
6. Deploy/demo — 已具备可用的传感器浏览和监控能力

### Incremental Delivery

1. Setup + Foundational → 基础就绪
2. Add US1 → 传感器列表浏览 → Demo (MVP 第一步!)
3. Add US2 → 实时数据监控 → Demo (MVP!)
4. Add US3 → 采样频率调节 → Demo
5. Polish → 边界情况全覆盖 → 发布

### Task Count Summary

| Phase | Tasks | Count |
|-------|-------|-------|
| Phase 1: Setup | T001-T003 | 3 |
| Phase 2: Foundational | T004-T005 | 2 |
| Phase 3: US1 (P1) 🎯 | T006-T009 | 4 |
| Phase 4: US2 (P1) | T010-T014 | 5 |
| Phase 5: US3 (P2) | T015-T016 | 2 |
| Phase 6: Polish | T017-T019 | 3 |
| **Total** | | **19** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No tests included (manual verification via quickstart.md)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Real device required for sensor data tests (simulator has limited sensor support)
