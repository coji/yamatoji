import { useEffect } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { QueryClient, dehydrate } from 'react-query'
import {
  Container,
  Box,
  Icon,
  Stack,
  Divider,
  Link,
  Grid,
  GridItem,
  chakra
} from '@chakra-ui/react'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { GrLocation } from 'react-icons/gr'
import dayjs from '~/libs/dayjs'
import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)
import { AppReturnToTopButton } from '~/components/AppReturnToTopButton'
import { MeetupImageBlock } from '~/features/meetup/components/MeetupImageBlock'
import { AddToGoogleCalendar } from '~/features/meetup/components/AddToGoogleCalendar'
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

      <Stack py="4">
        <Box px="4" fontSize="2xl" fontWeight="bold">
          {meetup.title}
        </Box>

        <Divider />

        <Grid gridTemplateColumns="2rem 1fr">
          <GridItem textAlign="center">
            <Icon as={AiOutlineClockCircle} />
          </GridItem>
          <GridItem>
            <chakra.span mr="2">
              {dayjs(meetup.startAt).format('YYYY年M月D日 ddd曜日 HH:mm')} 〜{' '}
              {dayjs(meetup.endAt).format('HH:mm')}
            </chakra.span>

            <AddToGoogleCalendar meetup={meetup} />
          </GridItem>

          <GridItem textAlign="center">
            <Icon as={GrLocation} />
          </GridItem>
          <GridItem>
            <Link
              href={meetup.locationUrl}
              color="blue.500"
              fontWeight="bold"
              isExternal
            >
              {meetup.locationLabel}
            </Link>
          </GridItem>
        </Grid>

        <Box px="4" fontSize="sm">
          {meetup.description}
        </Box>
      </Stack>

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
