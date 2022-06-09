import { useState, useEffect } from 'react'
import { Link, Button, Icon } from '@chakra-ui/react'
import { BiCalendarPlus } from 'react-icons/bi'
import dayjs from '~/libs/dayjs'
import type { Meetup } from '../interfaces/meetup'

export const AddToGoogleCalendar = ({ meetup }: { meetup: Meetup }) => {
  const [link, setLink] = useState<string>('')

  useEffect(() => {
    const startAt = dayjs(meetup.startAt).format('YYYYMMDDTHHmm00')
    const endAt = dayjs(meetup.endAt).format('YYYYMMDDTHHmm00')
    const dates = `${startAt}/${endAt}`
    const location = `${meetup.locationLabel}`
    const description = encodeURI(
      `${meetup.description}\n\nYamatoji\n${window.location.href}`
    )
    setLink(
      `https://www.google.com/calendar/render?action=TEMPLATE&text=${meetup.title}&dates=${dates}&details=${description}&location=${location}`
    )
  }, [meetup])

  return (
    <Link href={link} isExternal _hover={{ textDecoration: 'none' }}>
      <Button size="xs" colorScheme="blue" variant="outline">
        <Icon mr="2" as={BiCalendarPlus}></Icon>Google Calendar
      </Button>
    </Link>
  )
}
