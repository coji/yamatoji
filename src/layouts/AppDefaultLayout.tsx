import { Flex, Box } from '@chakra-ui/react'
import Div100vh from 'react-div-100vh'
import { AppNavbar } from '../components/AppNavbar'
import { AppFooter } from '../components/AppFooter'

interface AppDefaultLayoutProps {
  children: React.ReactNode
}

export const AppDefaultLayout: React.FC<AppDefaultLayoutProps> = ({
  children
}) => {
  return (
    <Div100vh>
      <Flex as="section" flexDirection="column" minHeight="100vh">
        <AppNavbar />

        <Box
          as="main"
          flex="1"
          p={{ base: '0', sm: '2' }}
          overflow="auto"
          flexGrow="1"
        >
          {children}
        </Box>

        <AppFooter />
      </Flex>
    </Div100vh>
  )
}
