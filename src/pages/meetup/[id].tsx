import { useEffect } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { QueryClient, dehydrate } from 'react-query'
import { Container, Box } from '@chakra-ui/react'
import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)
import { AppReturnToTopButton } from '~/components/AppReturnToTopButton'
import { MeetupImageBlock } from '~/features/meetup/components/MeetupImageBlock'
import { MeetupDateBlock } from '~/features/meetup/components/MeetupDateBlock'
import { MeetupTitleBlock } from '~/features/meetup/components/MeetupTitleBlock'
import { useMeetup, fetchMeetup } from '~/features/meetup/hooks/useMeetups'

const MeetupIndex = () => {
  const router = useRouter()
  const { data: meetup, isLoading } = useMeetup(String(router.query.id))

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.')
    }

    if (query.get('canceled')) {
      console.log(
        'Order canceled -- continue to shop around and checkout when you’re ready.'
      )
    }
  }, [])

  if (!meetup) {
    return <Box>Loading...</Box>
  }

  return (
    <Container maxW="container.lg" p="0">
      <MeetupImageBlock meetup={meetup} />
      <MeetupDateBlock meetup={meetup} />
      <MeetupTitleBlock meetup={meetup} />

      <form action="/api/checkout_sessions" method="POST">
        <section>
          <button type="submit" role="link">
            Checkout
          </button>
        </section>
      </form>

      <AppReturnToTopButton />
    </Container>
  )
}
export default MeetupIndex

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id as string
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(['meetup', id], () => fetchMeetup(id))

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}
