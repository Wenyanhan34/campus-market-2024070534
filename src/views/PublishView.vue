<template>
  <div class="page">
    <div class="page-header">
      <h1>发布信息</h1>
      <p class="page-desc">选择发布类型，填写相关信息</p>
    </div>

    <el-card shadow="never" class="form-card">
      <el-form label-width="100px" label-position="top">
        <el-form-item label="发布类型">
          <el-radio-group v-model="publishType">
            <el-radio-button value="trade">二手商品</el-radio-button>
            <el-radio-button value="lost">失物招领</el-radio-button>
            <el-radio-button value="group">拼单搭子</el-radio-button>
            <el-radio-button value="errand">跑腿委托</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="标题">
          <el-input v-model="formData.title" placeholder="请输入标题" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="formData.desc" type="textarea" :rows="4" placeholder="请详细描述..." />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系方式">
              <el-input v-model="formData.contact" placeholder="微信 / 手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地点">
              <el-input v-model="formData.location" placeholder="交易/见面地点" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="图片">
          <el-upload action="#" list-type="picture-card" :auto-upload="false">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" @click="handleSubmit">发布</el-button>
          <el-button size="large">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const publishType = ref('trade')

const formData = reactive({
  title: '',
  desc: '',
  contact: '',
  location: '',
})

function handleSubmit() {
  ElMessage.success('发布成功！（演示功能，数据未实际提交）')
}
</script>

<style scoped>
.page { padding: 0; }

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0 0 4px;
  font-size: 22px;
  color: #1f2937;
}

.page-desc {
  margin: 0;
  color: #9ca3af;
  font-size: 14px;
}

.form-card {
  border-radius: 12px;
  max-width: 760px;
}
</style>
