import { useEffect } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { QueryClient, dehydrate } from 'react-query'
import {
  Container,
  Heading,
  Box,
  Icon,
  Stack,
  Divider,
  Link,
  Grid,
  GridItem,
  Text,
  Avatar,
  chakra
} from '@chakra-ui/react'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { GrLocation } from 'react-icons/gr'
import { IoPeopleCircleOutline } from 'react-icons/io5'
import { FaRegCommentDots } from 'react-icons/fa'
import dayjs from '~/libs/dayjs'
import { AppReturnToTopButton } from '~/components/AppReturnToTopButton'
import { MeetupImageBlock } from '~/features/meetup/components/MeetupImageBlock'
import { PurchasePanel } from '~/features/meetup/components/PurchasePanel'
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

      <Stack py="4" px="2">
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          px="2"
          alignItems="baseline"
        >
          <Heading flex="1">{meetup.title}</Heading>
          <Box fontSize="xs">
            参加確定 {meetup.paidParticipants.length}人 / 参加希望{' '}
            {meetup.entryParticipants.length}人 / 最大{meetup.maxParticipants}人
          </Box>
        </Stack>

        <Divider />

        <Stack direction={{ base: 'column', sm: 'row' }}>
          <Stack flex="1">
            <Grid gridTemplateColumns="2rem 1fr" gap="2">
              {/* 開催日時 */}
              <GridItem textAlign="center">
                <Icon mt="1" as={AiOutlineClockCircle} />
              </GridItem>
              <GridItem>
                <chakra.span mr="2">
                  {dayjs(meetup.startAt)
                    .tz()
                    .format('YYYY年M月D日 ddd曜日 HH:mm')}{' '}
                  〜 {dayjs(meetup.endAt).tz().format('HH:mm')}
                </chakra.span>
                <AddToGoogleCalendar meetup={meetup} />
              </GridItem>

              {/* 場所 */}
              <GridItem textAlign="center">
                <Icon mt="1" as={GrLocation} />
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

              {/* 概要 */}
              <GridItem textAlign="center">
                <Icon mt="1" as={FaRegCommentDots} />
              </GridItem>
              <GridItem>
                <Text>{meetup.description}</Text>
              </GridItem>

              {/* 参加確定者数 */}
              <GridItem textAlign="center">
                <Icon mt="1" as={IoPeopleCircleOutline} />
              </GridItem>
              <GridItem>
                <Text fontWeight="bold" color="gray.600">
                  参加確定 {meetup.paidParticipants.length}
                  <small>人</small>
                </Text>
              </GridItem>

              {/* 参加確定リスト */}
              <GridItem></GridItem>
              <GridItem>
                <Stack>
                  {meetup.paidParticipants.map((participant) => (
                    <Link
                      key={participant.uid}
                      href={
                        participant.githubUsername &&
                        `https://github.com/${participant.githubUsername}`
                      }
                      isExternal
                      display="inline"
                      w="fit-content"
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        display="inline-flex"
                      >
                        <Avatar
                          mr="1"
                          src={participant.photoUrl}
                          size="sm"
                        ></Avatar>
                        <Text display="inline">{participant.displayName}</Text>
                      </Stack>
                    </Link>
                  ))}
                </Stack>
              </GridItem>
            </Grid>
          </Stack>
          <Stack>
            {/* 購入パネル */}
            <PurchasePanel meetup={meetup} />

            {/* 参加希望 */}
            {meetup.entryParticipants.length > 0 && (
              <Box
                fontSize="sm"
                color="gray.500"
                border="1px solid"
                borderColor="gray.300"
                rounded="md"
                py="1"
                px="4"
                mb="2"
              >
                <Box fontWeight="bold" pb="2">
                  参加希望 {meetup.entryParticipants.length}
                  <small>人</small>
                </Box>
                <Stack>
                  {meetup.entryParticipants.map((participant) => (
                    <Link
                      key={participant.uid}
                      href={
                        participant.githubUsername &&
                        `https://github.com/${participant.githubUsername}`
                      }
                      isExternal
                      display="inline"
                      w="fit-content"
                    >
                      <Stack
                        direction="row"
                        key={participant.uid}
                        display="inline-flex"
                        alignItems="center"
                      >
                        <Avatar src={participant.photoUrl} size="sm"></Avatar>
                        <Text>{participant.displayName}</Text>
                      </Stack>
                    </Link>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </Stack>
      </Stack>

      <AppReturnToTopButton />
    </Container>
  )
}
export default MeetupIndex

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id as string
  const meetup = await fetchMeetup(id)
  if (!meetup) return { notFound: true }

  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(['meetup', id], () => fetchMeetup(id))

  return {
    props: { dehydratedState: dehydrate(queryClient) },
    revalidate: 60
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }
}
