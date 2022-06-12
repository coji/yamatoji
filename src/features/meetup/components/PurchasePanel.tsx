import { Stack, Box, Text, Button } from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import { AuthSignInButton } from '~/features/auth/components/AuthSignInButton'
import type { Meetup } from '../interfaces/meetup'
import { PoweredByStripeBadge } from './PoweredByStripeBadge'
import { useCreateSession } from '~/features/meetup/hooks/useCreateSession'
import { useMeetupEntry } from '../hooks/useMeetupEntry'

export const PurchasePanel = ({ meetup }: { meetup: Meetup }) => {
  const { currentUser, isAuthChecking } = useAuth()
  const { addEntryMutation, removeEntryMutation } = useMeetupEntry()

  // システム利用料は Stirpe 手数料に合わせて決済金額全体の 3.6%。本体価格 x (1-3.6%) - 本体価格　が手数料率
  const systemCharge =
    Math.round(meetup.ticketPrice / (1 - 0.036)) - meetup.ticketPrice

  const capacity = meetup.maxParticipants - meetup.paidParticipants.length
  const isFull = capacity <= 0
  const frameColor = isFull ? 'red.500' : 'blue.500'

  const { createSession, isLoading } = useCreateSession()
  const handlePurchase = async () => {
    // セッション作成して stripe チェックアウトにリダイレクト
    await createSession({
      meetupId: meetup.id!
    })
  }

  let isAlreadyPaid = false
  let isAlreadyEntry = false
  if (currentUser) {
    isAlreadyPaid = meetup.paidParticipants.some(
      // 購入済み
      (participant) => participant.uid === currentUser.uid
    )
    isAlreadyEntry = meetup.entryParticipants.some(
      // 参加希望済み
      (participant) => participant.uid === currentUser.uid
    )
  }

  // 決済ボタン
  let payButton: React.ReactElement | null = null
  // 決済済み
  if (isAlreadyPaid) {
    payButton = (
      <Button w="full" colorScheme="blue" isDisabled>
        参加確定
      </Button>
    )
  }
  // 未決済 / 満員
  if (!isAlreadyPaid && !isFull) {
    payButton = (
      <Button
        onClick={() => handlePurchase()}
        w="full"
        colorScheme="blue"
        isLoading={isLoading}
      >
        事前決済で参加確定する
      </Button>
    )
  }

  // 参加ボタン
  let entryButton: React.ReactElement | null = null
  // 未参加/未エントリー
  if (!isAlreadyPaid && !isAlreadyEntry) {
    entryButton = (
      <Button
        onClick={() => addEntryMutation.mutate({ meetupId: meetup.id! })}
        isLoading={addEntryMutation.isLoading}
        w="full"
        colorScheme="gray"
        variant="outline"
        color="gray.500"
        size="sm"
      >
        興味あり
      </Button>
    )
  }
  // 参加済み
  if (isAlreadyEntry) {
    entryButton = (
      <Button
        onClick={() => removeEntryMutation.mutate({ meetupId: meetup.id! })}
        isLoading={removeEntryMutation.isLoading}
        w="full"
        colorScheme="gray"
        variant="outline"
        color="gray.500"
        size="sm"
      >
        興味ありを取り消す
      </Button>
    )
  }

  const actionButtonSelector = () => {
    if (isAuthChecking) {
      // 認証処理中
      return <Box>Loading...</Box>
    }

    if (currentUser) {
      return (
        <Stack>
          {payButton}
          {entryButton}
        </Stack>
      )
    } else {
      return (
        <Box>
          <AuthSignInButton w="full" />
          <Text fontSize="xs">サインインして参加</Text>
        </Box>
      )
    }
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
            + システム利用料 <b>{systemCharge} 円</b> <small>(3.6%)</small>
          </Text>
          <PoweredByStripeBadge />
        </Box>

        {actionButtons}
      </Stack>
    </Stack>
  )
}
