const ENV = process.env.TARO_ENV || 'h5'

export function getItem<T>(key: string): T | null {
  if (ENV === 'weapp') {
    try {
      return wx.getStorageSync(key)
    } catch {
      return null
    }
  }
  if (ENV === 'h5') {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  }
  return null
}

export function setItem<T>(key: string, value: T): void {
  if (ENV === 'weapp') {
    try {
      wx.setStorageSync(key, value)
    } catch {
      // ignore
    }
    return
  }
  if (ENV === 'h5') {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export function removeItem(key: string): void {
  if (ENV === 'weapp') {
    try {
      wx.removeStorageSync(key)
    } catch {
      // ignore
    }
    return
  }
  if (ENV === 'h5') {
    localStorage.removeItem(key)
  }
}
