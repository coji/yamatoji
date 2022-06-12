import { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import { promises as fs } from 'fs'
import MarkdownIt from 'markdown-it'
import styles from '../assets/markdown.module.css'
import { Container, Heading, Box } from '@chakra-ui/react'
import { AppReturnToTopButton } from '~/components/AppReturnToTopButton'

interface Props {
  content: string
}

const Privacy: NextPage<Props> = ({ content }) => {
  return (
    <>
      <Head>
        <title>特定商取引法に基づく表記 - Yamatoji</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="container.lg">
        <Heading textAlign="center" my="4rem">
          特定商取引法に基づく表記
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
  const content = await fs.readFile('src/public/law.md')
  const md = new MarkdownIt()
  return {
    props: {
      content: md.render(content.toString())
    }
  }
}
