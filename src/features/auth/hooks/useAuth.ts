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
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, firestore } from '~/libs/firebase'

// users コレクションに upsert
const upsertUser = async (
  user: User,
  additionalUserInfo: AdditionalUserInfo | null
) => {
  const params = {
    uid: user.uid,
    displayName: user.displayName || 'github user',
    photoUrl: user.photoURL,
    email: user.email,
    emailVerified: user.emailVerified,
    providers: user.providerData.map((provider) => provider.providerId),
    updatedAt: serverTimestamp(),
    githubUsername: additionalUserInfo?.username // github user name
  }

  // additional user info がない場合は更新しない
  if (additionalUserInfo === null) {
    delete params.githubUsername
  }

  const docRef = doc(firestore, `/users/${user.uid}`)
  await setDoc(docRef, params, { merge: true })
}

export function useAuthUser<R = User | null>(
  key: QueryKey,
  auth: Auth,
  useQueryOptions?: Omit<UseQueryOptions<User | null, AuthError, R>, 'queryFn'>
): UseQueryResult<R, AuthError> {
  const queryClient = useQueryClient()

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
            }

            // ユーザ情報を保存
            await upsertUser(user, additionalUserInfo)
          }

          if (!resolved) {
            resolved = true
            resolve(user)
          } else {
            queryClient.setQueryData<User | null>(key, user)
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
