// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getMeetup, addPaidParticipant } from '~/libs/api-side/meetup'
import { getUser } from '~/libs/api-side/user'
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
export const config = {
  api: {
    bodyParser: false
  }
}

const webhookPayloadParser = (req: any): Promise<any> =>
  new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk: string) => {
      data += chunk
    })
    req.on('end', () => {
      resolve(Buffer.from(data).toString())
    })
  })

type Data = {
  status: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const rawBody = await webhookPayloadParser(req)
  const stripeSignature = req.headers['stripe-signature']

  let event = null
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      stripeSignature,
      endpointSecret
    )
  } catch (err) {
    // invalid signature
    res.status(400).end()
    return
  }

  if (event['type'] !== 'checkout.session.completed') {
    res.status(200).end()
    return
  }

  const { uid, meetupId } = JSON.parse(event.data.object.client_reference_id)
  const user = await getUser(uid)
  const meetup = await getMeetup(meetupId)
  addPaidParticipant(meetupId, user)

  console.log(user, meetup)

  res.status(200).send({ status: 'ok' })
}
