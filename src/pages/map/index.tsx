import { useState, useEffect } from 'react'
import { View, Text, Map, Button } from '@tarojs/components'
import { navigateTo, pullDownRefresh } from '@tarojs/taro'
import { getCurrentUser } from '../../services/auth'
import { getPosts, getUserLocation } from '../../services/post'
import { Post, Location } from '../../types'
import './index.less'

interface Marker {
  id: string
  latitude: number
  longitude: number
  title: string
  callout: {
    content: string
    padding: 8
    borderRadius: 4
    display: 'ALWAYS'
  }
}

export default function MapPage() {
  const [location, setLocation] = useState<Location>({
    latitude: 39.9042,
    longitude: 116.4074,
    address: '北京市东城区'
  })
  const [markers, setMarkers] = useState<Marker[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      // Get user location
      const loc = await getUserLocation()
      setLocation(loc)

      // Get posts
      const posts = await getPosts()
      const markersData: Marker[] = posts.map((post: Post) => ({
        id: post.id,
        latitude: post.location.latitude,
        longitude: post.location.longitude,
        title: post.title,
        callout: {
          content: `${post.title}\n${post.currentParticipants.length}/${post.maxParticipants}人`,
          padding: 8,
          borderRadius: 4,
          display: 'ALWAYS'
        }
      }))
      setMarkers(markersData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      navigateTo({ url: '/pages/login/index' })
      return
    }
    loadData()
  }, [])

  const handleMarkerTap = (e: any) => {
    const markerId = e.detail?.markerId
    if (markerId) {
      navigateTo({ url: `/pages/post-detail/index?id=${markerId}` })
    }
  }

  const handlePost = () => {
    navigateTo({ url: '/pages/post/index' })
  }

  const handleRefresh = async () => {
    await loadData()
    pullDownRefresh?.()
  }

  return (
    <View className="map-container">
      <Map
        className="map"
        latitude={location.latitude}
        longitude={location.longitude}
        scale={14}
        markers={markers}
        showLocation
        onMarkerTap={handleMarkerTap}
        onClick={handleRefresh}
      />

      {loading && (
        <View className="loading-mask">
          <Text className="loading-text">加载中...</Text>
        </View>
      )}

      <Button className="post-btn" onClick={handlePost}>
        发布同邀
      </Button>
    </View>
  )
}