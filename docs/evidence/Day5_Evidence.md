# Day5 Evidence - 状态管理与用户中心

## 1. 今日完成内容

今天完成了校园轻集市项目的**状态管理**引入和**用户中心**构建，主要包括三个部分：使用 Pinia 创建了两个全局 Store（`user.ts` 和 `favorite.ts`）、在多个页面中接入状态实现数据共享、以及重写了个人中心页面来聚合展示用户信息和收藏内容。

具体完成的工作：

1. 创建 `src/stores/user.ts` — 管理当前用户信息，包括用户名、学院、年级、头像、个人简介以及登录状态；
2. 创建 `src/stores/favorite.ts` — 管理收藏状态，支持添加、取消、切换收藏和判断是否已收藏；
3. 重构 `ItemCard.vue` — 从单一 `item` prop 改为具名 props（`title`、`description`、`location`），新增 `#tag` 和 `#footer` 插槽，增加 hover 上移动画美化交互；
4. 更新 `AppHeader.vue` — 显示当前用户的头像首字和名称，点击头像弹出下拉菜单（个人中心、发布信息、消息中心、退出登录）；
5. 在四类列表页面（TradeView、LostFoundView、GroupBuyView、ErrandView）的 ItemCard footer 插槽中均添加收藏按钮，按钮文字和样式跟随收藏状态联动；
6. 重写 `UserCenterView.vue` — 从 `userStore` 读取用户资料并展示，从 `favoriteStore` 读取收藏列表并支持取消收藏，同时按 publisher 字段筛选四类数据展示"我的发布"；
7. 修改 `PublishView.vue` — 将发布人从硬编码的 `'student01'` 改为 `userStore.displayName`，使发布数据与当前用户状态建立联系。

## 2. Store 设计说明

| Store 文件 | 管理内容 | 主要状态 | 主要方法 |
|---|---|---|---|
| src/stores/user.ts | 当前用户信息 | isLoggedIn、currentUser | updateProfile、login、logout |
| src/stores/favorite.ts | 收藏状态 | favorites 数组 | addFavorite、removeFavorite、toggleFavorite、isFavorite |

**user.ts 的 getter 设计：**

| getter 名称 | 返回值 | 用途 |
|---|---|---|
| `displayName` | 当前用户名 | 导航栏、发布人、个人中心标题 |
| `userDescription` | "学院 · 年级" 格式字符串 | 个人中心副标题 |
| `userInitial` | 用户名第一个字符 | 头像占位文字 |

**favorite.ts 的 getter 和 action 设计：**

- `favoriteCount` — 计算收藏总数，用于个人中心统计展示；
- `favoritesByType(type)` — 按类型筛选收藏，便于扩展分类查看；
- `isFavorite(type, id)` — 判断某条内容是否已被收藏，用于按钮状态切换；
- `toggleFavorite(item)` — 一键切换收藏/取消收藏，简化调用方代码。

两个 Store 均采用 Options API 风格（`defineStore` + `state/getters/actions`），结构清晰，适合教学实训场景。

## 3. 状态边界说明

**放入 Store 的数据：**

1. **当前用户信息** — 放入 `userStore`。原因是导航栏（AppHeader）、发布页面（PublishView）和个人中心（UserCenterView）三个位置都需要读取用户名、学院等资料，如果通过 props 层层传递会导致代码冗余和耦合。
2. **收藏列表** — 放入 `favoriteStore`。原因是列表页面需要读取和修改收藏状态，个人中心也需要读取收藏列表进行展示，这是一个典型的跨页面共享状态。

**未放入 Store 的数据：**

1. **搜索框输入内容** — 只属于当前列表页面，用户离开页面后不需要保留，使用组件内的 `ref` 管理即可。
2. **表单校验错误信息** — 只属于发布表单页面，校验通过后即可清除，没有跨页面共享的需求。
3. **API 接口返回的列表数据** — 各页面的数据彼此独立（二手交易页面只关心 trades，失物招领页面只关心 lostFounds），没有跨页面共享的必要，留在各自的组件内通过 `onMounted` 请求即可。

