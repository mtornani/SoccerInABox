// Soccer in a Box - Service Worker
// Versione cache - incrementa per force update
const CACHE_VERSION = 'soccer-in-a-box-v1.0.0';
const CACHE_NAME = `${CACHE_VERSION}`;

// File da cachare per funzionamento offline
const CACHE_FILES = [
    './',
    './index.html',
    './soccer_css.css',
    './soccer_app_js.js',
    './soccer_manifest.json',
    './assets/methodology.json'
];

// URL che richiedono sempre aggiornamento (API, dati dinamici)
const SKIP_CACHE_URLS = [
    // Aggiungi qui eventuali URL da non cachare
];

// === INSTALLAZIONE SERVICE WORKER ===
self.addEventListener('install', (event) => {
    console.log('🔧 Soccer in a Box SW: Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 SW: Caching core files');
                return cache.addAll(CACHE_FILES);
            })
            .then(() => {
                console.log('✅ SW: Installation complete');
                // Forza attivazione immediata
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ SW: Installation failed', error);
            })
    );
});

// === ATTIVAZIONE SERVICE WORKER ===
self.addEventListener('activate', (event) => {
    console.log('🚀 Soccer in a Box SW: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                // Rimuovi cache vecchie
                const deletePromises = cacheNames
                    .filter(cacheName => {
                        return cacheName !== CACHE_NAME && 
                               cacheName.startsWith('soccer-in-a-box-');
                    })
                    .map(cacheName => {
                        console.log('🗑️ SW: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    });
                
                return Promise.all(deletePromises);
            })
            .then(() => {
                console.log('✅ SW: Activation complete');
                // Prendi controllo di tutte le pagine immediatamente
                return self.clients.claim();
            })
            .catch((error) => {
                console.error('❌ SW: Activation failed', error);
            })
    );
});

// === INTERCETTAZIONE RICHIESTE (FETCH) ===
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);
    
    // Strategia di caching: Cache-First per risorse statiche
    event.respondWith(
        cacheFirstStrategy(event.request)
    );
});

// === STRATEGIE DI CACHING ===

// Cache-First: Cerca prima nella cache, poi nella rete
async function cacheFirstStrategy(request) {
    try {
        // 1. Prova a servire dalla cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('📦 SW: Serving from cache:', request.url);
            return cachedResponse;
        }
        
        // 2. Se non in cache, fetch dalla rete
        console.log('🌐 SW: Fetching from network:', request.url);
        const networkResponse = await fetch(request);
        
        // 3. Se risposta valida, aggiungi alla cache
        if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            const cache = await caches.open(CACHE_NAME);
            
            // Non cachare richieste non-GET o URL da skipppare
            if (request.method === 'GET' && 
                !shouldSkipCache(request.url)) {
                cache.put(request, responseToCache);
                console.log('💾 SW: Cached response:', request.url);
            }
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('🔥 SW: Network failed, trying cache fallback:', error);
        
        // Fallback: Cerca nella cache se la rete fallisce
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback finale: Pagina offline personalizzata per navigazione
        if (request.destination === 'document') {
            return createOfflinePage();
        }
        
        // Per altre risorse, lancia l'errore
        throw error;
    }
}

// Network-First: Prova prima la rete, poi la cache (per dati dinamici)
async function networkFirstStrategy(request) {
    try {
        // 1. Prova prima la rete
        const networkResponse = await fetch(request);
        
        // 2. Se successo, aggiorna cache e restituisci
        if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, responseToCache);
        }
        
        return networkResponse;
        
    } catch (error) {
        // 3. Se rete fallisce, prova cache
        console.log('🔥 SW: Network failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// === UTILITY FUNCTIONS ===

// Controlla se URL deve essere skippato dalla cache
function shouldSkipCache(url) {
    return SKIP_CACHE_URLS.some(skipUrl => 
        url.includes(skipUrl)
    );
}

// Crea pagina offline personalizzata
function createOfflinePage() {
    const offlineHtml = `
        <!DOCTYPE html>
        <html lang="it">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="theme-color" content="#2c5aa0">
            <title>Soccer in a Box - Offline</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: linear-gradient(135deg, #2c5aa0, #1e3d72);
                    color: white;
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .offline-container {
                    text-align: center;
                    max-width: 400px;
                    padding: 40px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 16px;
                    backdrop-filter: blur(10px);
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 20px;
                }
                h1 { margin-bottom: 16px; }
                p { margin-bottom: 24px; opacity: 0.9; }
                .retry-btn {
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background 0.3s;
                }
                .retry-btn:hover {
                    background: #45a049;
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">⚽</div>
                <h1>Soccer in a Box</h1>
                <p>L'app funziona anche offline!<br>Controlla la tua connessione per sincronizzare i dati.</p>
                <button class="retry-btn" onclick="window.location.reload()">
                    Riprova
                </button>
            </div>
        </body>
        </html>
    `;
    
    return new Response(offlineHtml, {
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-store'
        }
    });
}

// === GESTIONE MESSAGGI ===
self.addEventListener('message', (event) => {
    console.log('💬 SW: Received message:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
        return;
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_VERSION,
            cacheSize: CACHE_FILES.length
        });
        return;
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME)
            .then(() => {
                event.ports[0].postMessage({
                    success: true,
                    message: 'Cache cleared successfully'
                });
            })
            .catch((error) => {
                event.ports[0].postMessage({
                    success: false,
                    error: error.message
                });
            });
        return;
    }
});

// === GESTIONE AGGIORNAMENTI ===
self.addEventListener('updatefound', () => {
    console.log('🔄 SW: Update found, installing new version...');
});

// === SYNC BACKGROUND (per futuri sviluppi) ===
self.addEventListener('sync', (event) => {
    console.log('🔄 SW: Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Implementa qui la logica di sync per dati offline
            console.log('📡 SW: Background sync not implemented yet')
        );
    }
});

// === NOTIFICHE PUSH (per futuri sviluppi) ===
self.addEventListener('push', (event) => {
    console.log('🔔 SW: Push notification received');
    
    // Implementa qui la gestione delle notifiche push
    // per alerts di match, promemoria, etc.
});

// === ERROR HANDLING ===
self.addEventListener('error', (event) => {
    console.error('❌ SW: Error occurred:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('❌ SW: Unhandled promise rejection:', event.reason);
});

// === LOG INIZIALE ===
console.log(`
🚀 Soccer in a Box Service Worker ${CACHE_VERSION}
📦 Caching ${CACHE_FILES.length} files for offline use
⚽ Ready for match analysis!
`);

// === UTILITY: Pulizia cache periodica ===
// Rimuove cache entries vecchie di oltre 30 giorni
async function cleanupOldCache() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const dateHeader = response.headers.get('date');
                if (dateHeader) {
                    const responseDate = new Date(dateHeader).getTime();
                    if (responseDate < thirtyDaysAgo) {
                        await cache.delete(request);
                        console.log('🗑️ SW: Removed old cache entry:', request.url);
                    }
                }
            }
        }
    } catch (error) {
        console.error('❌ SW: Cache cleanup failed:', error);
    }
}

// Esegui pulizia cache ogni volta che si attiva il SW
self.addEventListener('activate', (event) => {
    event.waitUntil(cleanupOldCache());
});