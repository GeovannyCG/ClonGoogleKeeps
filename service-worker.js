// service-worker.js

const CACHE_NAME = 'mi-pwa-cache-v1';
const urlsToCache = [
    './index.html',
    './board.html',
    './assets/css/style-index.css',
    './assets/css/style-board.css',
    './board.js',
    './login.js',
    './assets/images/logo-keep.webp',
    './assets/images/logo-login-darkmode-1.png',
    './manifest.json',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
    './assets/images/user.jpg',
    'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css'
];

// Evento de instalación
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caché abierta');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento de activación
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Borrando cache antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Evento de fetch
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Devuelve la respuesta almacenada en caché si está disponible
                if (response) {
                    return response;
                }

                // Si no está en caché, realiza una solicitud de red y la agrega a la caché
                return fetch(event.request)
                    .then((response) => {
                        // Comprueba si la respuesta es válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
    );
});
