import { Center, Box } from '@chakra-ui/react'
import dayjs from '~/libs/dayjs'
import type { Meetup } from '../interfaces/meetup'

export const MeetupDateBlock = ({ meetup }: { meetup: Meetup }) => {
  const startAt = dayjs(meetup.startAt)
  const startMonth = startAt.month() + 1
  const startDate = startAt.date()

  return (
    <Center flexDirection="column" w="10" textAlign="center">
      <Box fontSize="sm">
        {startMonth}
        <small>月</small>
      </Box>
      <Box fontSize="lg" fontWeight="bold">
        {startDate}
      </Box>
    </Center>
  )
}
