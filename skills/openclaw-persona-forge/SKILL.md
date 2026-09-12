---
name: openclaw-persona-forge
description: "Use when 为 OpenClaw AI Agent 锻造完整的龙虾灵魂方案。根据用户偏好或随机抽卡， 输出身份定位、灵魂描述(SOUL.md)、角色化底线规则、名字和头像生图提示词。 如当前环境提供已审核的生图 skill，可自动生成统一风格头像图片。 当用户需要创建、设计或定制 OpenClaw 龙虾灵魂时使用。 不适用于：微调已有 SOUL.md、非 OpenClaw 平台的角色设计、纯工具型无性格 Agent。 触发词：龙虾灵魂、虾魂、OpenClaw 灵魂、养虾灵魂、龙虾角色、龙虾定位、 龙虾剧... Triggers on \"openclaw-persona-forge\", \"openclaw persona forge\", \"forge\"."
metadata:
  origin: community
---

# 龙虾灵魂锻造炉

> 不是给你一只工具龙虾，而是帮你锻造一只有灵魂的龙虾。

## When to Use

- 当用户需要从零创建 OpenClaw 龙虾灵魂、角色设定、SOUL.md 或 IDENTITY.md
- 当用户想通过引导式问答或抽卡模式快速得到完整 persona 方案
- 当用户已经有一个粗糙设定，但还缺名字、边界规则、头像提示词或成套输出文件

### Avoid when

- 用户只需微调已有 SOUL.md
- 目标平台不是 OpenClaw，需要的是其他 Agent 框架专用格式
- 用户需要纯工具型 Agent，不需要角色化灵魂

## 前置条件

- **必需**：`python3`（运行抽卡引擎 gacha.py）
- **可选**：已审核的生图 skill（自动生成头像图片，未安装则输出提示词文本）

## Skill 目录约定

**Agent Execution**:
1. Determine this SKILL.md file's directory path as `SKILL_DIR`
2. Replace all `${SKILL_DIR}` in this document with the actual path

## 内置工具

### 抽卡引擎（gacha.py）

- **路径**：`${SKILL_DIR}/gacha.py`
- **调用**：`python3 ${SKILL_DIR}/gacha.py [次数]`（默认 1 次，最多 5 次）
- **作用**：从 800 万种组合中真随机生成龙虾灵魂方向

## 可选依赖

### 头像自动生图：可选生图 skill

本 Skill 的核心输出是**文本方案**（SOUL.md + IDENTITY.md + 头像提示词）。
头像图片生成是**可选增强能力**，由当前环境中**已审核并已安装**的生图 skill 提供。

**判断逻辑**：
- 如果当前环境已安装并允许使用的生图 skill → Step 5 中调用它自动生图
- 如果未安装 → Step 5 输出完整的提示词文本，用户可复制到 Gemini / ChatGPT / Midjourney 手动生成

**调用方式**（仅在已安装且已审核时）：
1. 先将龙虾名字规整为安全片段：仅保留字母、数字和连字符，其余字符统一替换为 `-`
2. 将提示词写入临时文件 `/tmp/openclaw-<safe-name>-prompt.md`
3. 使用当前环境允许的生图 skill，传入提示词文件和输出路径

**接口约定**：
- 参数：`<prompt-file> <output-path>`
- 提示词文件：UTF-8 Markdown 文本，包含完整英文生图提示词
- 成功：退出码 `0`，并在输出路径生成图片文件
- 失败：返回非 `0` 退出码，或未生成输出文件；此时必须回退到手动提示词流程
- 如生图 skill 后续接口发生变化，调用前应重新核对其参数和输出契约
