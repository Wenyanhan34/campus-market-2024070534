# Day6 Evidence - 注册登录、交互优化与体验完善

## 1. 今日完成内容

今日完成了注册/登录系统、用户状态持久化、页面联动、交互优化以及相关推荐导航修复。

具体包括：

- **注册/登录实现**：基于 JSON Server 实现注册写入（POST /users）和登录校验（GET /users），配合 Pinia 状态管理和 localStorage 持久化；
- **用户状态持久化**：登录成功后保存到 Pinia 和 localStorage，刷新页面后通过 `restoreLogin()` 恢复；
- **页面联动**：AppHeader 根据登录状态切换显示"登录/注册"按钮或用户下拉菜单；PublishView、SettingsView 未登录时拦截跳转；UserCenterView 未登录时显示提示卡片；
- **交互优化**：抽取 LoadingState.vue / ErrorState.vue / SearchBar.vue 三个公共组件，所有列表页统一使用；发布按钮增加提交中状态；收藏按钮区分已收藏/未收藏样式；请求失败时显示错误提示；
- **相关推荐导航修复**：发现 Vue Router 组件复用导致相关推荐点击后页面不刷新，在 AppLayout.vue 的 `<component>` 上添加 `:key="$route.fullPath"` 强制重建组件；
- **TypeScript 类型安全修复**：`currentUser` 改为 `AppUser | null` 后，所有访问处增加非空断言通过 type-check。

## 2. 注册登录设计说明

本项目注册/登录流程完全基于 JSON Server Mock API 实现，不涉及真实后端。具体流程如下：

**注册流程**：
1. 用户在 RegisterView 中填写用户名、密码、显示名称、学院、年级；
2. 前端先通过 `GET /users?username=xxx` 查询用户名是否已存在；
3. 若已存在则提示用户更换用户名；
4. 若不存在则通过 `POST /users` 将新用户写入 JSON Server 的 `users` 资源；
5. 注册成功后跳转到登录页，让用户使用刚注册的账号登录。

**登录流程**：
1. 用户在 LoginView 中输入用户名和密码；
2. 前端通过 `GET /users?username=xxx&password=yyy` 向 JSON Server 发起查询；
3. 若返回数组为空则提示"用户名或密码错误"；
4. 若返回一个用户则登录成功；
5. 登录成功后调用 `userStore.login(user)`，将用户数据保存到 Pinia；
6. 同时写入 `localStorage.setItem('currentUser', JSON.stringify(user))` 供刷新后恢复；
7. 使用 `router.push('/')` 跳转到首页。

**退出流程**：
1. 用户点击退出按钮；
2. 调用 `userStore.logout()`，清空 Pinia 中的 `currentUser`；
3. 同时 `localStorage.removeItem('currentUser')`；
4. 跳转到首页，导航栏恢复为未登录状态。

## 3. 用户数据结构说明

| 字段     | 含义                    | 必填 | 示例         |
| -------- | ----------------------- | ---- | ------------ |
| id       | 自动主键                | 自动 | 1            |
| username | 登录用户名              | 是   | student      |
| password | 登录密码                | 是   | 123456       |
| name     | 显示名称                | 是   | 校园用户     |
| college  | 学院                    | 是   | 计算机学院   |
| grade    | 年级                    | 是   | 2023级       |
| avatar   | 头像 URL                | 否   | 空字符串     |
| campus   | 校区（east/west/south） | 否   | east         |
| role     | 身份（student/staff）   | 否   | student      |
| contact  | 联系方式                | 否   | 微信：123456 |
| bio      | 个人简介                | 否   | 热爱校园生活 |

其中 `campus`、`role`、`contact` 为后期 SettingsView 扩展字段，在注册时暂不填写，由用户在设置页自行补充。

## 4. 状态持久化说明

**为什么需要 localStorage？**

Pinia 是内存级状态管理，所有状态存储在 JavaScript 运行时中。当用户刷新浏览器页面时，Pinia 中的所有状态会全部丢失。这意味着如果仅将登录用户保存在 Pinia 中，用户一刷新页面就会回到未登录状态，需要重新登录，体验极差。

**localStorage 的作用：**
- 登录成功时将当前用户数据序列化后存入 `localStorage.setItem('currentUser', JSON.stringify(user))`；
- 在 `App.vue` 的 `onMounted` 中调用 `userStore.restoreLogin()`；
- `restoreLogin()` 从 `localStorage.getItem('currentUser')` 读取并反序列化，若存在则调用 `userStore.login(user)` 恢复状态；
- 退出登录时 `localStorage.removeItem('currentUser')` 清除持久化数据；
- 更新个人资料时（SettingsView），同时更新 localStorage 中的 `currentUser` 数据。

