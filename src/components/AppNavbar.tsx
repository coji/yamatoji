import {
  Flex,
  Heading,
  Spacer,
  CircularProgress,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Box,
  Text,
  Divider,
  Avatar
} from '@chakra-ui/react'
import { useAuth } from '~/features/auth/hooks/useAuth'
import { useAuthAction } from '~/features/auth/hooks/useAuthAction'

export const AppNavbar = () => {
  const { currentUser, isAuthChecking } = useAuth()
  const { signInWithGitHub, signOut } = useAuthAction()

  return (
    <Flex
      alignItems="center"
      width="full"
      py="2"
      px={{ base: '2', md: '4' }}
      bgColor="gray.50"
      boxShadow="sm"
    >
      <Heading color="gray.600">Yamatoji</Heading>
      <Spacer />

      {currentUser ? (
        <Menu>
          <MenuButton>
            <Avatar
              size="sm"
              name={currentUser.displayName || undefined}
              src={currentUser.photoURL || undefined}
            ></Avatar>
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Stack direction="row">
                <Avatar
                  size="sm"
                  name={currentUser.displayName || undefined}
                  src={currentUser.photoURL || undefined}
                />

                <Box>
                  <Text fontSize="sm">{currentUser.displayName}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {currentUser.email}
                  </Text>
                </Box>
              </Stack>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
          </MenuList>
        </Menu>
      ) : isAuthChecking ? (
        <CircularProgress isIndeterminate size="32px" />
      ) : (
        <Button size="sm" colorScheme="blue" onClick={() => signInWithGitHub()}>
          Sign in
        </Button>
      )}
    </Flex>
  )
}
