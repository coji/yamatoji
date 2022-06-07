import { useQuery } from 'react-query'
import type { Meetup } from '../interfaces/meetup'
import meetups from '~/assets/meetups.json'

export const fetchMeetupList = async () => meetups

export const fetchMeetup = (id: string) =>
  meetups.find((meetup) => meetup.id === id)

export const useMeetupList = () => {
  return useQuery(['meetups'], () => fetchMeetupList())
}

export const useMeetup = (id: string) => {
  return useQuery(['meetup', id], () => fetchMeetup(id))
}
