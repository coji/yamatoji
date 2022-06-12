const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import type { NextApiRequest, NextApiResponse } from 'next'
import dayjs from '~/libs/dayjs'
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
    const meetupId = String(req.body.meetupId)

    // 売り切れチェック
    const meetup = await getMeetup(meetupId)
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
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `${meetup.title} (${dayjs(meetup.startAt)
                .tz()
                .format('YYYY-MM-DD')})`
            },
            unit_amount: meetup.ticketPrice
          },
          quantity: 1
        },
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: 'yamatoji システム利用料 3.6%'
            },
            unit_amount:
              Math.round(meetup.ticketPrice / (1 - 0.036)) - meetup.ticketPrice
          },
          quantity: 1
        }
      ],
      client_reference_id: JSON.stringify({
        uid: verified.uid,
        meetupId: meetup.id
      }),
      customer_email: verified.email,
      mode: 'payment',
      success_url: `${req.headers.origin}/meetup/${meetupId}?success=true&?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/meetup/${meetupId}`
    })

    res.json(session.url) // stripe のチェックアウトURLを返却。ブラウザ側でリダイレクト (CORS対応)
  } catch (err: any) {
    console.log(err)
    res.status(err.statusCode || 500).json(err.message)
  }
}
