import { defineStore } from 'pinia'
import { getUsers, type User } from '@/api/user'

const STORAGE_KEY = 'campus-market-current-user'

export type AppUser = User & {
  campus?: string
  role?: string
  contact?: string
}

const CAMPUS_LABELS: Record<string, string> = {
  east: '东区',
  west: '西区',
  south: '南区',
}

const ROLE_LABELS: Record<string, string> = {
  student: '学生',
  staff: '教职工',
}

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    currentUser: null as AppUser | null,
  }),

  getters: {
    displayName: (state) => state.currentUser?.name || '未登录',
    userDescription: (state) => {
      if (!state.currentUser) return '请先登录'
      const college = state.currentUser.college || ''
      const campus = CAMPUS_LABELS[state.currentUser.campus || ''] || state.currentUser.campus || ''
      return college && campus ? `${college} · ${campus}` : college || campus || ''
    },
    campusLabel: (state) => {
      const c = state.currentUser?.campus
      return c ? (CAMPUS_LABELS[c] || c) : ''
    },
    roleLabel: (state) => {
      const r = state.currentUser?.role
      return r ? (ROLE_LABELS[r] || r) : ''
    },
    userInitial: (state) => {
      return state.currentUser?.name?.slice(0, 1) || '?'
    },
  },

  actions: {
    async login(username: string, password: string) {
      const res = await getUsers()
      const user = res.data.find((u) => u.username === username && u.password === password)
      if (!user) throw new Error('账号或密码错误')

      this.currentUser = user
      this.isLoggedIn = true
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    },

    restoreLogin() {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      try {
        const data = JSON.parse(raw) as AppUser
        this.currentUser = data
        this.isLoggedIn = true
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    },

    logout() {
      this.currentUser = null
      this.isLoggedIn = false
      localStorage.removeItem(STORAGE_KEY)
    },

    updateProfile(payload: Partial<AppUser>) {
      if (!this.currentUser) return
      this.currentUser = { ...this.currentUser, ...payload }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser))
    },
  },
})
