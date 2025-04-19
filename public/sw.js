self.addEventListener('push', (event) => {
  const payload = event.data.json();
  const options = {
    body: payload.body,
    icon: '/image1.png',
    vibrate: [200, 100, 200]
  };
  
  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});