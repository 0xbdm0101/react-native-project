# Spec Kit 使用指南

## 📖 什么是 Spec Kit？

Spec Kit 是 GitHub 官方的规范驱动开发工具包，帮助你：
- 定义功能需求
- 设计技术方案
- 分解实现任务
- 自动编写代码

**核心价值**：当你不知道怎么做某个功能时，AI 会自动帮你完成所有工作。

---

## 🛠️ 安装

### 前置条件
- Node.js 18+
- Python 3.10+
- uv（Python 包管理器）

### 安装步骤

```bash
# 1. 安装 uv（如果没有）
curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.local/bin/env

# 2. 安装 specify-cli
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v0.11.3

# 3. 验证安装
specify --version

# 4. 在项目中初始化
cd your-project
specify init --here --integration claude --force
```

### 初始化后生成的文件

```
.claude/
├── skills/
│   ├── speckit-constitution/
│   ├── speckit-specify/
│   ├── speckit-plan/
│   ├── speckit-tasks/
│   ├── speckit-implement/
│   └── ...
├── memory/
│   └── constitution.md
└── templates/
```

---

## 📋 命令速查表

### 核心命令（按顺序执行）

| 命令 | 作用 | 使用频率 |
|------|------|---------|
| `/speckit-constitution` | 定义项目原则 | 一次性 |
| `/speckit-specify` | 定义功能需求 | 每个功能一次 |
| `/speckit-plan` | 设计技术方案 | 每个功能一次 |
| `/speckit-tasks` | 分解实现任务 | 每个功能一次 |
| `/speckit-implement` | 自动编写代码 | 每个功能一次 |

### 辅助命令（可选）

| 命令 | 作用 | 使用时机 |
|------|------|---------|
| `/speckit-clarify` | 澄清需求细节 | 需求不明确时 |
| `/speckit-analyze` | 分析一致性 | 规划完成后 |
| `/speckit-checklist` | 生成检查清单 | 规划完成后 |
| `/speckit-converge` | 评估代码库 | 实现完成后 |

---

## 🚀 完整工作流示例

### 示例 1: 实现 MQTT 功能

```bash
# 步骤 1: 定义功能需求
/speckit-specify 实现 MQTT 协议对接功能：连接 MQTT Broker、订阅主题、接收消息、发送指令，用于 IoT 设备通信

# 步骤 2: 设计技术方案
/speckit-plan 使用 mqtt.js 库实现 MQTT 通信，支持 QoS 1 消息质量，实现自动重连机制

# 步骤 3: 分解任务
/speckit-tasks

# 步骤 4: 自动实现
/speckit-implement
```

### 示例 2: 实现网络切换页面

```bash
# 步骤 1: 定义功能需求
/speckit-specify 实现 WiFi/4G 网络切换管理页面，显示当前网络状态，支持手动切换网络

# 步骤 2: 设计技术方案
/speckit-plan 使用 @react-native-community/netinfo 检测网络状态，使用 react-native-wifi-reborn 管理 WiFi

# 步骤 3: 分解任务
/speckit-tasks

# 步骤 4: 自动实现
/speckit-implement
```

### 示例 3: 对接真实 API

```bash
# 步骤 1: 定义功能需求
/speckit-specify 对接小米 MIoT 云 API，实现设备列表获取、设备控制、状态同步

# 步骤 2: 设计技术方案
/speckit-plan 使用 REST API 对接小米云服务，实现 OAuth2 认证，使用 SWR 缓存数据

# 步骤 3: 分解任务
/speckit-tasks

# 步骤 4: 自动实现
/speckit-implement
```

---

## 💡 命令详解

### 1. `/speckit-constitution` - 定义项目原则

**作用**：创建项目的编码规范和开发原则

**使用时机**：项目初始化时，只需要执行一次

**示例**：
```bash
/speckit-constitution 蓝牙IoT应用开发原则：代码质量、类型安全、错误处理、性能优化
```

**生成文件**：`.specify/memory/constitution.md`

---

### 2. `/speckit-specify` - 定义功能需求

**作用**：创建功能规范文档，描述要做什么

**使用时机**：每个新功能开始时

**示例**：
```bash
/speckit-specify 实现用户登录功能，支持邮箱密码登录和第三方 OAuth 登录
```

**生成文件**：`specs/XXX-feature-name/spec.md`

**关键点**：
- 描述 **做什么**，不描述 **怎么做**
- 聚焦用户价值和业务需求
- 不涉及技术实现细节

---

### 3. `/speckit-plan` - 设计技术方案

**作用**：创建实现计划，选择技术栈和架构

**使用时机**：需求确认后

**示例**：
```bash
/speckit-plan 使用 React Native + TypeScript，采用 MVVM 架构，使用 Valtio 状态管理
```

**生成文件**：
- `specs/XXX-feature-name/plan.md`
- `specs/XXX-feature-name/research.md`
- `specs/XXX-feature-name/data-model.md`

**关键点**：
- 选择技术栈
- 设计架构
- 定义数据模型
- 评估风险

---

### 4. `/speckit-tasks` - 分解任务

**作用**：将实现计划分解为可执行的任务列表

**使用时机**：技术方案确认后

**示例**：
```bash
/speckit-tasks
```

**生成文件**：`specs/XXX-feature-name/tasks.md`

