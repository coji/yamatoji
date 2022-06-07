import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import { promises as fs } from 'fs'
import MarkdownIt from 'markdown-it'
import styles from '../assets/privacy.module.css'
import { Container, Heading, Box } from '@chakra-ui/react'
import { AppReturnToTopButton } from '~/components/AppReturnToTopButton'

interface Props {
  content: string
}

const Privacy: NextPage<Props> = ({ content }) => {
  return (
    <>
      <Head>
        <title>プライバシーポリシー - Yamatoji</title>
        <meta name="description" content="Technicaly, It's possible." />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="container.lg">
        <Heading textAlign="center" my="4rem">
          Yamatoji プライバシーポリシー
        </Heading>

        <Box
          className={styles.markdown}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <AppReturnToTopButton />
      </Container>
    </>
  )
}
export default Privacy

export const getStaticProps: GetStaticProps = async () => {
  const content = await fs.readFile('src/public/privacy.md')
  const md = new MarkdownIt()
  return {
    props: {
      content: md.render(content.toString())
    }
  }
}