**重要说明：** 本项目只是前端 Mock 登录，不是生产级安全方案。localStorage 存储的用户信息未加密，密码以明文形式保存和传输，任何人都可以通过浏览器开发者工具查看或篡改。在实际生产环境中应使用 JWT Token + HttpOnly Cookie 的方式，并配合后端 Session 管理。

## 5. 页面联动记录

登录状态影响了以下页面和组件：

### AppHeader.vue（导航栏）
- **未登录**：右侧显示"登录"和"注册"两个 `<router-link>` 按钮；
- **已登录**：右侧显示用户头像（若有）、显示名称和下拉菜单（个人中心、账号设置、退出登录）。

### PublishView.vue（发布页面）
- 用户在发布页面填写表单后点击提交；
- `handleSubmit()` 首先检查 `userStore.isLoggedIn`；
- 未登录时通过 `ElMessage.warning('请先登录后再发布信息')` 提示，并 `router.push('/login')` 跳转到登录页；
- 登录后发布时，`publisher` 字段来自 `userStore.currentUser.name`，确保发布人信息正确。

### UserCenterView.vue（个人中心）
- 组件模板顶层使用 `v-if="!userStore.isLoggedIn"` 判断；
- 未登录时显示居中卡片"请先登录"，附带"去登录"按钮；
- 已登录时显示完整的个人信息、已发布内容列表和收藏列表；
- 编辑个人资料对话框中的数据来自当前登录用户。

### SettingsView.vue（账号设置）
- `onMounted` 中检查 `userStore.isLoggedIn`；
- 未登录时通过 `ElMessage.warning` 提示并跳转到登录页；
- 已登录时允许用户修改显示名称、学院、年级、校区、身份、联系方式和简介；
- 保存时调用 `userStore.updateProfile()` 更新 Pinia 和 localStorage。

### 收藏功能
- 收藏按钮在 TradeDetailView 中可直接点击收藏；
- 收藏存储在独立的 `useFavoriteStore` 中（Pinia 内存状态，刷新后丢失）；
- 登录用户可以在个人中心查看收藏列表；
- 收藏功能本身不依赖登录状态（未登录用户也可以点击收藏，但刷新后会丢失）。

## 6. 交互优化记录

### 新增公共组件

1. **LoadingState.vue**：封装加载状态展示，显示加载动画和自定义文本（如"正在加载商品详情..."），所有 4 个列表页和 4 个详情页统一使用。

2. **ErrorState.vue**：封装错误状态展示，显示错误图标和自定义提示信息（如"商品数据加载失败，请检查 Mock 服务是否正常运行"），支持"重试"按钮，通过 emit 事件回调解。

3. **SearchBar.vue**：封装搜索栏组件，支持键盘 Enter 搜索和点击搜索按钮两种方式，通过 v-model 和 emit 实现双向绑定，所有 4 个列表页统一使用。

### 列表页改造

- 二手交易、失物招领、拼单搭子、跑腿委托四个页面统一使用 LoadingState / ErrorState / SearchBar 组件；
- 每个页面包含 loading / empty / error 三种状态的完整处理；
- 每个页面支持关键词搜索（实时过滤或搜索按钮触发）；
- 请求失败时显示 ErrorState，用户可点击重试。

### 发布页面优化

- 发布按钮增加 `submitting` 状态：提交时按钮变为加载态（`loading` 属性为 `true`），文字变为"发布中..."，防止重复提交；
- 提交失败时恢复按钮状态。

### 收藏按钮优化

- 收藏按钮使用 `isFav` 计算属性判断当前商品是否已收藏；
- 已收藏时按钮类型为 `warning`（黄色），文字显示"已收藏"；
- 未收藏时按钮类型为 `default`，文字显示"收藏"；
- 点击时调用 `toggleFav()` 切换收藏状态。

### 相关推荐导航修复

- 发现 4 个详情页的相关推荐点击后 URL 改变但页面内容不刷新；
- 原因是 Vue Router 复用组件导致 `onMounted` 不触发第二次；
- 在 AppLayout.vue 的 `<component :is="Component">` 上添加 `:key="$route.fullPath"`，强制每次路由变化时销毁重建组件；
- 这样所有详情页和相关推荐的导航都能正常工作。

