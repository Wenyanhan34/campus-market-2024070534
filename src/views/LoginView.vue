<template>
  <div class="auth-page">
    <el-card shadow="never" class="auth-card">
      <h1 class="auth-title">登录校园轻集市</h1>
      <p class="auth-desc">登录后可以发布信息、收藏内容并进入个人中心。</p>

      <el-form label-position="top" class="auth-form" @submit.prevent="handleLogin">
        <el-form-item label="用户名" :error="errors.username" required>
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="密码" :error="errors.password" required>
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>

        <p v-if="loginError" class="login-error">{{ loginError }}</p>

        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="submitting" class="submit-btn">
            {{ submitting ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <p class="auth-switch">
        还没有账号？
        <router-link to="/register">去注册</router-link>
      </p>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const submitting = ref(false)
const loginError = ref('')

const form = reactive({
  username: '',
  password: '',
})

const errors = reactive<Record<string, string>>({})

function clearErrors() {
  for (const k of Object.keys(errors)) {
    errors[k] = ''
  }
  loginError.value = ''
}

function validateForm(): boolean {
  clearErrors()
  let valid = true
  if (!form.username) { errors.username = '请输入用户名'; valid = false }
  if (!form.password) { errors.password = '请输入密码'; valid = false }
  return valid
}

async function handleLogin() {
  if (!validateForm()) return

  submitting.value = true
  try {
    await userStore.login(form.username, form.password)
    ElMessage.success('登录成功')
    router.push('/user')
  } catch {
    loginError.value = '账号或密码错误'
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

.login-error {
  margin: 0;
  color: var(--color-danger);
  font-size: 14px;
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