**任务格式**：
```
- [ ] T001 [P] [US1] 创建用户模型 src/models/user.ts
- [ ] T002 [US1] 实现登录服务 src/services/auth.ts
```

**关键点**：
- 任务可独立执行
- 支持并行执行 [P]
- 按用户故事分组 [US1]

---

### 5. `/speckit-implement` - 自动实现

**作用**：根据任务列表自动编写代码

**使用时机**：任务分解完成后

**示例**：
```bash
/speckit-implement
```

**执行过程**：
- 按阶段执行任务
- 自动创建文件
- 自动编写代码
- 自动更新任务状态

---

## 📁 文件结构

### Spec Kit 生成的文件

```
your-project/
├── .specify/
│   ├── memory/
│   │   └── constitution.md      # 项目原则
│   ├── templates/               # 模板文件
│   ├── extensions.yml           # 扩展配置
│   └── feature.json             # 当前功能配置
│
├── .claude/
│   ├── skills/                  # 命令技能
│   └── memory/                  # AI 记忆
│
└── specs/
    └── 001-feature-name/
        ├── spec.md              # 功能规范
        ├── plan.md              # 实现计划
        ├── tasks.md             # 任务列表
        ├── research.md          # 技术研究
        ├── data-model.md        # 数据模型
        ├── quickstart.md        # 验证指南
        └── checklists/
            └── requirements.md  # 质量检查
```

---

## 🎯 使用场景

### ✅ 适合使用 Spec Kit 的场景

| 场景 | 原因 |
|------|------|
| 新功能开发 | 需求未知，需要规划 |
| 复杂功能 | 需要分解任务 |
| 团队协作 | 需要明确分工 |
| 技术选型 | 需要评估方案 |
| 长期维护 | 需要文档记录 |

### ❌ 不适合使用 Spec Kit 的场景

| 场景 | 原因 |
|------|------|
| 简单修改 | 直接改代码更快 |
| Bug 修复 | 不需要完整流程 |
| 已完成的功能 | 不需要重新规划 |
| 紧急任务 | 流程太重 |

---

## 🔧 常见问题

### Q1: 每次都要跑所有命令吗？

**A**: 不是！只有新功能才需要完整流程。

```
新功能: specify → plan → tasks → implement（完整流程）
已有功能: 直接改代码（不需要 Spec Kit）
```

### Q2: 可以跳过某些命令吗？

**A**: 可以！根据需要选择：

```bash
# 完整流程（推荐）
/speckit-specify → /speckit-plan → /speckit-tasks → /speckit-implement

# 快速流程（跳过规划）
/speckit-specify → /speckit-implement

# 只要任务分解
/speckit-tasks
```

### Q3: 命令执行失败怎么办？

**A**: 检查前置条件：

```bash
# 检查 Spec Kit 是否初始化
ls .specify/

# 检查是否有功能规范
ls specs/

# 重新初始化（如果需要）
specify init --here --integration claude --force
```

### Q4: 如何修改生成的代码？

**A**: 直接修改！Spec Kit 只是帮你生成初始代码，后续修改直接改代码即可。

---

## 📝 快速参考卡片

### 开始新功能

```bash
# 1. 定义需求
/speckit-specify [功能描述]

# 2. 设计方案
/speckit-plan [技术栈和架构]

# 3. 分解任务
/speckit-tasks

# 4. 自动实现
/speckit-implement
```

### 查看生成的文件

```bash
# 查看功能规范
cat specs/*/spec.md

# 查看实现计划
cat specs/*/plan.md

# 查看任务列表
cat specs/*/tasks.md
```

### 更新任务状态

```bash
# 任务完成后自动更新
# 或手动编辑 tasks.md
```

---

## 🎓 最佳实践

### 1. 需求描述要清晰

```bash
# ❌ 不好的描述
/speckit-specify 做一个登录功能

# ✅ 好的描述
/speckit-specify 实现用户登录功能：支持邮箱密码登录、手机号验证码登录、微信 OAuth 登录，包含注册和找回密码流程
```

### 2. 技术方案要具体

```bash
# ❌ 不好的方案
/speckit-plan 用 React Native 实现

# ✅ 好的方案
/speckit-plan 使用 React Native + TypeScript，采用 Expo Router 路由，使用 Valtio 状态管理，使用 axios 请求 API
```

### 3. 遵循项目原则

```bash
# 项目原则已定义在 constitution.md
# 所有实现都会遵循这些原则
# 不需要每次重复说明
```

### 4. 增量开发

```bash
# 先实现 MVP（最小可行产品）
/speckit-specify 实现基础登录功能
/speckit-implement

# 验证后再添加功能
/speckit-specify 添加 OAuth 登录
/speckit-implement
```

---

## 📚 相关资源

- [Spec Kit GitHub](https://github.com/github/spec-kit)
- [官方文档](https://github.com/github/spec-kit#readme)
- [示例项目](https://github.com/github/spec-kit/tree/main/examples)

---

## ✅ 快速开始清单

- [ ] 安装 uv
- [ ] 安装 specify-cli
- [ ] 在项目中初始化
- [ ] 定义项目原则（一次性）
- [ ] 开始第一个功能
- [ ] 享受自动编码！

---

**最后更新**: 2026-06-22
**版本**: 1.0.0
