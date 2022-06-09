import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import { loadStripe } from '@stripe/stripe-js'

interface CreateSessionProps {
  meetupId: string
  price: string
  quantity: number
}

export const useCreateSession = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { currentUser } = useAuth()
  const toast = useToast()

  const createSession = async ({
    meetupId,
    price,
    quantity
  }: CreateSessionProps) => {
    if (!currentUser) {
      toast({ status: 'error', title: 'You must be logged in to do that' })
      return
    }

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    )

    if (!stripe) {
      toast({ status: 'error', title: 'stripe is not loaded' })
      return
    }

    setIsLoading(true)

    await stripe.redirectToCheckout({
      lineItems: [
        {
          price,
          quantity
        }
      ],
      clientReferenceId: JSON.stringify({
        uid: currentUser.uid,
        meetupId
      }),
      customerEmail: currentUser.email || undefined,
      mode: 'payment',
      successUrl: `${window.location.href}`,
      cancelUrl: `${window.location.href}`
    })

    setIsLoading(false)
  }

  return {
    isLoading,
    createSession
  }
}
