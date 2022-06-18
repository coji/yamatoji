import type { NextPage, GetStaticProps } from 'next'
import NextLink from 'next/link'
import Head from 'next/head'
import { QueryClient, dehydrate } from 'react-query'
import { Container, Grid, GridItem, Link } from '@chakra-ui/react'
import { MeetupCard } from '~/features/meetup/components/MeetupCard'
import {
  useMeetupList,
  fetchMeetupList
} from '~/features/meetup/hooks/useMeetups'

const Home: NextPage = () => {
  const { data } = useMeetupList()

  return (
    <>
      <Head>
        <title>Yamatoji</title>
      </Head>

      <Container maxW="container.lg" p="0">
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
          {data &&
            data.map((meetup) => (
              <GridItem overflow="auto" key={meetup.id}>
                <NextLink href={`/meetup/${meetup.id}`} passHref>
                  <Link _hover={{ textDecoration: 'none' }}>
                    <MeetupCard meetup={meetup} />
                  </Link>
                </NextLink>
              </GridItem>
            ))}
        </Grid>
      </Container>
    </>
  )
}
export default Home

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['meetups'], () => fetchMeetupList())

  return {
    props: {
      dehydratedState: dehydrate(queryClient)
    },
    revalidate: 60
  }
}