**状态边界设计原则：** Store 不是用来存放所有数据的地方，而是用来存放多个页面或多个组件需要共享的状态。遵循这一原则可以有效控制 Store 的规模和复杂度。

## 4. 页面使用记录

| 页面/组件 | 使用的 Store | 具体用途 |
|---|---|---|
| AppHeader.vue | userStore | 显示当前用户头像首字和名称，提供导航下拉菜单 |
| AppNav.vue | — | 导航栏不需要用户状态，未引入 |
| ItemCard.vue | — | 纯展示组件，通过 props 接收数据，通过插槽让父组件注入收藏操作 |
| TradeView.vue | favoriteStore | 在 footer 插槽中添加收藏按钮，调用 toggleFavorite 和 isFavorite |
| LostFoundView.vue | favoriteStore | 同上，在失物招领列表中添加收藏操作 |
| GroupBuyView.vue | favoriteStore | 同上，在拼单列表中添加收藏操作 |
| ErrandView.vue | favoriteStore | 同上，在跑腿列表中添加收藏操作 |
| PublishView.vue | userStore | 构建提交数据时，publisher 字段读取 userStore.displayName |
| UserCenterView.vue | userStore + favoriteStore | 用户资料展示（userStore）、收藏列表展示和取消收藏（favoriteStore）、我的发布按 publisher 筛选 |
| MessageView.vue | — | 静态消息页面，尚未接入状态 |

## 5. AI 协作记录

**使用的 AI 工具：** Claude（通过 opencode 交互）

**核心提示词：**

我正在开发一个名为"校园轻集市"的 PC 端 Vue3 Web App，技术栈为 Vue3 + Vite + TypeScript + Vue Router + Pinia + Axios + JSON Server。现在需要完成 Day5：状态管理与用户中心。

项目中已完成：
1. 页面骨架和路由导航（首页、二手交易、失物招领、拼单搭子、跑腿委托、发布信息、消息中心、个人中心）；
2. Mock 数据和列表渲染（四个业务页面已有列表展示）；
3. 发布表单和数据新增（PublishView 支持四种类型发布）。

请帮我完成以下任务：
1. 使用 Pinia 创建用户状态 Store，模拟当前用户信息，不接入真实登录；
2. 使用 Pinia 创建收藏状态 Store；
3. 在 ItemCard 中增加 footer 插槽用于放置收藏按钮；
4. 在四类业务列表页面中实现收藏和取消收藏；
5. 在个人中心展示用户资料和我的收藏列表；
6. 发布页面中的 publisher 字段改为读取当前用户名称；
7. 代码保持简洁，适合教学实训项目继续扩展；
8. 不要加入复杂登录鉴权、JWT、后端权限系统和真实消息推送。

**AI 生成的内容：**

- 生成了 `src/stores/user.ts` 的完整代码，包含 `CurrentUser` 接口、state、getters 和 actions；
- 生成了 `src/stores/favorite.ts` 的完整代码，包含 `FavoriteItem` 接口、getters 和 actions；
- 提供了 `ItemCard.vue` 增加 footer 插槽的改造思路和代码模板；
- 提供了 `AppHeader.vue` 引入 userStore 的代码片段；
- 提供了 `UserCenterView.vue` 使用两个 Store 展示用户资料和收藏列表的完整代码；
- 提供了 `TradeView.vue` 集成收藏按钮的示例代码；
- 提供了 `PublishView.vue` 将硬编码 publisher 改为 `userStore.displayName` 的修改建议。

**AI 生成内容中的不合理之处：**

- AI 初始提供的 `ItemCard.vue` 仍然保留旧的 `item: Record<string, unknown>` prop 结构，与新的具名插槽设计不匹配，需要手动改为 `title`、`description`、`location` 等具名 props 以获得类型安全和更好的可读性；
- AI 生成 `UserCenterView.vue` 的"我的发布"部分时，直接使用 `i.publisher` 过滤 `LostFoundItem`，但该类型定义中缺少 `publisher` 字段，导致 TypeScript 编译报错；
- AI 建议的收藏按钮样式使用了简单的 `<button>` 元素，不符合 Element Plus 设计规范，与项目其他按钮样式不统一。

