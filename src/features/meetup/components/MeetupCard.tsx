import { Box, Image, AspectRatio, Stack } from '@chakra-ui/react'
import dayjs from '~/libs/dayjs'
import { Meetup } from '~/features/meetup/interfaces/meetup'

interface MeetupCardProps {
  meetup: Meetup
}
export const MeetupCard = ({ meetup }: MeetupCardProps) => {
  const startAt = dayjs(meetup.startAt)
  const startMonth = startAt.month() + 1
  const startDate = startAt.date()
  const startTime = startAt.format('ddd曜 H:mm')

  return (
    <Box
      rounded="md"
      w="full"
      border="1px solid"
      borderColor="gray.200"
      _hover={{ borderColor: 'blue.200' }}
    >
      <AspectRatio maxW="full" ratio={16 / 9}>
        <Image
          roundedTop="md"
          loading="lazy"
          src={meetup.imageUrl}
          alt="image"
        />
      </AspectRatio>
      <Stack direction="row" gap="4" p="4">
        <Box w="10" textAlign="center">
          <Box fontSize="sm">
            {startMonth}
            <small>月</small>
          </Box>
          <Box fontSize="lg" fontWeight="bold">
            {startDate}
          </Box>
        </Box>

        <Box>
          <Box fontSize="sm" fontWeight="bold">
            {startTime}
          </Box>
          <Box noOfLines={2}>{meetup.title}</Box>
        </Box>
      </Stack>
    </Box>
  )
}
