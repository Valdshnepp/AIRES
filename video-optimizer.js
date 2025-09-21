// Video Optimizer - Оптимизация загрузки видео для мобильных устройств
class VideoOptimizer {
    constructor() {
        this.videos = [];
        this.intersectionObserver = null;
        this.isMobile = this.detectMobile();
        this.networkSpeed = 'fast'; // fast, medium, slow
        this.init();
    }

    init() {
        console.log(`init started`);
        this.detectNetworkSpeed();
        this.setupIntersectionObserver();
        this.setupServiceWorker();
        this.optimizeExistingVideos();
    }

    detectMobile() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        console.log(`User Agent: ${navigator.userAgent}`);
        console.log(`Определено как: ${isMobile ? 'мобильное' : 'десктоп'}`);
        return isMobile;
    }

    detectNetworkSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.networkSpeed = 'slow';
            } else if (connection.effectiveType === '3g') {
                this.networkSpeed = 'medium';
            } else {
                this.networkSpeed = 'fast';
            }
        }
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                        entry.target.play();
                    // this.loadVideo(entry.target);
                } else {
                    if (!entry.target.paused) {
                        entry.target.pause();
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker зарегистрирован:', registration);
                })
                .catch(error => {
                    console.log('Ошибка регистрации Service Worker:', error);
                });
        }
    }

    optimizeExistingVideos(){
        const videoElements = document.querySelectorAll('.lazy-video');
        const articlePhotos = document.querySelectorAll('.article-photo');
        const articleVideos = document.querySelectorAll('.article-video');

        videoElements.forEach((video, index) => {
            this.videos.push(video);
            this.intersectionObserver.observe(video);


            if (this.isMobile) {
                const photo = articlePhotos[index-1];
                if (photo) {
                    const source = photo.querySelector('source');
                    if (source && video.dataset.src) {
                        source.src = 'lowbitrate/' + video.dataset.src + '.mp4'; // adjust path if needed
                        photo.load();
                        photo.play();
                    }
                }
            } else {
                const vid = articleVideos[index-1];
                if (vid) {
                    const source = vid.querySelector('source');
                    if (source && video.dataset.src) {
                        source.src = 'MP4/' + video.dataset.src + '.mp4'; // adjust path if needed
                        vid.load();
                        vid.play();
                    }
                }
            }
        }); 
    }

    // loadVideo(video) {
    //     if (video.dataset.loaded === 'true') return;
        
    //     const dataSrc = video.dataset.src;
    //     if (!dataSrc) return;

    //     // Определяем качество видео в зависимости от сети и устройства
    //     // let videoQuality = this.getOptimalVideoQuality();
        
    //     // Обновляем источники видео
    //     // this.updateVideoSources(video, videoQuality);
        
    //     // Загружаем видео
    //     // video.load();
    //     video.dataset.loaded = 'true';
        
    //     // Начинаем воспроизведение только если видео видимо
    //     if (this.isVideoVisible(video)) {
    //         video.play().catch(e => {
    //             console.log('Автовоспроизведение заблокировано:', e);
    //         });
    //     }
    // }

    getOptimalVideoQuality() {
        if (this.isMobile) {
            if (this.networkSpeed === 'slow') {
                return 'low';
            } else if (this.networkSpeed === 'medium') {
                return 'low';
            } else {
                return 'standard';
            }
        } else {
            if (this.networkSpeed === 'slow') {
                return 'low';
            } else {
                return 'standard'; // На ПК используем MP4 в хорошем качестве
            }
        }
    }

    // updateVideoSources(video, quality) {
    //     const sources = video.querySelectorAll('source');
    //     sources.forEach(source => {
    //         if (quality === 'webm' && source.type === 'video/webm') {
    //             source.src = source.dataset.srcWebm || source.src;
    //         } else if (quality === 'low' && source.dataset.srcLow) {
    //             source.src = source.dataset.srcLow;
    //         } else if (quality === 'standard') {
    //             // Для стандартного качества используем первый источник (MP4 в хорошем качестве)
    //             if (source.type === 'video/mp4' && !source.dataset.srcLow) {
    //                 // Оставляем текущий источник (MP4/pomidor.mp4)
    //             }
    //         }
    //     });
    // }

    // isVideoVisible(video) {
    //     const rect = video.getBoundingClientRect();
    //     return rect.top < window.innerHeight && rect.bottom > 0;
    // }
}

// Инициализация оптимизатора видео
document.addEventListener('DOMContentLoaded', () => {
    window.videoOptimizer = new VideoOptimizer();
});

// Обработка изменения сетевого соединения
// if ('connection' in navigator) {
//     navigator.connection.addEventListener('change', () => {
//         if (window.videoOptimizer) {
//             window.videoOptimizer.detectNetworkSpeed();
//         }
//     });
// }

// document.addEventListener('visibilitychange', () => {
//     if (document.hidden) {
//         // Останавливаем все видео при скрытии страницы
//         // Pause all videos when page is hidden
//         document.querySelectorAll('.lazy-video').forEach(video => {
//             if (!video.paused) {
//                 video.pause();
//             }
//         });
//     } else {
//         // Resume playing all videos when page becomes visible again
//         document.querySelectorAll('.lazy-video').forEach(video => {
//             // You may want to only play videos that were previously playing.
//             // But a simple approach is to just play all auto/loop videos:
//             if (video.paused) {
//                 video.play().catch(() => { /* handle autoplay restrictions if needed */ });
//             }
//         });
//     }
// });