## 6. 人工调整内容

1. **修改 API 类型定义** — 在 `src/api/lostFound.ts` 的 `LostFoundItem` 接口中添加 `publisher?: string` 可选字段。原因是发布表单提交时会给失物招领数据附带 publisher 字段，但原有类型定义缺失该字段，导致 UserCenterView 中按 publisher 筛选时 TypeScript 报错。

2. **重构 ItemCard prop 结构** — 将 `item: Record<string, unknown>` 替换为 `title: string`、`description: string`、`location?: string` 三个具名 prop，并新增 `#tag` 和 `#footer` 两个插槽。这样既获得了类型安全，又让组件的使用意图更加清晰。

3. **统一引入路径风格** — 将所有与 Store 相关的 `import` 从相对路径（`../stores/user`）改为 `@/stores/user` 别名路径，与项目中已有的 API 引入风格保持一致。

4. **处理 ESLint 类型限制** — `PublishView.vue` 的 `createMap` 因为函数签名差异触发了 `@typescript-eslint/no-explicit-any` 规则。添加了行内 `// eslint-disable-next-line` 注释，在保留类型精度的前提下绕过检查。

5. **美化收藏按钮交互** — 将按钮从普通 `<button>` 替换为 Element Plus 的 `<el-button>` 组件，使用 `Star` / `StarFilled` 图标配合 `type` 的 `default` / `warning` 切换，视觉反馈更清晰。

6. **补充编辑资料功能** — 在 UserCenterView 中增加了编辑资料的弹窗对话框，调用 `userStore.updateProfile()` action 实现用户信息修改，让 Store 的 action 有实际调用场景。

## 7. 测试记录

**测试场景 1：收藏功能闭环测试**

操作步骤：
1. 启动前端服务 `pnpm dev` 和 Mock 服务 `pnpm mock`；
2. 访问 `/trade` 页面，在第一个商品卡片中找到"收藏"按钮；
3. 点击"收藏"按钮。

实际结果：
- 按钮文字从"收藏"变为"已收藏"；
- 按钮图标从空心 `Star` 变为实心 `StarFilled`；
- 按钮颜色从灰色变为黄色（`default` → `warning`）；
- 再次点击按钮，恢复为"收藏"和灰色样式。

操作步骤：
4. 点击导航栏头像，选择"个人中心"进入 `/user` 页面。

实际结果：
- "我的收藏"区域显示刚才收藏的商品卡片；
- 卡片上带有"二手交易"标签和"取消收藏"按钮；
- 点击"取消收藏"按钮，该卡片从收藏列表中消失；
- "共 0 项"统计数字同步更新。

**测试场景 2：发布人来自用户状态**

操作步骤：
1. 访问 `/publish` 页面，保持默认"二手交易"；
2. 填写标题"测试商品"，描述"这是一条测试发布数据，用于验证发布人字段"，地点"测试地点"，分类"其他"，价格"1"，成色"全新"；
3. 点击"发布"按钮；
4. 发布成功后，打开 db.json 查看新记录。

实际结果：
- `publisher` 字段值为 `"校园用户"`，与 `userStore.displayName` 一致；
- 跳转到 `/trade` 页面后，列表中新增的卡片发布人处显示"校园用户"。

**测试场景 3：编辑用户资料**

操作步骤：
1. 在个人中心页面点击"编辑资料"按钮；
2. 将昵称从"校园用户"改为"张三"，点击"保存"；
3. 查看导航栏和页面标题。

实际结果：
- 导航栏用户名立即更新为"张三"；
- 个人中心页面的标题和头像首字同步更新；
- 刷新页面后，由于未接入持久化，状态恢复为默认值（符合 Day5 预期）。

## 8. 遇到的问题与解决方法

**问题 1：TypeScript 类型报错 — LostFoundItem 缺少 publisher 字段**

