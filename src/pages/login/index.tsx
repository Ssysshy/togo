import { useState } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro, { navigateTo } from '@tarojs/taro'
import { login as loginService } from '../../services/auth'
import './index.less'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码')
      return
    }
    setLoading(true)
    setError('')
    try {
      await loginService(username, password)
      Taro.reLaunch({ url: '/pages/map/index' })
    } catch (e: unknown) {
      setError((e as Error).message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="login-container">
      <View className="login-header">
        <Text className="app-title">同邀</Text>
        <Text className="app-subtitle">邀请朋友一起活动</Text>
      </View>

      <View className="login-form">
        <View className="form-item">
          <Text className="label">用户名</Text>
          <Input
            className="input"
            value={username}
            onInput={(e) => setUsername(e.detail.value)}
            placeholder="请输入用户名"
            placeholderClass="placeholder"
          />
        </View>

        <View className="form-item">
          <Text className="label">密码</Text>
          <Input
            className="input"
            value={password}
            onInput={(e) => setPassword(e.detail.value)}
            password
            placeholder="请输入密码"
            placeholderClass="placeholder"
          />
        </View>

        {error && <Text className="error-msg">{error}</Text>}

        <Button
          className="login-btn"
          onClick={handleLogin}
          loading={loading}
        >
          {loading ? '登录中...' : '登录'}
        </Button>
      </View>
    </View>
  )
}