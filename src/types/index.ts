export interface User {
  id: string
  username: string
  nickname: string
}

export interface Location {
  latitude: number
  longitude: number
  address: string
}

export interface Post {
  id: string
  title: string
  description: string
  location: Location
  creatorId: string
  creatorName: string
  maxParticipants: number
  currentParticipants: string[]
  createdAt: number
}