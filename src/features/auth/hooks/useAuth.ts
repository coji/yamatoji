import {
  QueryKey,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult
} from 'react-query'
import {
  Auth,
  User,
  AuthError,
  getRedirectResult,
  getAdditionalUserInfo,
  AdditionalUserInfo
} from 'firebase/auth'
import { auth } from '~/libs/firebase'

interface AuthUser {
  user: User | null
  additionalUserInfo: AdditionalUserInfo | null
}

export function useAuthUser<R = User | null>(
  key: QueryKey,
  auth: Auth,
  useQueryOptions?: Omit<UseQueryOptions<User | null, AuthError, R>, 'queryFn'>
): UseQueryResult<R, AuthError> {
  const client = useQueryClient()

  return useQuery<User | null, AuthError, R>({
    ...useQueryOptions,
    queryKey: useQueryOptions?.queryKey ?? key,
    staleTime: useQueryOptions?.staleTime ?? Infinity,
    async queryFn() {
      let resolved = false

      return new Promise<User | null>((resolve, reject) => {
        auth.onAuthStateChanged(async (user) => {
          let additionalUserInfo = null
          if (user) {
            const credential = await getRedirectResult(auth)
            if (credential) {
              additionalUserInfo = getAdditionalUserInfo(credential)
              // TODO: save additionalUserInfo to user
            }
          }

          if (!resolved) {
            resolved = true
            resolve(user)
          } else {
            client.setQueryData<User | null>(key, user)
          }
        }, reject)
      })
    }
  })
}

export const useAuth = () => {
  const currentUser = useAuthUser(['user'], auth)
  return {
    currentUser: currentUser.data,
    isAuthChecking: currentUser.isLoading
  }
}
