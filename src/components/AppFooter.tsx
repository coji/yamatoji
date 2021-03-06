import NextLink from 'next/link'
import { Box, Text, Container, Stack, Flex, Link, Icon } from '@chakra-ui/react'

export const AppFooter = () => (
  <Box as="footer" bg="gray.50" color="gray.600" py="4" fontSize="sm">
    <Container as={Stack} maxW={'6xl'} py={4} textAlign="center">
      <Stack>
        <Box textAlign="center">
          <Flex direction="row" gap={2} flexWrap="wrap" justifyContent="center">
            <Link href="https://github.com/coji/yamatoji" isExternal w="28">
              GitHub
            </Link>

            <Box w="28">
              <NextLink href="/law" passHref>
                <Link>特定商取引法</Link>
              </NextLink>
            </Box>

            <Box w="28">
              <NextLink href="/privacy" passHref>
                <Link>プライバシー</Link>
              </NextLink>
            </Box>

            <Link
              href="https://www.messenger.com/t/679524290/"
              isExternal
              w="28"
            >
              お問い合わせ{' '}
              <Icon color="facebook.500">
                <path
                  fill="currentColor"
                  d="M12 0c-6.627 0-12 4.975-12 11.111 0 3.497 1.745 6.616 4.472 8.652v4.237l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111 0-6.136-5.373-11.111-12-11.111zm1.193 14.963l-3.056-3.259-5.963 3.259 6.559-6.963 3.13 3.259 5.889-3.259-6.559 6.963z"
                />
              </Icon>
            </Link>
          </Flex>
        </Box>

        <Box>
          <Text fontWeight="bold">開発・運営</Text>
          <Link href="https://github.com/coji" isExternal>
            <Text>coji</Text>
          </Link>
        </Box>
      </Stack>
    </Container>
  </Box>
)
