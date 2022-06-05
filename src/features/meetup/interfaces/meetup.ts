export interface Meetup {
  id: string | null
  title: string
  startAt: string
  endAt: string
  imageUrl: string
  locationLabel: string // 場所表示用
  locationUrl: string // 場所リンクURL
  description: string
  maxParticipants: number // 最大参加人数
  payidParticipants: number // 支払い済み参加者数
  entryParticipants: number // 参加表明/未払い参加者数
}