描述：`vue-tsc --build` 编译时提示 `Property 'publisher' does not exist on type 'LostFoundItem'`。原因是 UserCenterView 中通过 `lostFounds.value.filter(i => i.publisher === userStore.displayName)` 筛选当前用户的发布记录，但 `LostFoundItem` 接口中没有定义 `publisher`。

解决：在 `src/api/lostFound.ts` 的 `LostFoundItem` 接口中添加 `publisher?: string` 可选字段。这也反映了实际数据的情况：原有模拟数据中没有 publisher，但通过发布表单提交时会带上该字段。

**问题 2：createMap 类型不兼容**

描述：`PublishView.vue` 中的 `createMap` 将四个 API 的 create 函数放在一个对象中统一调用，但这些函数的参数类型各不相同（`Omit<TradeItem, 'id'>`、`Omit<LostFoundItem, 'id'>` 等），无法直接赋值给 `Record<string, (data: Record<string, unknown>) => Promise<unknown>>`。

解决：在类型定义前添加 `// eslint-disable-next-line @typescript-eslint/no-explicit-any`，将 map 值类型放宽为 `(data: any) => Promise<unknown>`。这是实际项目中常见的"调用方类型放宽"模式，比使用复杂泛型更简洁。

**问题 3：ItemCard 插槽改造导致现有视图报错**

描述：将 `ItemCard` 的 prop 从 `item: Record<string, unknown>` 改为 `title`、`description`、`location` 三个独立 prop 后，所有使用 `<ItemCard :item="item">` 的页面都出现编译错误，需要逐个页面修改。

解决：批量更新了 TradeView、LostFoundView、GroupBuyView、ErrandView 四个页面，将 `<ItemCard :item="item">` 改为 `<ItemCard :title="item.title" :description="item.description" :location="item.location">`，并同步将原有的默认插槽内容迁移到 `#tag` 和 `#footer` 插槽中。

**问题 4：刷新页面后收藏数据丢失**

描述：收藏数据只保存在 Pinia 的 state 中（内存），刷新页面后 `favorites` 数组恢复为空数组。这是 Day5 阶段可以接受的现象。

解决：暂时不做持久化处理。后续如果需要保留收藏数据，可以结合 localStorage 或后端接口实现。Day5 的重点是理解 Pinia 的状态共享机制，而不是实现完整的收藏系统。在测试和证据记录中明确说明了这一行为。

## 9. 今日反思

**Pinia** 作为 Vue3 官方推荐的状态管理库，为多页面前端应用的**状态管理**提供了简洁而强大的解决方案。在今天开发**用户中心**的过程中，我深刻体会到 Pinia 在跨组件、跨页面状态共享上的价值。

在引入 Pinia 之前，用户信息和收藏列表要么直接写死在每个页面中，要么通过 props 层层传递。前者导致数据不一致（同一用户在不同页面看到不同信息），后者导致代码耦合严重（修改一个组件需要追溯所有父组件）。引入 Pinia 后，`userStore` 和 `favoriteStore` 成为了数据的"唯一可信源"，任何页面只需要调用 `useUserStore()` 或 `useFavoriteStore()` 即可读取和修改共享状态，代码结构变得清晰且可维护。

状态管理的另一个关键收获是"状态边界"的设计。并不是所有数据都应该放进 Store——搜索框输入内容和表单校验错误信息这类只属于单个页面的临时数据，留在组件内部用 ref 管理反而更简洁。将状态按"是否跨页面共享"进行分类，是 Pinia 使用中最重要的设计原则之一。

从用户视角来看，状态管理的引入让"用户中心"有了实际意义：用户发布信息时自动关联当前用户身份，在个人中心可以集中查看自己的资料、收藏和发布记录。虽然 Day5 还没有接入真实登录和持久化，但整体的状态流转逻辑已经跑通，为后续 Day6 的消息通知和 Day7 的交互优化打下了坚实的基础。

总的来说，Pinia 状态管理让项目从"各自为政的页面集合"进化为"数据可流转的统一应用"，这是前端项目走向工程化的重要一步。
