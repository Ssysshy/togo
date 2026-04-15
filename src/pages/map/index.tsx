import { useState, useEffect, useRef } from 'react'
import { View, Text, Map as TaroMap, Button } from '@tarojs/components'
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
  const [authed, setAuthed] = useState(false)
  const postIdMap = useRef<Map<number, string>>(new Map())

  const loadData = async () => {
    setLoading(true)
    try {
      const loc = await getUserLocation()
      setLocation(loc)

      const posts = await getPosts()
      const newPostIdMap = new Map<number, string>()
      const markersData: Marker[] = posts.map((post: Post, index: number) => {
        newPostIdMap.set(index, post.id)
        return {
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
        }
      })
      postIdMap.current = newPostIdMap
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
      Taro.reLaunch({ url: '/pages/login/index' })
      return
    }
    setAuthed(true)
    loadData()
  }, [])

  const handleMarkerTap = (e: any) => {
    const markerId: number = e.detail?.markerId
    const postId = postIdMap.current.get(markerId)
    if (postId) {
      navigateTo({ url: `/pages/post-detail/index?id=${postId}` })
    }
  }

  const handlePost = () => {
    navigateTo({ url: '/pages/post/index' })
  }

  const handleRefresh = async () => {
    await loadData()
    Taro.stopPullDownRefresh()
  }

  if (!authed) {
    return <View className="map-container" />
  }

  return (
    <View className="map-container">
      <TaroMap
        className="map"
        latitude={location.latitude}
        longitude={location.longitude}
        scale={14}
        markers={markers}
        showLocation
        onMarkerTap={handleMarkerTap}
        onRegionChange={handleRefresh}
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