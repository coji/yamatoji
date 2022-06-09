import { useState } from 'react'
import { useRouter } from 'next/router'
import { useToast } from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import ky from 'ky'

interface CreateSessionProps {
  meetupId: string
}

export const useCreateSession = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { currentUser } = useAuth()
  const toast = useToast()

  const createSession = async ({ meetupId }: CreateSessionProps) => {
    if (!currentUser) {
      toast({ status: 'error', title: 'You must be logged in to do that' })
      return
    }

    setIsLoading(true)

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

    // チェックアウトURLに遷移
    router.push(checkoutUri)

    // 外部サイトにいくまでずっとローディング。戻ってくるときはページ読み込みで初期化されるのでok
    //    setIsLoading(false)
  }

  return {
    isLoading,
    createSession
  }
}
