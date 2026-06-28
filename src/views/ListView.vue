<template>
  <el-card title="集市商品列表">
    <el-list>
      <el-list-item v-for="item in goodsList" :key="item.id">
        <span>商品{{ item.id }}：{{ item.name }}</span>
        <router-link :to="`/detail/${item.id}`" style="margin-left:20px">查看详情</router-link>
      </el-list-item>
    </el-list>
  </el-card>
</template>

<script setup lang="ts">
// 模拟商品静态数据
const goodsList = [
  { id: 1, name: "二手教材" },
  { id: 2, name: "电竞鼠标" },
  { id: 3, name: "宿舍小台灯" }
]
</script>

<style scoped>
.el-card {
  margin: 20px;
}
</style>
