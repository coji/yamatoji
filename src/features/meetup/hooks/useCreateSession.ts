import { useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import { useToast } from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import ky from 'ky'

interface CreateSessionProps {
  meetupId: string
}

export const useCreateSession = () => {
  const router = useRouter()
  const { currentUser } = useAuth()
  const toast = useToast()

  const createSession = useMutation(
    async ({ meetupId }: CreateSessionProps) => {
      if (!currentUser) {
        toast({ status: 'error', title: 'You must be logged in to do that' })
        return
      }

      // stripe チェックアウトセッションを生成
      const token = await currentUser.getIdToken()
      const checkoutUri = await ky
        .post('/api/create-session', {
          headers: {
            authorization: `Bearer ${token}`
          },
          json: {
            meetupId
          }
        })
        .json<string>()

      router.push(checkoutUri) // チェックアウトURLに遷移
    }
  )

  return {
    createSession
  }
}
