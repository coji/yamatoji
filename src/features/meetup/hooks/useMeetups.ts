import { useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import type { Meetup } from '../interfaces/meetup'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  QueryDocumentSnapshot,
  SnapshotOptions,
  onSnapshot,
  DocumentData
} from 'firebase/firestore'
import { firestore } from '~/libs/firebase'

const meetupConverter = {
  toFirestore(meetup: Meetup): DocumentData {
    return {
      ...meetup
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Meetup {
    const data = snapshot.data(options)!
    return {
      id: snapshot.id,
      ...data
    } as Meetup
  }
}

export const fetchMeetupList = async () => {
  const snapshot = await getDocs(
    collection(firestore, 'meetups').withConverter(meetupConverter)
  )
  return snapshot.docs.map((doc) => doc.data())
}

export const fetchMeetup = async (id: string) => {
  const snapshot = await getDoc(
    doc(firestore, `meetups/${id}`).withConverter(meetupConverter)
  )
  return snapshot.data()
}

export const useMeetupList = () => {
  return useQuery(['meetups'], () => fetchMeetupList())
}

export const useMeetup = (id: string) => {
  return useQuery(['meetup', id], () => fetchMeetup(id))
}

export const useMeetupUpdator = (id: string) => {
  const unsubscribe = useRef<ReturnType<typeof onSnapshot>>()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!id) {
      return
    }

    unsubscribe.current = onSnapshot(doc(firestore, `meetups/${id}`), () => {
      queryClient.invalidateQueries(['meetup', id])
    })

    return () => {
      if (unsubscribe.current) unsubscribe.current()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
