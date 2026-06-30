# Day4 Evidence - 发布表单与数据新增

## 1. 今日完成内容

今天完成了校园轻集市发布页面的完整开发，主要包括三部分工作：**发布表单**的构建、**表单校验**规则的实现、以及**数据新增**的后台对接。

发布表单支持四种业务类型——二手交易、失物招领、拼单搭子、跑腿委托，用户切换类型时自动显示对应专属字段，填写完成后通过 Axios 向 JSON Server 发送 POST 请求，提交成功后自动跳转到对应列表页面并给出成功提示。

## 2. 发布类型与字段设计

四种发布类型各有不同的业务场景，字段设计围绕核心信息展开，避免冗余字段干扰用户体验。

| 发布类型 | 对应数据集合 | 关键字段 | 设计理由 |
|---|---|---|---|
| 二手交易 | trades | title、category、price、condition、location、description | 需要展示商品基本信息和交易条件，price 决定交易金额，condition 让买家了解新旧程度 |
| 失物招领 | lostFounds | title、type、itemName、location、eventTime、contact、description | type 区分丢失/捡到，itemName 精确描述物品，eventTime 记录发生时间，contact 方便联系 |
| 拼单搭子 | groupBuys | title、type、targetCount、deadline、location、description | targetCount 明确成团人数，deadline 设定截止时间，避免拼单无限期等待 |
| 跑腿委托 | errands | title、taskType、reward、from、to、deadline、description | from/to 确定取送路线，reward 标注酬劳，deadline 限定完成时间 |

统一字段方面，每种类型都包含 title（标题，2-50 字）和 description（描述，10-500 字）。地点字段在二手交易、失物招领、拼单搭子中均为必填，而跑腿委托通过 from/to 替代，因为跑腿场景更关注取件和送达的具体路线。

## 3. 表单校验规则

所有校验在表单提交前由 `validateForm()` 函数执行，不满足条件时在对应字段下方显示红色提示文字，同时阻止提交。

**全局校验：**
- 标题：长度不少于 2 个字符，不可仅含空白
- 描述：长度不少于 10 个字符，确保用户填写了足够信息

**二手交易专属：**
- 地点：不可为空
- 分类：必须选择一个商品分类
- 价格：必须大于 0，且为有效数值
- 成色：必须选择一个成色等级

**失物招领专属：**
- 地点：不可为空
- 物品名称：不可为空
- 发生时间：必须选择
- 联系方式：不可为空

**拼单搭子专属：**
- 地点：不可为空
- 拼单类型：必须选择
- 目标人数：不少于 2（单人无法成团）
- 截止时间：必须选择

**跑腿委托专属：**
- 任务类型：必须选择
- 取件地点：不可为空
- 送达地点：不可为空
- 截止时间：必须选择
- 酬劳：可选填，不校验（允许无偿互助）

校验逻辑采用集中式 `check()` 辅助函数，每个类型下逐 field 检查，任何一项不通过即终止提交并给出反馈。

## 4. AI 协作记录

**使用的 AI 工具：** Claude（通过 opencode 交互）

**核心提示词：**

我正在开发一个名为"校园轻集市"的 PC 端 Vue3 Web App，技术栈为 Vue3 + Vite + TypeScript + Vue Router + Pinia + Axios + JSON Server。现在需要完成 Day4：发布表单与数据新增。项目已有 db.json 包含 trades、lostFounds、groupBuys、errands 四类数据，已有 Axios 封装和基础列表渲染。请帮我完成以下任务：
1. 在 PublishView.vue 中实现发布表单；
2. 支持发布四种类型信息；
3. 根据发布类型显示不同字段；
4. 实现基础表单校验；
5. 使用 Axios 向 JSON Server 发送 POST 请求；
6. 提交成功后跳转到对应列表页面。
要求：代码简洁，适合继续扩展；不要加入真实登录、图片上传等复杂逻辑。

**AI 生成的内容：**
- 为四个 API 文件补充了 `create*` POST 方法
- 创建了 `FormField.vue` 作为统一表单项组件
- 重写了 `PublishView.vue` 的完整模板结构，包含四种类型切换和动态表单字段
- 生成了表单数据模型、校验逻辑和提交函数

**AI 生成内容中的不合理之处：**
- AI 生成的 `createMap` 类型使用了 `any`，导致 ESLint 报错，需要手动修正为 `Record<string, (data: Record<string, unknown>) => Promise<unknown>>`
- 初始版本中 `FormField` 组件的 `label` prop 未标记为可选，导致最后一个表单按钮区域传入无 label 的 FormField 时报类型错误
- 类型索引访问 `routeMap[publishType.value]` 的结果被推导为 `string | undefined`，需要在 `router.push` 调用时加非空断言

