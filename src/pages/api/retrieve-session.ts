const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import type { NextApiRequest, NextApiResponse } from 'next'
import { getIdTokenFromReq } from '~/libs/api-side/helper'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    res.status(405).end('Method Not Allowed')
    return
  }

  try {
    // 存在チェック
    if (!req.query.session_id) {
      return res.status(500).send('meetupId is required')
    }
    const sessionId = String(req.query.session_id)

    // ユーザ認証
    const verified = await getIdTokenFromReq(req)
    if (!verified) {
      return res.status(500).send('authorization failure')
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const customer = await stripe.customers.retrieve(session.customer)

    res.json({
      session
    }) // stripe のチェックアウトURLを返却。ブラウザ側でリダイレクト (CORS対応)
  } catch (err: any) {
    console.log(err)
    res.status(err.statusCode || 500).json(err.message)
  }
}
