import type { User } from './user'

export interface Meetup {
  id: string | null
  title: string
  startAt: string
  endAt: string
  imageUrl: string
  locationLabel: string // 場所表示用
  locationUrl: string // 場所リンクURL
  description: string
  ticketPrice: number // チケット価格
  maxParticipants: number // 最大参加人数
  paidParticipants: User[] // 支払い済み参加者数
  entryParticipants: User[] // 参加表明/未払い参加者数
}
