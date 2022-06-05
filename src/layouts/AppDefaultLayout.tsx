import { Flex, Box } from '@chakra-ui/react'
import Div100vh from 'react-div-100vh'
import { AppNavbar } from '../components/AppNavbar'

interface AppDefaultLayoutProps {
  children: React.ReactNode
}

export const AppDefaultLayout: React.FC<AppDefaultLayoutProps> = ({
  children
}) => {
  return (
    <Div100vh>
      <Flex as="section" flexDirection="column" height="full" width="full">
        <AppNavbar />

        <Box flex="1" p="2" overflow="auto">
          {children}
        </Box>
      </Flex>
    </Div100vh>
  )
}