## 7. AI 协作记录

- **AI 工具**：opencode

- **核心提示词**（按会话阶段概括）：
  - "请帮我创建用户个人/设置页面 —— 对 UserCenterView 重构、新增 SettingsView"
  - "请帮我完成各个页面的图片渲染工作"
  - "帮我实现登录注册，要求基于 JSON Server Mock API，不得引入 JWT、OAuth 等真实认证方案"
  - "PublishView 未登录拦截"、"UserCenterView 未登录提示"、"SettingsView 未登录跳转"
  - "点击后还是不能跳转，是没有添加路由的原因吗"（相关推荐导航修复）

- **AI 生成的内容**：
  - SettingsView.vue 完整组件（form 表单、save/reset 逻辑、avatar 占位）；
  - UserCenterView.vue 的 sidebar + content 重构（用户信息卡片、菜单、内容区）；
  - LoginView.vue 和 RegisterView.vue 的完整实现（表单校验、API 调用、路由跳转）；
  - stores/user.ts 的重写（login / logout / restoreLogin / updateProfile + localStorage 持久化）；
  - App.vue 的 restoreLogin 调用；
  - AppHeader.vue 的登录/注册按钮和用户下拉菜单；
  - PublishView / UserCenterView / SettingsView 的登录拦截逻辑；
  - AppLayout.vue 的 `:key` 修复。

- **AI 生成内容中的不合理之处及修改**：
  1. **currentUser 类型设计**：AI 最初将 `currentUser` 定义为 `AppUser`（非空），但 SettingsView 需要处理未登录场景。修改为 `AppUser | null`，并在所有访问处使用非空断言 `!`。
  2. **UserCenterView 模板结构**：AI 最初在外层 `<template v-else>` 后没有正确闭合，导致模板结构嵌套错误。手动添加了 `</template>` 闭合标签。
  3. **注册逻辑实现**：AI 生成注册时没有区分重复用户名判断和实际写入。手动调整为先查询再写入，确保数据一致性。
  4. **相关推荐不跳转**：AI 最初没有考虑到 Vue Router 组件复用导致 `onMounted` 不触发的问题。用户反馈后，AI 识别出问题并给出 `:key` 方案。
  5. **TypeScript 编译错误**：`currentUser` 改为 `AppUser | null` 后，SettingsView 和 UserCenterView 中的属性访问报 TS18047。AI 通过添加非空断言 `userStore.currentUser!` 修复。

- **自己保留、修改或删除的内容**：
  - 保留了 AI 生成的完整登录注册 UI 和 API 逻辑；
  - 保留了 Pinia + localStorage 持久化方案；
  - 修改了模板结构问题和类型安全；
  - 删除了 AI 生成的一些无关注释；
  - 删除了 AI 建议的 JWT 相关实现（不符合 Mock 要求）；
  - 在 `PublishView` 中将登录检查从步骤 1 移动到 `handleSubmit`，让用户可以浏览表单再要求登录。

## 8. 功能边界说明

本项目注册/登录功能基于 **JSON Server + Pinia + localStorage** 实现，仅用于前端实训和状态管理模拟，**不是生产环境安全认证系统**。

### 本项目未实现

- ❌ 密码加密（密码以明文存储和传输）；
- ❌ JWT Token 认证；
- ❌ 路由守卫（`beforeEach` 只设置了页面标题，未做权限校验）；
- ❌ 短信验证码；
- ❌ 找回密码功能；
- ❌ 后端安全校验（JSON Server 无业务逻辑，任何人都可以读取 users 资源）；
- ❌ 会话超时管理；
- ❌ 防止 XSS / CSRF 攻击；
- ❌ HTTPS 传输加密。

### 已知局限性

- 任何人都可以通过浏览器开发者工具查看 localStorage 中的用户信息；
- 任何人都可以直接请求 `http://localhost:3002/users` 获取所有用户数据（包括密码）；
- 登录状态仅基于前端 localStorage 判断，不存在真实的会话 Token；
- 退出登录仅清除前端状态，不会通知"后端"失效。

### 适用场景

- 前端课程实训中的状态管理练习；
- Pinia + localStorage 持久化模式的技术验证；
- 展示登录/注册 UI 交互流程的 Demo 项目。

## 9. 完整功能走查记录

以下是一次完整的真实操作记录：

