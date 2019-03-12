// How to cahche the entire page
const cacheName = 'v2'

self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed')
})

self.addEventListener('activate', (e) => {
  console.log('Service Worker: activated')
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if(cache !== cacheName) {
            console.log('Service Worker: Clearing old cache')
            return caches.delete(cache)
          }
        })
      )
    })
  )
})

// Call fetch event

self.addEventListener('fetch', e => {
  console.log('Service Worker: Fetching')
  e.respondWith(
    fetch(e.request)
    .then(res => {
      // make clone of responce
      const resClone = res.clone()
      caches
        .open(cacheName)
        .then(cache => {
          // Add responce to cache
          cache.put(e.request, resClone)
        })
      return res
    }).catch(err => caches.match(e.request).then(res => res))
  )
})