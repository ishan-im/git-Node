import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import '../public/static/nprogress.css'

import Layout from '../components/Layout'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleStart = (url) => {
      console.log(`Loading: ${url}`)
      NProgress.start()
    }
    const handleStop = () => {
      NProgress.done()
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])


  return (
    <>
      <Layout/>
      <Component {...pageProps} />
     
    </>
  )
}
