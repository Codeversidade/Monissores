self.addEventListener('fetch', event => {
  // This is a dummy event listener
  // just to pass the PWA installation criteria on
  // some browsers
});
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');


workbox.routing.registerRout(({request}) => request.destination === "image",
	new workbox.strategies.NetworkFirst()
);