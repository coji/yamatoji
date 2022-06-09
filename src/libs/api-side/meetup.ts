import { Meetup } from '~/features/meetup/interfaces/meetup'
import { firestore } from './firebase-admin'

export const getMeetup = async (id: string) => {
  const docRef = firestore.doc(`/meetups/${id}`)
  const doc = await docRef.get()
  if (!doc.exists) {
    throw Error(`Meetup not found: ${id}`)
  }
  return {
    id: doc.id,
    ...doc.data()
  } as Meetup
}
