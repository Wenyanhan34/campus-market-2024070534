import { defineStore } from 'pinia'

export interface ChatMessage {
  text: string
  isMe: boolean
  time: string
}

export interface Conversation {
  name: string
  lastMsg: string
  time: string
  unread: number
  messages: ChatMessage[]
}

const initialConversations: Conversation[] = [
  {
    name: '张明远',
    lastMsg: '好的，那下午三点见',
    time: '10:23',
    unread: 2,
    messages: [
      { text: '同学你好，那个台灯还在吗？', isMe: true, time: '10:00' },
      { text: '在的，成色很好，很少用', isMe: false, time: '10:05' },
      { text: '能不能便宜点？50出吗', isMe: true, time: '10:10' },
      { text: '最低60吧，原价200多买的', isMe: false, time: '10:15' },
      { text: '行吧，60就60，在哪交易？', isMe: true, time: '10:20' },
      { text: '好的，那下午三点见', isMe: false, time: '10:23' },
    ],
  },
  {
    name: '李思涵',
    lastMsg: '快递单号发你了',
    time: '昨天',
    unread: 0,
    messages: [
      { text: '麻烦帮我取下快递，东区驿站', isMe: true, time: '昨天 14:00' },
      { text: '好的，取件码发我', isMe: false, time: '昨天 14:05' },
      { text: '3-2-1108', isMe: true, time: '昨天 14:06' },
      { text: '快递单号发你了', isMe: false, time: '昨天 14:30' },
    ],
  },
  {
    name: '王浩然',
    lastMsg: '拼单还差两个人',
    time: '昨天',
    unread: 1,
    messages: [
      { text: '奶茶拼单还有位置吗？', isMe: true, time: '昨天 11:00' },
      { text: '有的，目前2/4，还差两个人', isMe: false, time: '昨天 11:05' },
      { text: '那算我一个', isMe: true, time: '昨天 11:10' },
      { text: '拼单还差两个人', isMe: false, time: '昨天 11:12' },
    ],
  },
  {
    name: '陈雨薇',
    lastMsg: '校园卡在图书馆找到了',
    time: '6-25',
    unread: 0,
    messages: [
      { text: '请问在哪捡到校园卡的？', isMe: true, time: '6-25 09:00' },
      { text: '在图书馆三楼自习室', isMe: false, time: '6-25 09:10' },
      { text: '太好了，我现在过去拿', isMe: true, time: '6-25 09:15' },
      { text: '校园卡在图书馆找到了', isMe: false, time: '6-25 09:20' },
    ],
  },
]

export const useMessageStore = defineStore('message', {
  state: () => ({
    conversations: JSON.parse(JSON.stringify(initialConversations)) as Conversation[],
  }),

  getters: {
    conversationByName: (state) => {
      return (name: string) => state.conversations.find(c => c.name === name)
    },
    contactList: (state) => {
      return state.conversations.map(c => ({
        name: c.name,
        lastMsg: c.lastMsg,
        time: c.time,
        unread: c.unread,
      }))
    },
  },

  actions: {
    ensureConversation(name: string) {
      let conv = this.conversations.find(c => c.name === name)
      if (!conv) {
        conv = {
          name,
          lastMsg: '',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: 0,
          messages: [],
        }
        this.conversations.push(conv)
      }
      return conv
    },

    sendMessage(contactName: string, text: string) {
      const conv = this.ensureConversation(contactName)
      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

      conv.messages.push({ text, isMe: true, time: timeStr })
      conv.lastMsg = text
      conv.time = '刚刚'
      conv.unread = 0
    },

    replyMessage(contactName: string) {
      const conv = this.conversations.find(c => c.name === contactName)
      if (!conv) return

      const now = new Date()
      const rt = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const replies = ['好的，没问题', '收到，我再确认一下', '嗯嗯，好的', '没问题，准时到']
      const reply = replies[Math.floor(Math.random() * replies.length)] || '好的'

      conv.messages.push({ text: reply, isMe: false, time: rt })
      conv.lastMsg = reply
      conv.time = '刚刚'
    },

    clearUnread(contactName: string) {
      const conv = this.conversations.find(c => c.name === contactName)
      if (conv) conv.unread = 0
    },
  },
})
