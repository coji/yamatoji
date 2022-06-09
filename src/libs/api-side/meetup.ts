import { Meetup } from '~/features/meetup/interfaces/meetup'
import { User } from '~/features/meetup/interfaces/user'
import { firestore, firebase } from './firebase-admin'

// meetup を1件取得
export const getMeetup = async (meetupId: string) => {
  const docRef = firestore.doc(`/meetups/${meetupId}`)
  const doc = await docRef.get()
  if (!doc.exists) {
    throw Error(`Meetup not found: ${meetupId}`)
  }
  return {
    id: doc.id,
    ...doc.data()
  } as Meetup
}

// 購入者リストに追加 / 希望者リストから削除
export const addPaidParticipant = async (meetupId: string, user: User) => {
  const docRef = firestore.doc(`/meetups/${meetupId}`)
  const participant = userToParticipant(user)
  await docRef.update({
    paidParticipants: firebase.firestore.FieldValue.arrayUnion(participant),
    entryParticipants: firebase.firestore.FieldValue.arrayRemove(participant)
  })
}

// 希望者リストに追加
export const addEntryParticipant = async (meetupId: string, user: User) => {
  const docRef = firestore.doc(`/meetups/${meetupId}`)

  const participant = userToParticipant(user)
  await firestore.runTransaction(async () => {
    const doc = await docRef.get()
    if (!doc.exists) {
      throw Error(`Meetup not found: ${meetupId}`)
    }
    const data = doc.data()
    if (!data) {
      throw Error(`Meetup not found: ${meetupId}`)
    }
    if (
      data.paidParticipants.find(
        (e: ReturnType<typeof userToParticipant>) => e.uid === user.uid
      )
    ) {
      throw Error(`User already paid: ${user.displayName}`)
    }

    await docRef.update({
      entryParticipants: firebase.firestore.FieldValue.arrayUnion(participant)
    })
  })
}

// 希望者リストから削除
export const removeEntryParticipant = async (meetupId: string, user: User) => {
  const docRef = firestore.doc(`/meetups/${meetupId}`)

  const participant = userToParticipant(user)
  await firestore.runTransaction(async () => {
    const doc = await docRef.get()
    if (!doc.exists) {
      throw Error(`Meetup not found: ${meetupId}`)
    }
    const data = doc.data()
    if (!data) {
      throw Error(`Meetup not found: ${meetupId}`)
    }
    if (
      data.paidParticipants.find(
        (e: ReturnType<typeof userToParticipant>) => e.uid === user.uid
      )
    ) {
      throw Error(`User already paid: ${user.displayName}`)
    }

    const ret = await docRef.update({
      entryParticipants: firebase.firestore.FieldValue.arrayRemove(participant)
    })
  })
}

// User から 参加者情報のハッシュを生成
const userToParticipant = (user: User) => {
  const participant: {
    uid: string
    displayName: string
    photoUrl: string
    githubUsername?: string
  } = {
    uid: user.uid,
    displayName: user.displayName,
    photoUrl: user.photoUrl
  }

  if (user.githubUsername) {
    participant.githubUsername = user.githubUsername
  }

  return participant
}
