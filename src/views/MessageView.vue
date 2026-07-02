<template>
  <div class="page">
    <div class="message-layout">
      <div class="msg-sidebar">
        <div class="sidebar-title">消息列表</div>
        <div class="contact-list">
          <div
            v-for="(conv, idx) in store.conversations"
            :key="conv.name"
            class="contact-item"
            :class="{ active: activeIndex === idx }"
            @click="switchConversation(idx)"
          >
            <el-avatar :size="44" class="contact-avatar">{{ conv.name.charAt(0) }}</el-avatar>
            <div class="contact-info">
              <div class="contact-name">{{ conv.name }}</div>
              <div class="contact-preview">{{ conv.lastMsg }}</div>
            </div>
            <div class="contact-right">
              <div class="contact-time">{{ conv.time }}</div>
              <el-badge v-if="conv.unread" :value="conv.unread" class="unread-badge" />
            </div>
          </div>
        </div>
      </div>

      <div class="chat-area">
        <div class="chat-header">
          <div class="chat-header-left">
            <el-avatar :size="36" class="chat-avatar">{{ currentConv.name.charAt(0) }}</el-avatar>
            <span class="chat-name">{{ currentConv.name }}</span>
          </div>
          <el-button text size="small" @click="openFullChat">
            <el-icon><FullScreen /></el-icon> 全屏聊天
          </el-button>
        </div>

        <div ref="chatBodyRef" class="chat-messages">
          <div
            v-for="(msg, idx) in currentConv.messages"
            :key="idx"
            class="msg-row"
            :class="{ 'msg-me': msg.isMe }"
          >
            <div class="msg-bubble-wrap">
              <div class="msg-bubble">{{ msg.text }}</div>
              <div class="msg-time">{{ msg.time }}</div>
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <el-input
            v-model="inputText"
            placeholder="输入消息..."
            class="chat-input"
            @keyup.enter="sendMessage"
          />
          <el-button type="primary" class="send-btn" :disabled="!inputText.trim()" @click="sendMessage">
            发送
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'

const router = useRouter()
const store = useMessageStore()
const activeIndex = ref(0)
const inputText = ref('')
const chatBodyRef = ref<HTMLElement>()

const currentConv = computed(() => store.conversations[activeIndex.value] || store.conversations[0]!)

function scrollToBottom() {
  nextTick(() => {
    const el = chatBodyRef.value
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
}

function switchConversation(idx: number) {
  activeIndex.value = idx
  const conv = store.conversations[idx]
  if (conv) store.clearUnread(conv.name)
  scrollToBottom()
}

function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  const conv = store.conversations[activeIndex.value]
  if (!conv) return

  store.sendMessage(conv.name, text)
  inputText.value = ''
  scrollToBottom()

  setTimeout(() => {
    store.replyMessage(conv.name)
    scrollToBottom()
  }, 1200 + Math.random() * 800)
}

function openFullChat() {
  if (!currentConv.value) return
  router.push(`/chat/${encodeURIComponent(currentConv.value.name)}`)
}
</script>

<style scoped>
.page {
  padding: 0;
  height: calc(100vh - var(--header-height) - 56px);
}

.message-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
  height: 100%;
}

.msg-sidebar {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
}

.sidebar-title {
  padding: 16px 18px;
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border-light);
}

.contact-list {
  flex: 1;
  overflow-y: auto;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  cursor: pointer;
  transition: background var(--transition-fast);
  border-bottom: 1px solid var(--color-border-light);
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-item:hover {
  background: var(--color-bg);
}

.contact-item.active {
  background: #f0fdfa;
}

.contact-avatar {
  flex-shrink: 0;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 700;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contact-preview {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contact-right {
  text-align: right;
  flex-shrink: 0;
}

.contact-time {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.unread-badge {
  display: inline-block;
}

.chat-area {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
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
}

.chat-name {
  font-weight: 600;
  color: var(--color-text);
  font-size: 15px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: var(--color-bg);
}

.msg-row {
  display: flex;
  margin-bottom: 16px;
}

.msg-row.msg-me {
  justify-content: flex-end;
}

.msg-bubble-wrap {
  max-width: 60%;
}

.msg-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
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

.chat-input-area {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid var(--color-border-light);
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
}

.chat-input :deep(.el-input__wrapper) {
  border-radius: var(--radius-md);
}

.send-btn {
  flex-shrink: 0;
  font-weight: 500;
}

@media (max-width: 768px) {
  .page {
    height: auto;
  }
  .message-layout {
    grid-template-columns: 1fr;
  }
  .msg-sidebar {
    max-height: 200px;
  }
  .msg-bubble-wrap {
    max-width: 80%;
  }
}
</style>
