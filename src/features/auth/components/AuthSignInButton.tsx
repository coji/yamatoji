import { Button } from '@chakra-ui/react'
import { useAuthAction } from '~/features/auth/hooks/useAuthAction'

export const AuthSignInButton: React.FC = () => {
  const { signInWithGitHub } = useAuthAction()
  return (
    <Button
      variant="outline"
      colorScheme="blue"
      onClick={() => signInWithGitHub()}
    >
      GitHubアカウントで続ける
    </Button>
  )
}
