<template>
  <div class="page chat-page">
    <div class="chat-container">
      <div class="chat-header">
        <div class="chat-header-left">
          <el-button text circle @click="$router.push('/message')">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <el-avatar :size="40" class="chat-avatar">{{ contactName.charAt(0) }}</el-avatar>
          <div>
            <div class="chat-contact-name">{{ contactName }}</div>
            <div class="chat-status">在线</div>
          </div>
        </div>
      </div>

      <div ref="chatBodyRef" class="chat-body">
        <div class="chat-date-divider">{{ dateLabel }}</div>

        <div v-if="itemInfo" class="chat-item-card">
          <div class="chat-item-img">
            <el-icon :size="24"><Goods /></el-icon>
          </div>
          <div class="chat-item-info">
            <div class="chat-item-title">{{ itemInfo.name }}</div>
            <div class="chat-item-price" v-if="itemInfo.price">¥{{ itemInfo.price }}</div>
          </div>
        </div>

        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          class="msg-row"
          :class="{ 'msg-me': msg.isMe }"
        >
          <el-avatar v-if="!msg.isMe" :size="36" class="msg-avatar">{{ contactName.charAt(0) }}</el-avatar>
          <el-avatar v-else :size="36" class="msg-avatar msg-avatar-me">我</el-avatar>
          <div class="msg-content">
            <div class="msg-bubble">{{ msg.text }}</div>
            <div class="msg-time">{{ msg.time }}</div>
          </div>
        </div>
      </div>

      <div class="chat-bottom">
        <el-input
          v-model="inputText"
          placeholder="输入消息..."
          class="chat-input"
          @keyup.enter="sendMessage"
        >
          <template #prefix>
            <el-icon><EditPen /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" class="send-btn" :disabled="!inputText.trim()" @click="sendMessage">
          <el-icon><Promotion /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'

const route = useRoute()
const router = useRouter()
const store = useMessageStore()

const inputText = ref('')
const chatBodyRef = ref<HTMLElement>()

const contactName = computed(() => {
  const name = route.params.contact as string
  return decodeURIComponent(name || '未知用户')
})

const itemInfo = computed(() => {
  const item = route.query.item as string
  const price = route.query.price as string
  if (!item) return null
  return { name: decodeURIComponent(item), price }
})

const dateLabel = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
})

const messages = computed(() => {
  const conv = store.conversationByName(contactName.value)
  return conv?.messages || []
})

function scrollToBottom() {
  nextTick(() => {
    const el = chatBodyRef.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
}

function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  store.sendMessage(contactName.value, text)
  inputText.value = ''
  scrollToBottom()

  setTimeout(() => {
    store.replyMessage(contactName.value)
    scrollToBottom()
  }, 1200 + Math.random() * 800)
}

onMounted(() => {
  if (!route.params.contact) {
    router.replace('/message')
    return
  }
  store.ensureConversation(contactName.value)
  scrollToBottom()
})
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height) - 56px);
  padding: 0;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid var(--color-border-light);
  flex-shrink: 0;
}

.chat-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-avatar {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 700;
  flex-shrink: 0;
}

.chat-contact-name {
  font-weight: 600;
  color: var(--color-text);
  font-size: 15px;
}

.chat-status {
  font-size: 12px;
  color: var(--color-success);
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  background: var(--color-bg);
}

.chat-date-divider {
  text-align: center;
  color: var(--color-text-muted);
  font-size: 12px;
  margin-bottom: 16px;
}

.chat-item-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-bg-white);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 1px solid var(--color-border);
}

.chat-item-img {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  border-radius: var(--radius-sm);
  color: var(--color-primary);
  flex-shrink: 0;
}

.chat-item-info {
  flex: 1;
  min-width: 0;
}

.chat-item-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-item-price {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-danger);
  margin-top: 2px;
}

.msg-row {
  display: flex;
  margin-bottom: 18px;
  gap: 10px;
  align-items: flex-end;
}

.msg-row.msg-me {
  flex-direction: row-reverse;
}

.msg-avatar {
  flex-shrink: 0;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 700;
}

.msg-avatar-me {
  background: var(--color-primary);
  color: #fff;
}

.msg-content {
  max-width: 55%;
}

.msg-bubble {
  padding: 10px 14px;
  border-radius: var(--radius-md);
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

.msg-row:not(.msg-me) .msg-bubble {
  background: var(--color-bg-white);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  border-bottom-left-radius: 4px;
}

.msg-row.msg-me .msg-bubble {
  background: var(--color-primary);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.msg-time {
  font-size: 11px;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.msg-row.msg-me .msg-time {
  text-align: right;
}

.chat-bottom {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid var(--color-border-light);
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
}

.chat-input :deep(.el-input__wrapper) {
  border-radius: var(--radius-xl);
  background: var(--color-bg);
}

.send-btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 18px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .msg-content {
    max-width: 75%;
  }
  .chat-page {
    height: calc(100vh - var(--header-height) - 24px);
  }
}
</style>
