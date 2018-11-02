//add this commented code in main.js for service workers
// //register service worker
// if('serviceWorker' in navigator){
//     window.addEventListener('load',()=>{
//         navigator.serviceWorker.register('./service-worker.js')
//         .then(reg=>console.log('Registered'))
//         .catch(error=>console.log('error',error));
//     });
// }

const cacheName = "v3";
const cacheAssets = ["/","index.html", "main.js", "main.css","web-worker.js"];
self.addEventListener("install", e => {
  console.log("installed");

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log("Caching files");

        cache.addAll(cacheAssets);
      })
      .then(() => {
        self.skipWaiting();
      })
  );
});

self.addEventListener("activate", e => {
  console.log("activated");

  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log("clearing old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", e => {
  console.log("service worker: Fetching");
  e.respondWith(
    fetch(e.request)
      .then(res => {
        //make a clone of responds
        const resClone = res.clone();

        caches.open(cacheName).the(cache => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => caches.match(e.request).then(res => res))
  );
});
