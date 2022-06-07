import type { NextPage } from 'next'
import NextLink from 'next/link'
import Head from 'next/head'
import { Grid, GridItem, Link } from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import { MeetupCard } from '~/features/meetup/components/MeetupCard'
import type { Meetup } from '~/features/meetup/interfaces/meetup'
import Meetups from '~/assets/meetups.json'

const Home: NextPage = () => {
  const { currentUser, isAuthChecking } = useAuth()
  const meetups: Meetup[] = Meetups

  return (
    <>
      <Head>
        <title>Yamatoji</title>
      </Head>

      <Grid
        gap="4"
        gridTemplateColumns={{
          base: '1fr',
          sm: 'repeat(2,1fr)',
          md: 'repeat(2,1fr)',
          lg: 'repeat(2,1fr)',
          xl: 'repeat(2,1fr)'
        }}
      >
        {meetups.map((meetup) => (
          <GridItem overflow="auto" key={meetup.id}>
            <NextLink href={`/meetup/${meetup.id}`} passHref>
              <Link _hover={{ textDecoration: 'none' }}>
                <MeetupCard meetup={meetup} />
              </Link>
            </NextLink>
          </GridItem>
        ))}
      </Grid>
    </>
  )
}

export default Home
