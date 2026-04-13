import { User } from '../types'
import { getItem, setItem, removeItem } from '../utils/storage'

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
        setItem(STORAGE_KEY, user)
        resolve(user)
      } else {
        reject(new Error('请输入用户名和密码'))
      }
    }, 500)
  })
}

export function getCurrentUser(): User | null {
  if (currentUser) return currentUser
  const stored = getItem<User>(STORAGE_KEY)
  if (stored) {
    currentUser = stored
    return currentUser
  }
  return null
}

export function logout(): void {
  currentUser = null
  removeItem(STORAGE_KEY)
}