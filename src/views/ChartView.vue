<template>
  <el-card title="集市趋势看板">
    <el-row :gutter="20">
      <el-col span="6">
        <el-statistic title="今日发布商品" value="128" />
      </el-col>
      <el-col span="6">
        <el-statistic title="总浏览量" value="3652" />
      </el-col>
      <el-col span="6">
        <el-statistic title="成交订单" value="46" />
      </el-col>
      <el-col span="6">
        <el-statistic title="在线用户" value="213" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts"></script>

<style scoped>
.el-card {
  margin: 20px;
}
.el-row {
  margin-top: 20px;
}
</style>
