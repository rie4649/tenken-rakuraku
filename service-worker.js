const CACHE_NAME = "tenken-rakuraku-v7";

const FILES_TO_CACHE = [
"./manifest.json",
"./icon-192.png",
"./icon-512.png"
];

self.addEventListener("install", function(event){
self.skipWaiting();
event.waitUntil(
caches.open(CACHE_NAME).then(function(cache){
return cache.addAll(FILES_TO_CACHE);
})
);
});

self.addEventListener("activate", function(event){
event.waitUntil(
caches.keys().then(function(keys){
return Promise.all(
keys.map(function(key){
if(key !== CACHE_NAME){
return caches.delete(key);
}
})
);
}).then(function(){
return self.clients.claim();
})
);
});

self.addEventListener("fetch", function(event){
if(event.request.method !== "GET")return;

const url = new URL(event.request.url);
const isAppFile = url.origin === location.origin &&
(event.request.destination === "document" || url.pathname.endsWith(".js") || url.pathname.endsWith(".css"));

if(isAppFile){
event.respondWith(
fetch(event.request).then(function(response){
const copy = response.clone();
caches.open(CACHE_NAME).then(function(cache){
cache.put(event.request, copy);
});
return response;
}).catch(function(){
return caches.match(event.request);
})
);
return;
}

event.respondWith(
caches.match(event.request).then(function(response){
return response || fetch(event.request);
})
);
});