### 前提条件
- 终端 1 已启动：`pnpm mock`（JSON Server 运行在 http://localhost:3002）
- 终端 2 已启动：`pnpm dev`（Vite 开发服务器运行在 http://localhost:5173）

### 操作步骤

**第 1 步：启动服务**
- 打开两个终端，分别运行 `pnpm mock` 和 `pnpm dev`。
- 浏览器访问 http://localhost:5173，首页正常加载，导航栏右上角显示"登录"和"注册"按钮。

**第 2 步：注册新用户**
- 点击导航栏"注册"按钮，跳转到 `/register`。
- 填写表单：
  - 用户名：testuser
  - 密码：test123
  - 显示名称：测试用户
  - 学院：软件学院
  - 年级：2024级
- 点击"注册"按钮。
- 系统提示"注册成功"，自动跳转到登录页。

**第 3 步：检查 db.json 中是否新增用户**
- 打开浏览器开发者工具 → 网络面板，或者直接请求 `http://localhost:3002/users`。
- 返回的 users 数组中包含 `testuser` 用户记录，包括用户名、密码、显示名称、学院、年级字段。数据已成功写入 Mock 数据库。

**第 4 步：使用新用户登录**
- 在登录页输入用户名 `testuser` 和密码 `test123`。
- 点击"登录"按钮。
- 登录成功，跳转到首页。
- 导航栏右下角显示"测试用户"和下拉菜单。

**第 5 步：刷新页面，检查登录状态是否保留**
- 按 F5 刷新浏览器。
- 页面重新加载后，导航栏仍然显示"测试用户"和下拉菜单，说明 localStorage 持久化生效。

**第 6 步：发布一条信息**
- 点击导航栏"发布信息"，跳转到 `/publish`。
- 选择"二手交易"类型，点击"下一步"。
- 填写商品信息：标题"测试商品"、描述"这是一条测试发布信息"、价格 100、位置"东区"。
- 在步骤 2 中填写图片链接：`https://picsum.photos/200`
- 点击"提交"按钮。
- 系统提示"发布成功"，跳转到二手交易列表页，新商品显示在列表中，发布人显示为"测试用户"。

**第 7 步：搜索二手交易信息**
- 在二手交易列表页顶部的搜索框中输入"测试"。
- 点击搜索按钮或按回车。
- 列表过滤为仅包含"测试商品"的结果。搜索功能正常工作。

**第 8 步：收藏一条信息**
- 点击刚才发布的"测试商品"进入详情页。
- 点击"收藏"按钮，按钮变为黄色"已收藏"。
- 收藏状态更新正常。

**第 9 步：进入个人中心查看收藏**
- 点击导航栏用户名 → 下拉菜单 → 个人中心。
- 默认显示"我的收藏"标签页，刚收藏的"测试商品"显示在收藏列表中。
- 切换到"我的发布"标签页，刚发布的"测试商品"显示在发布列表中。

**第 10 步：退出登录**
- 点击导航栏用户名 → 下拉菜单 → 退出登录。
- 系统提示"已退出登录"，跳转到首页。
- 导航栏恢复为显示"登录"和"注册"按钮。

**第 11 步：再进入个人中心，检查是否提示登录**
- 点击"个人中心"链接或直接访问 `/user`。
- 页面显示居中卡片："请先登录，登录后可以查看个人资料、我的收藏和我的发布。"并附带"去登录"按钮。
- 未登录拦截正常工作。

**第 12 步：点击相关推荐验证导航修复**
- 使用已有账号登录（student / 123456）。
- 访问一个二手商品详情页（如 `/trade/1`）。
- 在页面底部的"相关推荐"区域点击另一件商品。
- 页面跳转到对应商品的详情页，内容正确加载。此前存在的"点击后页面不刷新"问题已修复。

## 10. 遇到的问题与解决方法

### 问题 1：currentUser 类型为 null 导致 TypeScript 编译错误

**现象**：将 `userStore.currentUser` 的类型从 `AppUser` 改为 `AppUser | null` 后，SettingsView.vue 和 UserCenterView.vue 中的表单初始化代码报错 `TS18047: 'userStore.currentUser' is possibly 'null'`，涉及 20 多处属性访问。

**原因**：TypeScript 严格模式下，联合类型中的 `null` 需要在访问属性前进行收窄。SettingsView 的 `form` 引用初始化在模块作用域（非条件块内），TypeScript 无法推断出登录检查后的非空状态。

