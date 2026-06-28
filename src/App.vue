<script setup lang="ts"></script>

<template>
  <main class="app">
    <!-- Element Plus 进阶导航菜单 -->
    <el-menu mode="horizontal" router class="nav-box">
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/list">集市列表</el-menu-item>
      <el-menu-item index="/publish">发布信息</el-menu-item>
      <el-menu-item index="/message">消息中心</el-menu-item>
      <el-menu-item index="/user">个人中心</el-menu-item>
      <el-menu-item index="/chart">趋势看板</el-menu-item>
    </el-menu>

    <h1>校园轻集市</h1>
    <p>AI 辅助前端工程实践种子项目</p>
    <router-view />
  </main>
</template>

<style scoped>
.app {
  padding: 32px;
}

.nav-box {
  margin-bottom: 20px;
}
</style>
