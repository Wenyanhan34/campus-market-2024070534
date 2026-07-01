<template>
  <div class="page">
    <div class="page-header">
      <h1>消息中心</h1>
    </div>

    <el-card shadow="never" class="message-card">
      <div class="message-layout">
        <div class="msg-sidebar">
          <div class="sidebar-header">
            <el-input
              v-model="searchContact"
              placeholder="搜索联系人..."
              :prefix-icon="Search"
              size="small"
              clearable
            />
          </div>
          <div class="contact-list">
            <div
              v-for="contact in filteredContacts"
              :key="contact.name"
              class="contact-item"
              :class="{ active: activeContact === contact.name }"
              @click="activeContact = contact.name"
            >
              <el-avatar :size="40" class="contact-avatar">
                {{ contact.name[0] }}
              </el-avatar>
              <div class="contact-info">
                <div class="contact-top">
                  <span class="contact-name">{{ contact.name }}</span>
                  <span class="contact-time">{{ contact.time }}</span>
                </div>
                <p class="contact-preview">{{ contact.text }}</p>
              </div>
              <span v-if="contact.unread" class="unread-badge">{{ contact.unread }}</span>
            </div>
          </div>
        </div>

        <div class="msg-content-area">
          <el-tabs v-model="activeTab" class="msg-tabs">
            <el-tab-pane label="私信" name="private">
              <div v-if="activeContact" class="conversation">
                <div class="conv-header">
                  <el-avatar :size="36">{{ activeContact[0] }}</el-avatar>
                  <span class="conv-name">{{ activeContact }}</span>
                </div>
                <div class="conv-messages">
                  <div class="msg-bubble received">
                    <p>你好！{{ privateMsgs.find(m => m.name === activeContact)?.text }}</p>
                    <span class="bubble-time">{{ privateMsgs.find(m => m.name === activeContact)?.time }}</span>
                  </div>
                  <div class="msg-bubble sent">
                    <p>好的，了解 👌</p>
                    <span class="bubble-time">刚刚</span>
                  </div>
                </div>
                <div class="conv-input">
                  <el-input placeholder="输入消息..." size="large" />
                  <el-button type="primary" round>发送</el-button>
                </div>
              </div>
              <EmptyState v-else text="选择一个联系人开始聊天" />
            </el-tab-pane>

            <el-tab-pane label="系统通知" name="system">
              <div v-for="notif in notifications" :key="notif.title" class="msg-item">
                <el-avatar :size="44" icon="Bell" class="sys-avatar" />
                <div class="msg-content">
                  <div class="msg-top">
                    <span class="msg-name">{{ notif.title }}</span>
                    <span class="msg-time">{{ notif.time }}</span>
                  </div>
                  <p class="msg-text">{{ notif.text }}</p>
                </div>
              </div>
              <EmptyState v-if="notifications.length === 0" text="暂无系统通知" />
            </el-tab-pane>

            <el-tab-pane label="互动消息" name="interact">
              <div v-for="item in interactions" :key="item.text" class="msg-item">
                <el-avatar :size="44" icon="ChatDotSquare" class="interact-avatar" />
                <div class="msg-content">
                  <div class="msg-top">
                    <span class="msg-time">{{ item.time }}</span>
                  </div>
                  <p class="msg-text">{{ item.text }}</p>
                </div>
              </div>
              <EmptyState v-if="interactions.length === 0" text="暂无互动消息" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import EmptyState from '@/components/EmptyState.vue'

const activeTab = ref('private')
const activeContact = ref('张三')
const searchContact = ref('')

const privateMsgs = ref([
  { name: '张三', text: '请问那个教材还在吗？', time: '10:32', unread: 1 },
  { name: '李四', text: '拼单还差一个人，来吗？', time: '昨天', unread: 2 },
  { name: '王五', text: '收到，明天下午见', time: '周一', unread: 0 },
])

const filteredContacts = computed(() => {
  if (!searchContact.value.trim()) return privateMsgs.value
  const q = searchContact.value.trim().toLowerCase()
  return privateMsgs.value.filter(c => c.name.toLowerCase().includes(q))
})

const notifications = ref([
  { title: '系统通知', text: '您的二手商品"高等数学教材"已被浏览12次', time: '2026-06-28' },
  { title: '系统通知', text: '失物招领有新匹配，请查看', time: '2026-06-27' },
])

const interactions = ref([
  { text: '用户 student02 收藏了您的商品', time: '2026-06-26' },
])
</script>

<style scoped>
.page { padding: 0; }

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: var(--color-text);
  font-weight: 700;
}

.message-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  padding: 0;
}

.message-layout {
  display: flex;
  min-height: 480px;
}

/* Sidebar */
.msg-sidebar {
  width: 300px;
  border-right: 1px solid var(--color-border);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
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
  padding: 14px 16px;
  cursor: pointer;
  transition: background var(--transition-fast);
  position: relative;
}

.contact-item:hover {
  background: var(--color-bg);
}

.contact-item.active {
  background: var(--color-primary-light);
}

.contact-avatar {
  flex-shrink: 0;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 600;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.contact-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.contact-time {
  font-size: 11px;
  color: var(--color-text-muted);
}

.contact-preview {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-badge {
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--color-danger);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  text-align: center;
  border-radius: 9px;
  flex-shrink: 0;
}

/* Content */
.msg-content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.msg-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.msg-tabs :deep(.el-tabs__header) {
  padding: 0 20px;
  margin-bottom: 0;
}

.msg-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

/* Conversation */
.conversation {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.conv-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: 16px;
}

.conv-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.conv-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 16px;
}

.msg-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  position: relative;
}

.msg-bubble p {
  margin: 0 0 4px;
  font-size: 14px;
  line-height: 1.5;
}

.bubble-time {
  font-size: 11px;
  opacity: 0.6;
}

.msg-bubble.received {
  align-self: flex-start;
  background: var(--color-bg);
  border-bottom-left-radius: 4px;
}

.msg-bubble.sent {
  align-self: flex-end;
  background: var(--color-primary);
  color: #fff;
  border-bottom-right-radius: 4px;
}

.msg-bubble.sent .bubble-time {
  color: rgba(255, 255, 255, 0.7);
}

.conv-input {
  display: flex;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-light);
}

.conv-input .el-button {
  flex-shrink: 0;
}

/* System / Interaction */
.msg-item {
  display: flex;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border-light);
}

.msg-item:last-child {
  border-bottom: none;
}

.sys-avatar {
  background: #fef3c7;
  color: #d97706;
}

.interact-avatar {
  background: #ede9fe;
  color: #7c3aed;
}

.msg-content {
  flex: 1;
  min-width: 0;
}

.msg-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.msg-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text);
}

.msg-time {
  font-size: 12px;
  color: var(--color-text-muted);
}

.msg-text {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}
</style>
