import { Center, Box } from '@chakra-ui/react'
import dayjs from '~/libs/dayjs'
import type { Meetup } from '../interfaces/meetup'

export const MeetupTitleBlock = ({ meetup }: { meetup: Meetup }) => {
  const startAt = dayjs(meetup.startAt)
  const startTime = startAt.tz().format('ddd曜 H:mm')

  return (
    <Box>
      <Box fontSize="sm" fontWeight="bold">
        {startTime}
      </Box>
      <Box noOfLines={2}>{meetup.title}</Box>
      <Box noOfLines={1} fontSize="xs">
        {meetup.locationLabel}
      </Box>
    </Box>
  )
}
