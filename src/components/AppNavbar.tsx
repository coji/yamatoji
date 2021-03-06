import NextLink from 'next/link'
import {
  Link,
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
import { AuthSignInButton } from '~/features/auth/components/AuthSignInButton'

export const AppNavbar = () => {
  const { currentUser, isAuthChecking } = useAuth()
  const { signOut } = useAuthAction()

  return (
    <Flex
      as="nav"
      alignItems="center"
      width="full"
      py="2"
      px={{ base: '2', md: '4' }}
      bgColor="gray.50"
      boxShadow="sm"
    >
      <NextLink href="/" passHref>
        <Link _hover={{ textDecoration: 'none' }}>
          <Heading
            fontWeight="extrabold"
            bgGradient="linear(to-l, #7928CA, #FF0080)"
            bgClip="text"
          >
            Yamatoji
          </Heading>
        </Link>
      </NextLink>

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
        <AuthSignInButton size="sm" />
      )}
    </Flex>
  )
}
