const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
    return
  }

  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: 'price_1L7tF4EobFOU2z6XVnFgmaqb',
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${req.headers.origin}/meetup/1?success=true`,
      cancel_url: `${req.headers.origin}/meetup/1?canceled=true`
    })
    res.redirect(303, session.url)
  } catch (err: any) {
    res.status(err.statusCode || 500).json(err.message)
  }
}
