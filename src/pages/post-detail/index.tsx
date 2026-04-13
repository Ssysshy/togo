import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { navigateTo, navigateBack, showToast } from '@tarojs/taro'
import { getCurrentUser } from '../../services/auth'
import { getPostById, joinPost } from '../../services/post'
import { Post } from '../../types'
import './index.less'

export default function PostDetailPage() {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    const query = (Taro as any).getCurrentInstance()?.router?.params
    const postId = query?.id
    if (!postId) {
      showToast({ title: '帖子不存在', icon: 'none' })
      navigateBack()
      return
    }

    getPostById(postId).then(p => {
      setPost(p)
      setLoading(false)
      if (!p) {
        showToast({ title: '帖子不存在', icon: 'none' })
        navigateBack()
      }
    })
  }, [])

  const handleJoin = async () => {
    const user = getCurrentUser()
    if (!user) {
      showToast({ title: '请先登录', icon: 'none' })
      navigateTo({ url: '/pages/login/index' })
      return
    }
    if (!post) return

    const isJoined = post.currentParticipants.includes(user.id)
    if (isJoined) {
      showToast({ title: '你已经加入了', icon: 'none' })
      return
    }

    setJoining(true)
    try {
      const updatedPost = await joinPost(post.id, user.id)
      setPost(updatedPost)
      showToast({ title: '加入成功', icon: 'success' })
      setTimeout(() => navigateBack(), 1500)
    } catch (e) {
      showToast({ title: e.message || '加入失败', icon: 'none' })
    } finally {
      setJoining(false)
    }
  }

  const user = getCurrentUser()
  const isJoined = post && user ? post.currentParticipants.includes(user.id) : false
  const isFull = post ? post.currentParticipants.length >= post.maxParticipants : false

  if (loading) {
    return (
      <View className="detail-container">
        <View className="loading">
          <Text>加载中...</Text>
        </View>
      </View>
    )
  }

  if (!post) {
    return (
      <View className="detail-container">
        <View className="loading">
          <Text>帖子不存在</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="detail-container">
      <View className="post-card">
        <Text className="title">{post.title}</Text>
        <Text className="description">{post.description}</Text>

        <View className="info-row">
          <Text className="info-label">发起人</Text>
          <Text className="info-value">{post.creatorName}</Text>
        </View>

        <View className="info-row">
          <Text className="info-label">位置</Text>
          <Text className="info-value">{post.location.address}</Text>
        </View>

        <View className="info-row">
          <Text className="info-label">人数</Text>
          <Text className="info-value">
            {post.currentParticipants.length} / {post.maxParticipants}
          </Text>
        </View>
      </View>

      <Button
        className={`join-btn ${isJoined || isFull ? 'disabled' : ''}`}
        onClick={handleJoin}
        disabled={isJoined || isFull || joining}
        loading={joining}
      >
        {isJoined ? '已加入' : isFull ? '人数已满' : joining ? '加入中...' : '加入'}
      </Button>
    </View>
  )
}