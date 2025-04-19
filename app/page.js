import Notification from '@/components/Noti'
import QuoteGenerator from '@/components/QuoteGenerator'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Quote Generator PWA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Notification />
      <main className="min-h-screen bg-gray-700 p-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-200">
          Daily Inspiration
        </h1>
        <QuoteGenerator />
      </main>
    </>
  )
}