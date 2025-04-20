'use client'
import { useEffect, useState } from 'react'

export default function Notification() {
  const [supported, setSupported] = useState(false)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    const isPushSupported = 'serviceWorker' in navigator && 
                          'PushManager' in window &&
                          'Notification' in window

    setSupported(isPushSupported)

    if (isPushSupported) {
      navigator.serviceWorker.ready.then(async (registration) => {
        try {
          const existingSubscription = await registration.pushManager.getSubscription()
          if (existingSubscription) {
            setSubscription(existingSubscription)
            return
          }

          const permission = await Notification.requestPermission()
          if (permission === 'granted') {
            const subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            })
            setSubscription(subscription)
            
            await fetch('/api/push/subscribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(subscription)
            })
          }
        } catch (error) {
          console.error('Push subscription error:', error)
        }
      })
    }
  }, [])

  if (!supported) return null

  return null
}