## 5. 人工调整内容

- **字段命名调整**：将 `formData.desc` 改为 `formData.description`，与 db.json 中的字段名保持一致，确保提交数据能正确写入数据库
- **删除测试占位代码**：移除原来 handleSubmit 中只显示成功消息的虚拟逻辑，替换为真实的 POST 请求和数据提交流程
- **类型安全修复**：将 `createMap` 的签名从 `(data: any) => Promise<any>` 改为 `(data: Record<string, unknown>) => Promise<unknown>`，消除 ESLint 的 no-explicit-any 警告
- **类型断言补全**：在 `router.push(routeMap[publishType.value]!)` 和 `createMap[publishType.value]!(data)` 中添加非空断言，满足 TypeScript 严格模式编译要求
- **组件 Prop 调整**：将 FormField 的 `label` 改为可选 prop，适配无标签的按钮区域使用场景

## 6. 测试记录

**测试场景：发布一条二手交易信息**

操作步骤：
1. 启动前端服务：`pnpm dev`
2. 启动 Mock 服务：`pnpm mock`（JSON Server 运行在 localhost:3002）
3. 在浏览器中访问 `/publish` 页面
4. 发布类型保持默认的"二手交易"
5. 填写标题："高数辅导书大甩卖"
6. 填写描述："大二用过的辅导书，内容完整，做了一些笔记可能有帮助，求带走"
7. 填写地点："一食堂二楼"
8. 分类选择："教材教辅"
9. 价格填写：12
10. 成色选择："八成新"
11. 点击"发布"按钮

**预期结果：**
- 页面弹出绿色成功提示"二手交易发布成功！"
- 浏览器自动跳转到 `/trade` 页面
- 二手交易列表中应看到新增的"高数辅导书大甩卖"卡片
- db.json 的 trades 数组中应新增一条 id 为 6 的记录

**实际结果：**
- 成功弹出提示并跳转到 /trade
- 页面展示了新增的卡片，标题为"高数辅导书大甩卖"，价格为 12 元
- db.json 中 trades 新增了对应记录，字段值与提交数据一致

## 7. 遇到的问题与解决方法

**问题 1：表单提交后页面刷新**

描述：初次测试时，点击"发布"按钮后页面出现短暂刷新，未触发提交逻辑。

原因：`el-form` 内的按钮默认行为为页面提交（type="submit"），而表单未绑定 `@submit.prevent` 时浏览器会执行默认表单提交导致页面刷新。

解决：在 `el-form` 上添加 `@submit.prevent="handleSubmit"`，并将按钮的 `@click` 替换为 `native-type="submit"`，由表单统一拦截提交事件。

**问题 2：TypeScript 类型报错**

描述：`vue-tsc --build` 检查时提示三个类型错误：FormField 缺少 label prop 的必填属性、createMap 索引可能为 undefined、routeMap 索引可能为 undefined。

解决：将 FormField 的 label 改为可选 prop；在 createMap 和 routeMap 的索引访问后添加非空断言操作符 `!`，明确告诉 TypeScript 这些值一定存在。

**问题 3：ESLint 禁止 any 类型**

描述：`pnpm run lint` 时 ESLint 报 `Unexpected any` 错误，来源是 `createMap` 的类型定义使用了 `(data: any) => Promise<any>`。

解决：将 `any` 替换为更精确的 `Record<string, unknown>` 和 `Promise<unknown>`，在保证类型安全的同时保留泛用性。

## 8. 今日反思

**发布表单**是整个 Web 应用中用户与系统交互的核心入口之一。如果没有设计良好的发布表单，用户无法将自己的二手商品、失物信息或拼单需求录入系统，平台将失去数据来源，成为一个空壳。**表单校验**在用户体验和数据质量之间起到了关键过滤作用：校验确保用户填写的标题和描述达到最低长度要求，避免发布无意义的信息；价格校验防止输入负数或零；人数校验保证拼单至少需要两人才能成团——这些都直接影响到平台数据的有用性和可信度。**数据新增**则是连接前端与后端的关键环节：填写表单后能否成功写入数据库、写入后能否在下一页正确展示，构成了一个完整的"增-查"闭环。今天实现的 POST 请求 + 跳转逻辑，让用户能立刻看到新增结果，这种即时反馈对用户留存非常重要。通过 Day4 的开发，我切身体会到这三者缺一不可：**发布表单**决定了用户能输入什么，**表单校验**决定了什么值得存入，**数据新增**决定了数据能否持久化。只有三者协同工作，Web 应用才能真正形成数据流通的闭环。
