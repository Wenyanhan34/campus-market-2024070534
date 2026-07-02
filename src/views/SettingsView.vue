<template>
  <div class="page">
    <el-breadcrumb separator="/" style="margin-bottom:24px;">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/user' }">个人中心</el-breadcrumb-item>
      <el-breadcrumb-item>账号设置</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card shadow="never" class="settings-card">
      <h2 class="settings-title">账号设置</h2>

      <div class="avatar-wrap">
        <el-avatar :size="90">
          {{ userStore.userInitial }}
        </el-avatar>
        <div style="margin-top:8px;">
          <el-button text size="small" type="primary" style="color:#0d9488;" disabled>
            更换头像
          </el-button>
        </div>
      </div>

      <el-form label-width="90px" class="settings-form">
        <el-form-item label="昵称">
          <el-input v-model="form.name" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="学院">
          <el-input v-model="form.college" placeholder="如：计算机学院" />
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="form.grade" placeholder="如：2023 级" />
        </el-form-item>
        <el-form-item label="校区">
          <el-radio-group v-model="form.campus">
            <el-radio-button value="east">东区</el-radio-button>
            <el-radio-button value="west">西区</el-radio-button>
            <el-radio-button value="south">南区</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份角色">
          <el-select v-model="form.role" placeholder="选择角色" style="width:100%;">
            <el-option label="学生" value="student" />
            <el-option label="教职工" value="staff" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.contact" placeholder="微信 / 手机号" />
        </el-form-item>
        <el-form-item label="个人简介">
          <el-input v-model="form.bio" type="textarea" :rows="3" placeholder="简单介绍一下自己" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="save-btn" @click="save">保存修改</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <div class="settings-notice">
        <el-icon><InfoFilled /></el-icon>
        本项目为前端实训项目，不接入真实登录认证系统。所有用户信息仅保存在本地状态中，刷新页面后将恢复默认值。
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const form = ref({
  name: userStore.currentUser.name,
  college: userStore.currentUser.college,
  grade: userStore.currentUser.grade,
  campus: userStore.currentUser.campus,
  role: userStore.currentUser.role,
  contact: userStore.currentUser.contact,
  bio: userStore.currentUser.bio,
})

function save() {
  userStore.updateProfile(form.value)
  ElMessage.success('设置已保存')
}

function reset() {
  form.value = {
    name: userStore.currentUser.name,
    college: userStore.currentUser.college,
    grade: userStore.currentUser.grade,
    campus: userStore.currentUser.campus,
    role: userStore.currentUser.role,
    contact: userStore.currentUser.contact,
    bio: userStore.currentUser.bio,
  }
  ElMessage.info('已重置')
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
}

.settings-card {
  max-width: 640px;
  margin: 0 auto;
  border-radius: var(--radius-lg);
  width: 100%;
}

.settings-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px;
  text-align: center;
}

.avatar-wrap {
  text-align: center;
  margin-bottom: 24px;
}

.settings-form {
  max-width: 480px;
  margin: 0 auto;
}

.save-btn {
  background: #0d9488;
  border-color: #0d9488;
}

.save-btn:hover {
  background: #0f766e;
  border-color: #0f766e;
}

.settings-notice {
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.8;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.settings-notice .el-icon {
  margin-top: 3px;
  flex-shrink: 0;
}
</style>
