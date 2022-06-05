import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AppDefaultLayout } from '~/layouts/AppDefaultLayout'

const theme = extendTheme({})

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => JSX.Element
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ||
    ((page) => <AppDefaultLayout>{page}</AppDefaultLayout>)

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider resetCSS theme={theme}>
        {getLayout(<Component {...pageProps} />)}
      </ChakraProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default MyApp
