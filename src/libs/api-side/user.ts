import { User } from '~/features/meetup/interfaces/user'
import { firestore } from './firebase-admin'

export const getUser = async (uid: string) => {
  const docRef = firestore.doc(`/users/${uid}`)
  const doc = await docRef.get()
  if (!doc.exists) {
    throw Error(`Meetup not found: ${uid}`)
  }
  return {
    ...doc.data()
  } as User
}
