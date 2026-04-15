import { useState, useEffect } from 'react'
import { View, Text, Input, Textarea, Picker, Button } from '@tarojs/components'
import { navigateBack, showToast } from '@tarojs/taro'
import { getCurrentUser } from '../../services/auth'
import { createPost, getUserLocation } from '../../services/post'
import './index.less'

const PARTICIPANT_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10]

export default function PostPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [maxParticipants, setMaxParticipants] = useState(5)
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, address: '' })

  useEffect(() => {
    getUserLocation().then(loc => setLocation(loc))
  }, [])

  const handleSubmit = async () => {
    const user = getCurrentUser()
    if (!user) {
      showToast({ title: '请先登录', icon: 'none' })
      return
    }
    if (!title.trim()) {
      showToast({ title: '请输入标题', icon: 'none' })
      return
    }
    if (!description.trim()) {
      showToast({ title: '请输入描述', icon: 'none' })
      return
    }

    if (!location.latitude || !location.longitude) {
      showToast({ title: '正在获取位置，请稍候', icon: 'none' })
      return
    }

    setLoading(true)
    try {
      await createPost({
        title: title.trim(),
        description: description.trim(),
        location,
        creatorId: user.id,
        creatorName: user.nickname,
        maxParticipants
      })
      showToast({ title: '发布成功', icon: 'success' })
      setTimeout(() => navigateBack(), 1500)
    } catch (e: unknown) {
      showToast({ title: (e as Error).message || '发布失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="post-container">
      <View className="form-item">
        <Text className="label">标题</Text>
        <Input
          className="input"
          value={title}
          onInput={(e) => setTitle(e.detail.value)}
          placeholder="例如：一起跑步"
          placeholderClass="placeholder"
        />
      </View>

      <View className="form-item">
        <Text className="label">描述</Text>
        <Textarea
          className="textarea"
          value={description}
          onInput={(e) => setDescription(e.detail.value)}
          placeholder="填写活动详情..."
          placeholderClass="placeholder"
        />
      </View>

      <View className="form-item">
        <Text className="label">人数上限</Text>
        <Picker
          mode="selector"
          range={PARTICIPANT_OPTIONS}
          onChange={(e) => setMaxParticipants(PARTICIPANT_OPTIONS[e.detail.value])}
        >
          <View className="picker-value">
            <Text>{maxParticipants}人</Text>
          </View>
        </Picker>
      </View>

      <View className="form-item">
        <Text className="label">位置</Text>
        <View className="location-text">
          <Text>{location.address || '正在获取位置...'}</Text>
        </View>
      </View>

      <Button
        className="submit-btn"
        onClick={handleSubmit}
        loading={loading}
      >
        {loading ? '发布中...' : '发布'}
      </Button>
    </View>
  )
}