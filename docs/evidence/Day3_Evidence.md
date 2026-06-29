# Day3 Evidence - Mock 数据建模与列表渲染

## 1. 今日完成内容

今日完成了数据模型与接口层的统一对齐工作。根据 Day3 规范要求，对 `db.json` 中四类业务数据的字段命名进行了标准化调整，统一使用 `publishTime`、`itemName`、`eventTime`、`targetCount`、`currentCount`、`taskType`、`from`、`to` 等规范字段名，并对每条数据补充了 `description` 描述字段。同时在 `src/api/` 各模块中新增导出的 TypeScript 接口定义，各页面视图改为引用 API 层类型，消除了本地重复类型定义。最终通过 `vue-tsc` 类型检查和生产构建验证。

## 2. Mock 数据结构说明

| 数据集合   | 对应业务 | 主要字段                                                                                        | 页面用途           |
| ---------- | -------- | ----------------------------------------------------------------------------------------------- | ------------------ |
| trades     | 二手交易 | title、price、category、condition、publisher、publishTime、location、image、status、description | 展示二手商品列表   |
| lostFounds | 失物招领 | title、type、itemName、location、eventTime、contact、status、description                        | 展示失物和招领信息 |
| groupBuys  | 拼单搭子 | title、type、targetCount、currentCount、deadline、location、publisher、status、description      | 展示拼单和搭子信息 |
| errands    | 跑腿委托 | title、taskType、reward、from、to、deadline、publisher、status、description                     | 展示跑腿任务列表   |

## 3. 我的设计

数据字段设计完全贴合校园市集的真实使用场景。

- **二手交易设 price 和 condition**：价格和成色是校园二手交易的核心决策信息，学生浏览商品时最先关注的就是价格是否合理、物品成色如何，这两个字段直接决定了交易能否达成。
- **失物招领设 type 字段**：用于区分"遗失"和"拾到"两类信息，便于用户按类型筛选，快速找到自己需要的寻物启事或拾物登记。
- **拼单搭子设 targetCount 和 currentCount**：目标人数和当前人数能直观展示拼单进度，学生可以判断是否需要加入、距离成团还差多少人，提升拼单成功率。
- **跑腿委托设 from、to 和 reward**：取件地址和送达地址完整覆盖跑腿路线，酬劳字段是接单者最关心的信息，这三个字段构成了跑腿任务的核心要素。

## 4. AI 设计

AI辅助生成了规范化的页面骨架代码、列表渲染逻辑和通用组件模板，包括ItemCard卡片组件和EmptyState空状态组件。AI也帮助生成了Axios请求实例和四个业务API模块的初始代码，以及db.json的Mock数据结构框架。但AI生成的初始代码使用了模糊类型 `Record<string, unknown>` 定义 props，导致 TypeScript 出现大量红色报错；同时部分数据字段命名不够规范（如 `pickAddr`、`sendAddr`、`goodsName`），与Day3要求的标准字段名不匹配。

## 5. 最终调整

针对AI生成的不合理内容进行了多项手动修正。首先在 `src/api/` 各模块中为每一类业务数据定义了专属的 `export interface` 类型接口，精准约束字段类型，页面视图改为引用 API 层类型而非本地重复定义。其次对 `db.json` 进行了字段重命名：`publishingTime` 改为 `publishTime`、`goodsName` 改为 `itemName`、`time` 改为 `eventTime`、`desc` 改为 `description`、`targetNum/currentNum` 改为 `targetCount/currentCount`、`pickAddr/sendAddr` 改为 `from/to`、`type`（跑腿）改为 `taskType`。同时为所有数据项补充了 `description` 字段，使每条数据都有完整的场景描述。

## 6. 遇到的问题与解决方法

本次遇到的主要问题是字段名不一致导致页面渲染与Mock数据脱节。之前美化的过程中使用了与Day3规范不同的字段命名（如 `goodsName`、`currentNum`、`pickAddr`），虽然页面能正常运行，但数据模型不符合项目规范要求，后续扩展和维护会变得困难。解决方法：统一将 `db.json` 中的所有字段名改为 Day3 规范标准名称，同步更新 `src/api/*.ts` 中的TypeScript接口定义，并在各页面视图中更新模板绑定的字段引用。调整后通过 `vue-tsc --build` 类型检查无错误，`vite build` 构建成功。

## 7. 今日反思

Mock数据建模是前后端分离开发的基础环节。规范的字段命名、统一的类型定义能够保证数据流在 API 层、组件层和视图层之间顺畅传递，减少因字段不一致导致的调试成本。接口请求模块按业务拆分（trade、lostFound、groupBuy、errand）使代码结构清晰、职责分明，后续新增接口只需在对应模块中扩展即可。列表渲染是前端页面最核心的数据展示能力，结合 TypeScript 类型约束可以有效避免运行时字段访问错误。本次数据建模与接口封装的规范性优化，为后续增删改查功能开发和真实后端对接打下了坚实基础。
