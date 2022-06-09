import { useToast } from '@chakra-ui/react'
import { useMutation, useQueryClient } from 'react-query'
import { useAuth } from '~/features/auth/hooks/useAuth'
import ky from 'ky'

interface EntryMutationProps {
  meetupId: string
}

export const useMeetupEntry = () => {
  const { currentUser } = useAuth()
  const queryClient = useQueryClient()
  const toast = useToast()

  const addEntryMutation = useMutation(
    async ({ meetupId }: EntryMutationProps) => {
      if (!currentUser) {
        toast({ status: 'error', title: 'You must be logged in to do that' })
        return
      }
      // meetup に 参加希望
      const token = await currentUser.getIdToken()
      return await ky
        .post('/api/meetup-add-entry', {
          headers: {
            authorization: `Bearer ${token}`
          },
          json: {
            meetupId
          }
        })
        .text()
    },
    {
      onSuccess: (_data, { meetupId }) => {
        queryClient.invalidateQueries(['meetup', meetupId])
        toast({
          status: 'success',
          title: 'Successfully add to entry'
        })
      },
      onError: (e: any) => {
        toast({
          status: 'error',
          title: 'Failed to add to entry',
          description: e.message
        })
      }
    }
  )

  const removeEntryMutation = useMutation(
    async ({ meetupId }: EntryMutationProps) => {
      if (!currentUser) {
        toast({ status: 'error', title: 'You must be logged in to do that' })
        return
      }
      // meetup に 参加希望
      const token = await currentUser.getIdToken()
      return await ky
        .post('/api/meetup-remove-entry', {
          headers: {
            authorization: `Bearer ${token}`
          },
          json: {
            meetupId
          }
        })
        .text()
    },
    {
      onSuccess: (_data, { meetupId }) => {
        queryClient.invalidateQueries(['meetup', meetupId])
        toast({
          status: 'success',
          title: 'Successfully removed from entry'
        })
      },
      onError: (e: any) => {
        toast({
          status: 'error',
          title: 'Failed to add to entry',
          description: e.message
        })
      }
    }
  )
  return {
    addEntryMutation,
    removeEntryMutation
  }
}
