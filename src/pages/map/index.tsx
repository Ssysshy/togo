import { useState, useEffect } from 'react'
import { View, Text, Map, Button } from '@tarojs/components'
import type { MapProps } from '@tarojs/components/types/Map'
import Taro, { navigateTo } from '@tarojs/taro'
import { getCurrentUser } from '../../services/auth'
import { getPosts, getUserLocation } from '../../services/post'
import { Post, Location } from '../../types'
import './index.less'

type Marker = MapProps.marker

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
      const markersData: Marker[] = posts.map((post: Post, index: number) => ({
        id: index,
        latitude: post.location.latitude,
        longitude: post.location.longitude,
        title: post.title,
        iconPath: '',
        width: 20,
        height: 20,
        callout: {
          content: `${post.title}\n${post.currentParticipants.length}/${post.maxParticipants}人`,
          color: '#333',
          fontSize: 14,
          anchorX: 0,
          anchorY: 0,
          borderRadius: 4,
          borderWidth: 0,
          borderColor: '#fff',
          bgColor: '#fff',
          padding: 8,
          display: 'ALWAYS',
          textAlign: 'center'
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
    Taro.stopPullDownRefresh()
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
        onTap={handleRefresh}
        onError={() => {}}
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