import { Stack, Box, Text, Link, chakra, Button } from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import { AuthSignInButton } from '~/features/auth/components/AuthSignInButton'
import type { Meetup } from '../interfaces/meetup'
import { PoweredByStripeBadge } from './PoweredByStripeBadge'

export const PurchasePanel = ({ meetup }: { meetup: Meetup }) => {
  const { currentUser, isAuthChecking } = useAuth()

  // システム利用料は Stirpe 手数料に合わせて決済金額全体の 3.6%。本体価格 x (1-3.6%) - 本体価格　が手数料率
  const systemCharge =
    Math.round(meetup.ticketPrice / (1 - 0.036)) - meetup.ticketPrice

  return (
    <Stack
      rounded="md"
      minW="16rem"
      border="2px solid"
      borderColor="blue.500"
      spacing="0"
      textAlign="center"
      overflow="hidden"
    >
      <Box
        px="4"
        bgColor="blue.500"
        color="white"
        fontSize="sm"
        fontWeight="bold"
      >
        参加者募集中
      </Box>

      <Stack
        rounded="sm"
        m="1"
        p="4"
        bgColor="white"
        color="gray.800"
        spacing="4"
      >
        <Box>
          <Text fontSize="sm">参加費</Text>
          <Text fontWeight="bold" fontSize="lg">
            {meetup.ticketPrice.toLocaleString()}
            <small> 円</small>
          </Text>
          <Text fontSize="xs">
            <small>
              {' '}
              + システム利用料 <b>{systemCharge} 円</b> (3.6%相当)
            </small>
          </Text>
          <PoweredByStripeBadge />
        </Box>

        {isAuthChecking ? (
          <Box>Loading...</Box>
        ) : currentUser ? (
          <Stack>
            <form action="/api/checkout_sessions" method="POST">
              <Button w="full" type="submit" role="link" colorScheme="blue">
                事前決済して参加確定
              </Button>
            </form>

            <Button
              w="full"
              colorScheme="gray"
              variant="outline"
              color="gray.500"
            >
              参加表明のみ
            </Button>
          </Stack>
        ) : (
          <Box>
            <AuthSignInButton w="full" />
            <Text fontSize="xs">サインインして参加</Text>
          </Box>
        )}
      </Stack>
    </Stack>
  )
}
