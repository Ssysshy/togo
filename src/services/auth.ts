import { User } from '../types'

const STORAGE_KEY = 'togo_user'

// Mock user storage
let currentUser: User | null = null

export function login(username: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username && password) {
        const user: User = {
          id: `user_${Date.now()}`,
          username,
          nickname: username
        }
        currentUser = user
        try {
          wx.setStorageSync(STORAGE_KEY, user)
        } catch (e) {
          // ignore storage errors in h5
        }
        resolve(user)
      } else {
        reject(new Error('请输入用户名和密码'))
      }
    }, 500)
  })
}

export function getCurrentUser(): User | null {
  if (currentUser) return currentUser
  try {
    const stored = wx.getStorageSync(STORAGE_KEY)
    if (stored) {
      currentUser = stored
      return currentUser
    }
  } catch (e) {
    // ignore
  }
  return null
}

export function logout(): void {
  currentUser = null
  try {
    wx.removeStorageSync(STORAGE_KEY)
  } catch (e) {
    // ignore
  }
}