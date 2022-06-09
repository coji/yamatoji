const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import type { NextApiRequest, NextApiResponse } from 'next'
import { getIdTokenFromReq } from '~/libs/api-side/helper'
import { addEntryParticipant } from '~/libs/api-side/meetup'
import { getUser } from '~/libs/api-side/user'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  try {
    // パラメタチェック
    if (!req.body.meetupId) {
      return res.status(500).send('meetupId is required')
    }
    const meetupId = String(req.body.meetupId)

    // ユーザ認証
    const verified = await getIdTokenFromReq(req)
    if (!verified) {
      return res.status(500).send('authorization failure')
    }
    const user = await getUser(verified.uid)
    if (!user) {
      return res.status(500).send('user is not found')
    }

    // 参加希望者リストに追加
    await addEntryParticipant(meetupId, user)

    res.status(200).send('ok')
  } catch (err: any) {
    res.status(err.statusCode || 500).json(err.message)
  }
}
