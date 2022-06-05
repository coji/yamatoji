import { Box, Container, Stack, Flex, Link, Text } from '@chakra-ui/react'

export const AppFooter = () => (
  <Box bg="gray.50" color="gray.600" py="4" fontSize="sm">
    <Container as={Stack} maxW={'6xl'} py={4} textAlign="center">
      <Stack>
        <Box textAlign="center">
          <Flex direction="row" gap={4} flexWrap="wrap" justifyContent="center">
            <Link href="https://www.techtalk.jp/#contact" isExternal>
              お問い合わせ
            </Link>

            <Box>|</Box>

            <Link href="https://www.techtalk.jp/privacy" isExternal>
              プライバシー
            </Link>
          </Flex>
        </Box>

        <Text>
          &copy; {new Date().getFullYear()}{' '}
          <Link fontWeight="bold" href="https://www.techtalk.jp/" isExternal>
            TechTalk.jp
          </Link>{' '}
          All Rights Reserved.
        </Text>
      </Stack>
    </Container>
  </Box>
)
