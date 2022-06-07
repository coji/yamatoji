import { Link, Button, Icon } from '@chakra-ui/react'
import { BiCalendarPlus } from 'react-icons/bi'
import dayjs from '~/libs/dayjs'
import type { Meetup } from '../interfaces/meetup'

export const AddToGoogleCalendar = ({ meetup }: { meetup: Meetup }) => {
  const startAt = dayjs(meetup.startAt).format('YYYYMMDDTHHmm00')
  const endAt = dayjs(meetup.endAt).format('YYYYMMDDTHHmm00')
  const dates = `${startAt}/${endAt}`
  const location = `${meetup.locationLabel}`
  const link = `https://www.google.com/calendar/render?action=TEMPLATE&text=${meetup.title}&dates=${dates}&details=${meetup.description}&location=${location}`

  return (
    <Link href={link} isExternal _hover={{ textDecoration: 'none' }}>
      <Button size="xs" colorScheme="red" variant="outline">
        <Icon mr="2" as={BiCalendarPlus}></Icon>Add
      </Button>
    </Link>
  )
}
