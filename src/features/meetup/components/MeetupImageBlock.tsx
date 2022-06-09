import { AspectRatio, Image } from '@chakra-ui/react'
import type { Meetup } from '../interfaces/meetup'

export const MeetupImageBlock = ({ meetup }: { meetup: Meetup }) => {
  return (
    <AspectRatio maxW="full" ratio={16 / 9}>
      <Image
        roundedTop={{ sm: 'md' }}
        loading="lazy"
        src={meetup.imageUrl}
        alt="image"
      />
    </AspectRatio>
  )
}
