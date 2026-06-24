# Feature Specification: MQTT/P2P 协议对接

**Feature Branch**: `002-mqtt-p2p`

**Created**: 2026-06-22

**Status**: Draft

**Input**: User description: "实现 MQTT/P2P 协议对接功能：连接 MQTT Broker、订阅主题、接收消息、发送指令，支持 IoT 设备实时通信和远程控制"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 连接 MQTT Broker (Priority: P1)

用户可以配置并连接到 MQTT Broker，查看连接状态，处理连接失败。

**Why this priority**: 这是所有 MQTT 功能的基础，必须先建立连接才能进行后续操作。

**Independent Test**: 可以通过输入 Broker 地址、点击连接、验证连接状态来独立测试。

**Acceptance Scenarios**:

1. **Given** 用户输入 MQTT Broker 地址，**When** 点击"连接"按钮，**Then** 系统尝试连接并显示"连接中..."状态
2. **Given** 连接成功，**When** 连接建立，**Then** 显示"已连接"状态，Broker 信息可见
3. **Given** 连接失败，**When** 出现错误，**Then** 显示友好的错误提示（如地址错误、网络不可用）

---

### User Story 2 - 订阅主题 (Priority: P2)

用户可以订阅 MQTT 主题，查看已订阅的主题列表，取消订阅。

**Why this priority**: 订阅主题是接收消息的前提，但需要先建立连接。

**Independent Test**: 可以通过输入主题名、点击订阅、验证主题出现在列表中来独立测试。

**Acceptance Scenarios**:

1. **Given** 已连接到 Broker，**When** 用户输入主题名并点击"订阅"，**Then** 主题出现在已订阅列表中
2. **Given** 已订阅主题，**When** 收到该主题的消息，**Then** 消息实时显示在消息列表中
3. **Given** 已订阅主题，**When** 用户点击"取消订阅"，**Then** 主题从列表中移除，不再接收该主题消息

---

### User Story 3 - 接收消息 (Priority: P3)

用户可以实时查看收到的 MQTT 消息，包括主题、内容、时间戳。

**Why this priority**: 接收消息是 MQTT 的核心功能，但需要先连接和订阅。

**Independent Test**: 可以通过发送测试消息、验证消息实时显示来独立测试。

**Acceptance Scenarios**:

1. **Given** 已订阅主题，**When** 收到新消息，**Then** 消息实时显示在列表顶部
2. **Given** 收到消息，**When** 查看消息详情，**Then** 显示主题、内容、时间戳、QoS 等级
3. **Given** 消息列表，**When** 用户滚动查看，**Then** 可以查看历史消息

---

### User Story 4 - 发送消息 (Priority: P4)

用户可以向指定主题发送 MQTT 消息，支持不同 QoS 等级。

**Why this priority**: 发送消息是控制 IoT 设备的关键，但需要先建立连接。

**Independent Test**: 可以通过输入主题和消息、点击发送、验证消息发出来独立测试。

**Acceptance Scenarios**:

1. **Given** 已连接到 Broker，**When** 用户输入主题和消息并点击"发送"，**Then** 消息发送成功
2. **Given** 发送消息，**When** 选择 QoS 等级，**Then** 消息按指定 QoS 发送
3. **Given** 发送失败，**When** 出现错误，**Then** 显示错误提示并允许重试

---

### User Story 5 - 管理连接配置 (Priority: P5)

用户可以保存和管理多个 MQTT Broker 配置，快速切换连接。

**Why this priority**: 配置管理提高使用效率，但不是核心功能。

**Independent Test**: 可以通过保存配置、加载配置、验证连接参数来独立测试。

**Acceptance Scenarios**:

1. **Given** 配置 Broker 信息，**When** 点击"保存配置"，**Then** 配置保存到列表中
2. **Given** 已保存配置，**When** 用户选择配置，**Then** 自动填充 Broker 地址和参数
3. **Given** 多个配置，**When** 用户切换配置，**Then** 断开当前连接并连接到新 Broker

---

### Edge Cases

- 当网络断开时，系统显示连接断开提示并尝试重连
- 当 Broker 地址无效时，显示友好的错误提示
- 当订阅主题格式错误时，显示格式要求
- 当消息内容过大时，显示警告并允许发送
- 当 QoS 等级不支持时，降级到支持的等级

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系统必须支持连接到 MQTT Broker（支持 TCP、WebSocket 协议）
- **FR-002**: 系统必须支持配置 Broker 地址、端口、用户名、密码
- **FR-003**: 系统必须支持订阅一个或多个 MQTT 主题
- **FR-004**: 系统必须支持取消订阅已订阅的主题
- **FR-005**: 系统必须实时显示收到的 MQTT 消息
- **FR-006**: 系统必须支持向指定主题发送 MQTT 消息
- **FR-007**: 系统必须支持选择 QoS 等级（0、1、2）
- **FR-008**: 系统必须显示连接状态（已连接、断开、重连中）
- **FR-009**: 系统必须保存和管理多个 Broker 配置
- **FR-010**: 系统必须处理连接断开和自动重连
- **FR-011**: 系统必须显示消息的时间戳和主题信息
- **FR-012**: 系统必须支持清理消息历史

### Key Entities

- **MQTT Broker**: 代表一个 MQTT 服务器，包含地址、端口、认证信息、连接状态
- **MQTT 主题**: 代表一个订阅的主题，包含主题名、QoS 等级、订阅状态
- **MQTT 消息**: 代表一条 MQTT 消息，包含主题、内容、时间戳、QoS 等级
- **连接配置**: 代表一个 Broker 配置，包含名称、地址、端口、用户名、密码

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 用户可以在 30 秒内完成 Broker 连接
- **SC-002**: 订阅主题后，消息延迟不超过 1 秒
- **SC-003**: 发送消息成功率达到 99%
- **SC-004**: 90% 的用户能够成功完成首次连接
- **SC-005**: 连接断开后，系统在 5 秒内尝试重连
- **SC-006**: 用户可以在 10 秒内切换到另一个 Broker 配置
- **SC-007**: 消息列表支持查看最近 1000 条消息

## Assumptions

- 用户有可用的 MQTT Broker（如 Mosquitto、EMQX、HiveMQ）
- 用户了解 MQTT 协议的基本概念（主题、QoS）
- 网络连接稳定，支持长连接
- Broker 支持标准 MQTT 协议（v3.1.1 或 v5.0）
- 消息内容为文本格式（JSON、纯文本）
- 用户有基本的 IoT 设备操作能力
