import { useQuery } from 'react-query'
import ky from 'ky'
import { useToast } from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'

interface RetrieveSessionProps {
  session: any
}

export const useRetrieveSession = (sessionId: string | null) => {
  const { currentUser } = useAuth()
  const toast = useToast()

  return useQuery<RetrieveSessionProps | null>(
    ['session', sessionId],
    async () => {
      if (!currentUser) {
        toast({ status: 'error', title: 'You must be logged in to do that' })
        return null
      }

      const token = await currentUser.getIdToken()
      return await ky
        .get('/api/retrieve-session', {
          headers: {
            authorization: `Bearer ${token}`
          },
          searchParams: {
            session_id: sessionId!
          }
        })
        .json<RetrieveSessionProps>()
    },
    {
      enabled: !!sessionId && !!currentUser
    }
  )
}
