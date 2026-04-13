import { Post, Location } from '../types'

// Mock in-memory storage
const postsStorage: Post[] = [
  {
    id: 'post_1',
    title: '一起跑步',
    description: '早上在公园慢跑，有兴趣的来',
    location: {
      latitude: 39.9042,
      longitude: 116.4074,
      address: '北京市东城区'
    },
    creatorId: 'user_system',
    creatorName: '的运动达人人',
    maxParticipants: 5,
    currentParticipants: ['user_system'],
    createdAt: Date.now() - 3600000
  },
  {
    id: 'post_2',
    title: '拼饭找人',
    description: '中午一起吃饭，AA制',
    location: {
      latitude: 39.9142,
      longitude: 116.4174,
      address: '北京市朝阳区'
    },
    creatorId: 'user_system2',
    creatorName: '美食爱好者',
    maxParticipants: 4,
    currentParticipants: ['user_system2'],
    createdAt: Date.now() - 7200000
  }
]

function generateId(): string {
  return `post_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function getPosts(): Promise<Post[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...postsStorage])
    }, 300)
  })
}

export function getPostById(id: string): Promise<Post | null> {
  return new Promise((resolve) => {
    const post = postsStorage.find(p => p.id === id) || null
    resolve(post ? { ...post } : null)
  })
}

export function createPost(data: {
  title: string
  description: string
  location: Location
  creatorId: string
  creatorName: string
  maxParticipants: number
}): Promise<Post> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPost: Post = {
        id: generateId(),
        ...data,
        currentParticipants: [data.creatorId],
        createdAt: Date.now()
      }
      postsStorage.unshift(newPost)
      resolve(newPost)
    }, 300)
  })
}

export function joinPost(postId: string, userId: string): Promise<Post> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const post = postsStorage.find(p => p.id === postId)
      if (!post) {
        reject(new Error('帖子不存在'))
        return
      }
      if (post.currentParticipants.includes(userId)) {
        reject(new Error('已经加入了'))
        return
      }
      if (post.currentParticipants.length >= post.maxParticipants) {
        reject(new Error('人数已满'))
        return
      }
      post.currentParticipants.push(userId)
      resolve({ ...post })
    }, 300)
  })
}

export function getUserLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (typeof wx !== 'undefined' && wx.getLocation) {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          resolve({
            latitude: res.latitude,
            longitude: res.longitude,
            address: '当前位置'
          })
        },
        fail: () => {
          // Return default location (Beijing) on failure
          resolve({
            latitude: 39.9042,
            longitude: 116.4074,
            address: '北京市东城区'
          })
        }
      })
    } else {
      // Default for H5
      resolve({
        latitude: 39.9042,
        longitude: 116.4074,
        address: '北京市东城区'
      })
    }
  })
}