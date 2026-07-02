<template>
  <div class="auth-page">
    <el-card shadow="never" class="auth-card">
      <h1 class="auth-title">注册校园轻集市账号</h1>
      <p class="auth-desc">创建账号后，可以发布信息、收藏内容并进入个人中心。</p>

      <el-form label-position="top" class="auth-form" @submit.prevent="handleRegister">
        <el-form-item label="用户名" :error="errors.username" required>
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" :error="errors.password" required>
          <el-input v-model="form.password" type="password" placeholder="请输入密码（至少6位）" show-password />
        </el-form-item>

        <el-form-item label="姓名" :error="errors.name" required>
          <el-input v-model="form.name" placeholder="请输入显示名称" />
        </el-form-item>

        <el-form-item label="学院" :error="errors.college" required>
          <el-input v-model="form.college" placeholder="例如：计算机学院" />
        </el-form-item>

        <el-form-item label="年级" :error="errors.grade" required>
          <el-input v-model="form.grade" placeholder="例如：2023级" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="submitting" class="submit-btn">
            {{ submitting ? '注册中...' : '注册' }}
          </el-button>
        </el-form-item>
      </el-form>

      <p class="auth-switch">
        已有账号？
        <router-link to="/login">去登录</router-link>
      </p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createUser, getUsers } from '@/api/user'

const router = useRouter()
const submitting = ref(false)

const form = reactive({
  username: '',
  password: '',
  name: '',
  college: '',
  grade: '',
})

const errors = reactive<Record<string, string>>({})

function clearErrors() {
  for (const k of Object.keys(errors)) {
    errors[k] = ''
  }
}

function validateForm(): boolean {
  clearErrors()
  let valid = true

  if (!form.username) { errors.username = '请输入用户名'; valid = false }
  if (!form.password) { errors.password = '请输入密码'; valid = false }
  else if (form.password.length < 6) { errors.password = '密码长度不能少于6位'; valid = false }
  if (!form.name) { errors.name = '请输入姓名'; valid = false }
  if (!form.college) { errors.college = '请输入学院'; valid = false }
  if (!form.grade) { errors.grade = '请输入年级'; valid = false }

  return valid
}

async function handleRegister() {
  if (!validateForm()) return

  submitting.value = true
  try {
    const res = await getUsers()
    const exists = res.data.some((u) => u.username === form.username)
    if (exists) {
      errors.username = '用户名已存在'
      return
    }

    await createUser({
      username: form.username,
      password: form.password,
      name: form.name,
      college: form.college,
      grade: form.grade,
      avatar: '',
      bio: '这个同学还没有填写个人简介。',
    })

    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch {
    ElMessage.error('注册失败，请确认 JSON Server 已启动')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - var(--header-height) - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  width: 440px;
  padding: 8px;
  border-radius: var(--radius-lg);
}

.auth-title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  text-align: center;
}

.auth-desc {
  margin: 0 0 24px;
  color: var(--color-text-muted);
  font-size: 14px;
  text-align: center;
  line-height: 1.6;
}

.auth-form {
  max-width: 360px;
  margin: 0 auto;
}

.submit-btn {
  width: 100%;
}

.auth-switch {
  margin: 16px 0 0;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 14px;
}

.auth-switch a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.auth-switch a:hover {
  text-decoration: underline;
}
</style>
