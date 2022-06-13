import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Text,
  Stack,
  Link,
  Heading,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { useRetrieveSession } from '../hooks/useRetrieveSession'

export const PurchaseResult = () => {
  const router = useRouter()
  const dialog = useDisclosure()
  const [result, setResult] = useState<'success' | 'canceled' | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const retreieveSession = useRetrieveSession(sessionId)

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
      // 成功コールバック
      setResult('success')
      setSessionId(query.get('session_id'))

      query.delete('success')
      query.delete('session_id')

      router.replace({
        pathname: `/meetup/${String(router.query.id)}`,
        search: query.toString()
      })

      dialog.onOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal isOpen={dialog.isOpen} onClose={dialog.onClose}>
      <ModalOverlay></ModalOverlay>
      <ModalContent>
        <ModalHeader>事前決済完了</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack>
            <Text>
              事前決済が完了し、参加確定となりました。ありがとうございます。
            </Text>

            <Box>
              {retreieveSession.data && (
                <Table>
                  <Tbody>
                    <Tr>
                      <Th>お名前</Th>
                      <Td>
                        {retreieveSession.data.session.customer_details.name}
                      </Td>
                    </Tr>
                    <Tr>
                      <Th>email</Th>
                      <Td>{retreieveSession.data.session.customer_email}</Td>
                    </Tr>
                    <Tr>
                      <Th>お支払い金額</Th>
                      <Td>
                        {retreieveSession.data.session.amount_total}
                        <small>円</small>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              )}
            </Box>

            <Heading color="gray.500" size="xs">
              キャンセルについて
            </Heading>
            <Text color="gray.500" fontSize="xs">
              参加をキャンセルされたい場合はページ下部の「お問い合わせ」から、運営者にお問い合わせください。
              <br />
              なお
              <Link
                isExternal
                href="https://stripe.com/docs/refunds"
                color="blue.500"
              >
                キャンセルに伴う返金でお戻しできるのは参加費のみとなり、
                システム利用料(3.6%) の返金はできません
              </Link>
              。あしからずご了承ください。
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button w="full" colorScheme="blue" onClick={() => dialog.onClose()}>
            OK
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