**解决**：在提取默认值时使用非空断言赋值给局部常量：
```ts
const cu = userStore.currentUser!
const editForm = ref({
  name: cu.name,
  college: cu.college,
  grade: cu.grade,
  campus: cu.campus || '',
  contact: cu.contact || '',
  bio: cu.bio,
})
```
同时在 `syncEditForm` 中也使用局部常量加 `!` 断言。这样既满足 TypeScript 类型检查，又在运行时保证安全（因为组件模板中已有 `v-if` 守卫，且 SettingsView 的 `onMounted` 会重定向）。

### 问题 2：相关推荐点击后 URL 变化但页面不刷新

**现象**：在商品详情页底部"相关推荐"中点击任意商品，浏览器的 URL 从 `/trade/1` 变为 `/trade/2`，但页面仍然显示第一个商品的数据。

**原因**：`/trade/:id` 匹配的是同一个组件 `TradeDetailView`，Vue Router 默认复用组件实例，`onMounted` 只会在组件首次挂载时执行一次，不会在参数变化时再次执行。所有 4 个详情页都有同样的问题。

**解决**：在 `AppLayout.vue` 的 `<component>` 上添加 `:key="$route.fullPath"`，让 Vue 在路由的 `fullPath` 变化时强制销毁并重建组件。这样每次导航到不同的详情页（或同一组件不同参数）时，`onMounted` 都会重新触发，数据正确加载。修复后 type-check 和 build 均通过。

### 问题 3：注册时 JSON Server 返回空数组与数据不一致

**现象**：注册新用户后，`db.json` 文件中文件内容可能因为编码问题没有正确写入中文（前期遇到过一次 `Get-Content` 读取中文乱码的问题）。

**原因**：前期使用 PowerShell 的 `Get-Content` 读取 db.json 时未指定 UTF-8 编码，导致数据显示为乱码。实际上 JSON Server 写入时使用了 UTF-8 编码，数据本身是正确的，只是命令行读取的问题。

**解决**：使用 `Get-Content -Encoding UTF8` 读取文件，确认数据实际写入正确。同时使用 `pnpm build-only` 验证前端构建无误。

## 11. 今日反思

通过今天补充注册/登录功能，我对"用户状态""状态持久化"和"前端 Mock 认证边界"有了更具体的认识。

首先是**注册登录**流程的前端实现。虽然只是一个基于 JSON Server 的 Mock 系统，但它让我完整走通了从"表单收集 → API 调用 → 状态存储 → 界面更新"的全链路。注册时需要通过查询接口做重复性校验（`GET /users?username=xxx`），而不仅仅是无脑 POST，这让我意识到即使是最基础的注册功能也需要考虑"数据完整性"问题。登录时使用 `GET` 查询来做密码校验虽然不安全，但很好地展示了"API 查询结果驱动 UI 状态变化"的编程模式。

其次是**状态持久化**的意义。在之前的版本中，所有数据都存储在 Pinia 中，刷新页面就会丢失登录状态。引入 localStorage 后，登录状态可以在页面刷新后恢复，用户体验有了质的提升。但我也清楚地看到了这种方案的局限性——localStorage 中的数据以明文形式暴露在浏览器中，任何人都可以通过 F12 → Application → Local Storage 查看甚至修改用户信息。这不是安全的认证方案，只是前端状态管理的一种补救措施。在实际生产项目中，应当由后端发放签名过的 JWT Token，存储于 HttpOnly Cookie 中，并通过后端 Session 进行验证。

最后是**交互优化**方面的收获。今天我抽取了 LoadingState、ErrorState、SearchBar 三个公共组件，让 4 个列表页和 4 个详情页的加载/错误/搜索体验保持了一致。发布按钮的提交中状态防止了重复提交，收藏按钮的已收藏样式提供了即时反馈。这些小优化虽然改动不大，但对用户体验的提升是很明显的。我还修复了相关推荐点击后页面不刷新的 bug——这个问题的根因是 Vue Router 的组件复用机制，通过在 `<RouterView>` 上添加 `:key` 强制重建组件，用最少的代码解决了全局性的路由导航问题。

总的来说，今天的开发让我深刻认识到：前端的"登录认证"不仅是 UI 交互层面的展示，更涉及状态管理、数据持久化、组件联动和边界情况处理等多个方面。虽然我们的方案离生产级安全认证还有很远的距离，但作为前端状态管理实训项目，它已经足够说明问题。明确功能边界同样重要——知道什么能做、什么不能做，才能在文档和代码中诚实地表达系统的真实能力。
