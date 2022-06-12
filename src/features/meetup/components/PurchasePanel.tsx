import {
  Stack,
  Box,
  Text,
  Heading,
  Button,
  Spacer,
  Alert,
  AlertDescription,
  Modal,
  ModalContent,
  ModalBody,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
  useDisclosure,
  Link
} from '@chakra-ui/react'
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

  const { createSession } = useCreateSession()
  const handlePurchase = async () => {
    // セッション作成して stripe チェックアウトにリダイレクト
    createSession.mutate(
      {
        meetupId: meetup.id!
      },
      {
        onError: (e: any) => {
          console.error(e)
        }
      }
    )
  }

  const purchaseDialog = useDisclosure()

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
        onClick={() => purchaseDialog.onOpen()}
        w="full"
        colorScheme="blue"
        isLoading={createSession.isLoading}
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

      {/* 決済ダイアログ */}
      <Modal isOpen={purchaseDialog.isOpen} onClose={purchaseDialog.onClose}>
        <ModalOverlay></ModalOverlay>
        <ModalContent>
          <ModalHeader>事前決済で参加確定する</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Text>
                事前決済手続きを開始します。「決済開始」ボタンをクリックしてください。
              </Text>

              <Heading color="gray.500" size="xs">
                ご注意: 決済完了後のキャンセルについて
              </Heading>
              <Text color="gray.500" fontSize="xs">
                事前決済完了後にキャンセルをされたい場合は、ページ下部の「お問い合わせ」から、運営者にお問い合わせください。
                <br />
                なお
                <Link
                  isExternal
                  href="https://stripe.com/docs/refunds"
                  color="blue.500"
                >
                  キャンセルに伴う返金でお戻しできるのは参加費のみとなり、
                  システム利用料(3.6%) の返金はできません{' '}
                </Link>
                。あらかじめご了承ください。
              </Text>
            </Stack>
            {createSession.isError && (
              <Alert>
                <AlertDescription>
                  {JSON.stringify(createSession.isError)}
                </AlertDescription>
              </Alert>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={purchaseDialog.onClose}
              colorScheme="gray"
              variant="ghost"
            >
              キャンセル
            </Button>
            <Spacer />
            <Button
              onClick={() => handlePurchase()}
              isLoading={createSession.isLoading}
              colorScheme="blue"
            >
              決済開始
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}
