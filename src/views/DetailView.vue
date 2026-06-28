<template>
  <el-card title="商品详情页面">
    <p>当前浏览商品ID：{{ $route.params.id }}</p>
    <p>这里可以展示商品图片、价格、描述等信息</p>
  </el-card>
</template>

<script setup lang="ts"></script>

<style scoped>
.el-card {
  margin: 20px;
}
</style>
