import type { NextPage } from 'next'
import Head from 'next/head'
import { Stack, Box } from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import { AuthSignInButton } from '~/features/auth/components/AuthSignInButton'
import { AuthSignOutButton } from '~/features/auth/components/AuthSignOutButton'

const Home: NextPage = () => {
  const { currentUser, isAuthChecking } = useAuth()

  return (
    <>
      <Head>
        <title>Yamatoji</title>
      </Head>

      {isAuthChecking && 'Loading...'}
      {!isAuthChecking && (
        <Stack>
          <Box>
            {currentUser ? <AuthSignOutButton /> : <AuthSignInButton />}
          </Box>
          <Box>{JSON.stringify(currentUser)}</Box>
        </Stack>
      )}
    </>
  )
}

export default Home
