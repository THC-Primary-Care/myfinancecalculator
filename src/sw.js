// PCN Calculator Service Worker

const CACHE_NAME = "pcn-calculator-v1";
const ASSETS_TO_CACHE = ["/pcn_calculator.html", "/", "/index.html"];

// Install event - cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching files");
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Deleting old cache", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip Supabase API requests - they should not be cached
  if (event.request.url.includes("supabase")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response;
      }

      // If not in cache, fetch from network
      return fetch(event.request)
        .then((response) => {
          // Check if valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the fetched response
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // If both cache and network fail, return a fallback
          if (event.request.url.includes("html")) {
            return caches.match("/pcn_calculator.html");
          }
        });
    })
  );
});

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-pcn-data") {
    event.waitUntil(syncData());
  }
});

// Function to sync data with Supabase when back online
async function syncData() {
  try {
    // Get all clients to find the main window
    const clients = await self.clients.matchAll();
    if (clients && clients.length > 0) {
      // Send message to client to initiate data sync
      clients.forEach((client) => {
        client.postMessage({
          type: "SYNC_REQUIRED",
        });
      });
    }
    return true;
  } catch (error) {
    console.error("Background sync failed:", error);
    return false;
  }
}

// Listen for messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CACHE_USER_DATA") {
    // Cache user data sent from the main thread
    const userData = event.data.userData;
    if (userData) {
      // Store in IndexedDB for offline use
      storeUserData(userData);
    }
  }
});

// Function to store user data in IndexedDB
function storeUserData(userData) {
  // This is a simplified implementation
  // A real implementation would use IndexedDB
  console.log("Service Worker: Storing user data for offline use", userData);
  // IndexedDB implementation would go here
}
