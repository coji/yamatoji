const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import type { NextApiRequest, NextApiResponse } from 'next'
import { getIdTokenFromReq } from '~/libs/api-side/helper'
import { getMeetup } from '~/libs/api-side/meetup'

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
    // 存在チェック
    if (!req.body.meetupId) {
      return res.status(500).send('meetupId is required')
    }

    // 売り切れチェック
    const meetup = await getMeetup(String(req.body.meetupId))
    if (meetup.maxParticipants < meetup.paidParticipants.length + 1) {
      return res.status(500).send('sold out')
    }

    // ユーザ認証
    const verified = await getIdTokenFromReq(req)
    if (!verified) {
      return res.status(500).send('authorization failure')
    }

    // チェックアウトの開始
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1L7tF4EobFOU2z6XVnFgmaqb',
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/meetup/1?success=true`,
      cancel_url: `${req.headers.origin}/meetup/1?canceled=true`
    })

    res.json(session.url) // stripe のチェックアウトURLを返却。ブラウザ側でリダイレクト (CORS対応)
  } catch (err: any) {
    res.status(err.statusCode || 500).json(err.message)
  }
}
