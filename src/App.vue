<script setup lang="ts"></script>

<template>
  <main class="app">
    <!-- 新增导航菜单 -->
    <nav class="nav-box">
      <router-link to="/">首页</router-link>
      <router-link to="/list">集市列表</router-link>
      <router-link to="/publish">发布信息</router-link>
      <router-link to="/message">消息中心</router-link>
      <router-link to="/user">个人中心</router-link>
      <router-link to="/chart">趋势看板</router-link>
    </nav>

    <h1>校园轻集市</h1>
    <p>AI 辅助前端工程实践种子项目</p>
    <routerView />
  </main>
</template>

<style scoped>
.app {
  padding: 32px;
}
/* 导航栏样式 */
.nav-box {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}
.nav-box a {
  margin: 0 10px;
  text-decoration: none;
  color: #333;
  font-size: 16px;
}
/* 当前访问页面高亮蓝色 */
.nav-box a.router-link-active {
  color: #409eff;
  font-weight: bold;
}
</style>
