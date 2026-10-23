const CACHE_VERSION="v3";
const CORE_ASSETS=["./","./index.html","./ldl.html","./manifest.json","./css/ldl.css","./js/constants.js","./js/ldl/ldl-state.js","./js/ldl/ldl-audio.js","./js/ldl/ldl-app.js"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE_VERSION).then(cache=>cache.addAll(CORE_ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE_VERSION).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match("./index.html"))))});

