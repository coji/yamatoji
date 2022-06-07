import { Box, Image, AspectRatio, Stack } from '@chakra-ui/react'
import dayjs from '~/libs/dayjs'
import { Meetup } from '~/features/meetup/interfaces/meetup'
import { MeetupImageBlock } from './MeetupImageBlock'
import { MeetupDateBlock } from './MeetupDateBlock'
import { MeetupTitleBlock } from './MeetupTitleBlock'

interface MeetupCardProps {
  meetup: Meetup
}
export const MeetupCard = ({ meetup }: MeetupCardProps) => {
  return (
    <Box
      rounded="md"
      w="full"
      border="1px solid"
      borderColor="gray.200"
      _hover={{ borderColor: 'blue.200' }}
    >
      <MeetupImageBlock meetup={meetup} />

      <Stack direction="row" gap="4" p="2">
        <MeetupDateBlock meetup={meetup} />
        <MeetupTitleBlock meetup={meetup} />
      </Stack>
    </Box>
  )
}
