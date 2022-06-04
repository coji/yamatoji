import {
  Auth,
  AuthError,
  AuthProvider,
  PopupRedirectResolver,
  signInWithRedirect,
  signOut
} from 'firebase/auth'
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query'
import { GithubAuthProvider } from 'firebase/auth'
import { auth } from '~/libs/firebase'

export function useAuthSignInWithRedirect(
  auth: Auth,
  useMutationOptions?: UseMutationOptions<
    never,
    AuthError,
    { provider: AuthProvider }
  >
): UseMutationResult<never, AuthError, { provider: AuthProvider }> {
  return useMutation<never, AuthError, { provider: AuthProvider }>(
    ({ provider }) => {
      return signInWithRedirect(auth, provider)
    },
    useMutationOptions
  )
}

export function useAuthSignOut(
  auth: Auth,
  useMutationOptions?: UseMutationOptions<void, AuthError, void>
): UseMutationResult<void, AuthError, void> {
  return useMutation<void, AuthError, void>(() => {
    return signOut(auth)
  }, useMutationOptions)
}

export const useAuthAction = () => {
  const authSignIn = useAuthSignInWithRedirect(auth)
  const authSignOut = useAuthSignOut(auth)

  const signInWithGitHub = () => {
    const provider = new GithubAuthProvider()
    return authSignIn.mutate({
      provider
    })
  }

  const signOut = () => {
    return authSignOut.mutate()
  }

  return {
    signInWithGitHub,
    signOut
  }
}
