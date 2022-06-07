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

  const capacity = meetup.maxParticipants - meetup.paidParticipants.length
  const isFull = capacity <= 0
  const frameColor = isFull ? 'red.500' : 'blue.500'

  let isAlreadyStatement = false // 自分が参加確定または参加希望しているかどうか
  if (currentUser) {
    isAlreadyStatement =
      meetup.paidParticipants.some(
        (participant) => participant.uid === currentUser.uid
      ) ||
      meetup.entryParticipants.some(
        (participant) => participant.uid === currentUser.uid
      )
  }

  const actionButtonSelector = () => {
    if (isAuthChecking) {
      // 認証処理中
      return <Box>Loading...</Box>
    }

    if (isAlreadyStatement) {
      return <Box>参加表明済み</Box>
    }

    if (currentUser && isFull) {
      // ログイン済み/満席
      return (
        <Button
          w="full"
          colorScheme="gray"
          variant="outline"
          color="gray.500"
          size="sm"
        >
          参加希望のみ
        </Button>
      )
    }

    if (currentUser) {
      return (
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
            size="sm"
          >
            参加希望のみ
          </Button>
        </Stack>
      )
    }

    // 未ログイン
    return (
      <Box>
        <AuthSignInButton w="full" />
        <Text fontSize="xs">サインインして参加を希望</Text>
      </Box>
    )
  }
  const actionButtons = actionButtonSelector()

  return (
    <Stack
      rounded="md"
      minW="16rem"
      border="2px solid"
      borderColor={frameColor}
      spacing="0"
      textAlign="center"
      overflow="hidden"
    >
      <Box
        px="4"
        bgColor={frameColor}
        color="white"
        fontSize="sm"
        fontWeight="bold"
      >
        {isFull ? '参加締切' : '参加者募集中'}
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

        {actionButtons}
      </Stack>
    </Stack>
  )
}
