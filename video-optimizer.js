// Video Optimizer - Оптимизация загрузки видео для мобильных устройств
class VideoOptimizer {
    constructor() {
        this.videos = [];
        this.intersectionObserver = null;
        this.isMobile = this.detectMobile();
        this.networkSpeed = 'fast'; // fast, slow
        this.loadingQueue = [];
        this.isLoading = false;
        this.loadedVideos = new Set();
        this.init();
    }

    init() {
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
            console.log('Network connection info:', {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            });
            
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.networkSpeed = 'slow';
            } else if (connection.effectiveType === '3g') {
                this.networkSpeed = 'slow';
            } else if (connection.effectiveType === '4g') {
                this.networkSpeed = 'fast';
            } else {
                // Fallback: check downlink speed
                if (connection.downlink && connection.downlink < 1) {
                    this.networkSpeed = 'slow';
                } else if (connection.downlink && connection.downlink < 2) {
                    this.networkSpeed = 'slow';
                } else {
                    this.networkSpeed = 'fast';
                }
            }
        } else {
            // Fallback when connection API is not available
            this.networkSpeed = 'fast';
            console.log('Network connection API not available, defaulting to fast');
        }
        
        console.log(`Detected network speed: ${this.networkSpeed}`);
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // If video is not loaded yet, prioritize it in the loading queue
                    if (!this.loadedVideos.has(entry.target)) {
                        this.prioritizeVideo(entry.target);
                    }
                    
                    // Only try to play if video is ready
                    if (entry.target.readyState >= 2) {
                        entry.target.play().catch(err => {
                            if (err.name !== 'AbortError') {
                                console.warn(`Autoplay failed for video:`, err);
                            }
                        });
                    }
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

    prioritizeVideo(videoElement) {
        // Find the video in the loading queue and move it to the front
        const queueIndex = this.loadingQueue.findIndex(item => item.videoElement === videoElement);
        if (queueIndex > 0) {
            const prioritizedItem = this.loadingQueue.splice(queueIndex, 1)[0];
            this.loadingQueue.unshift(prioritizedItem);
            console.log(`Prioritized video: ${prioritizedItem.srcPath}`);
        }
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
    optimizeExistingVideos() {
        console.log(`optimizeExistingVideos started`);
        const videoElements = Array.from(document.querySelectorAll('.lazy-video'));
        const articleVideos = Array.from(document.querySelectorAll('.article-video'));
        const promoVideos = Array.from(document.querySelectorAll('.promo-video'));

        const getSourcePath = (video) => {
            if (!video.dataset.src) return null;
            
            const baseName = video.dataset.src;
            let folder, fileName;
            
            if (this.isMobile) {
                folder = 'lowbitrate';
                if (this.networkSpeed === 'slow') {
                    // Use _slow postfix for slow connections on mobile
                    fileName = `${baseName}_slow.mp4`;
                } else {
                    fileName = `${baseName}3_stretched.mp4`;
                }
            } else {
                folder = 'MP4';
                if (this.networkSpeed === 'slow') {
                    // Use _slow postfix for slow connections on desktop
                    fileName = `${baseName}_slow.mp4`;
                } else {
                    fileName = `${baseName}.mp4`;
                }
            }
            
            const fullPath = `${folder}/${fileName}`;
            console.log(`Video path for ${baseName} (${this.networkSpeed} network, ${this.isMobile ? 'mobile' : 'desktop'}): ${fullPath}`);
            return fullPath;
        };
        promoVideos.forEach((promoVideo, idx) => {
            const video = videoElements[idx];
            if (!video) return;
            this.videos.push(video);

            const sourceElem = promoVideo.querySelector('source');
            const srcPath = getSourcePath(video);

            if (sourceElem && srcPath) {
                this.addToLoadingQueue(promoVideo, sourceElem, srcPath, true); // High priority for promo videos
            }
        });

        articleVideos.forEach((articleVideo, idx) => {
            if (promoVideos.includes(articleVideo)) return;

            const video = videoElements[idx + promoVideos.length] || videoElements[idx];
            if (!video) return;
            this.videos.push(video);

            const sourceElem = articleVideo.querySelector('source');
            const srcPath = getSourcePath(video);

            if (sourceElem && srcPath) {
                this.addToLoadingQueue(articleVideo, sourceElem, srcPath, false); // Lower priority for article videos
            }
        });

        // Add videos to intersection observer
        this.videos.forEach(video => {
            this.intersectionObserver.observe(video);
        });

        // Start loading process
        this.processLoadingQueue();
    }

    addToLoadingQueue(videoElement, sourceElement, srcPath, isHighPriority = false) {
        // Check if video is already loaded or in queue
        if (this.loadedVideos.has(videoElement) || 
            this.loadingQueue.some(item => item.videoElement === videoElement)) {
            return;
        }

        const queueItem = {
            videoElement,
            sourceElement,
            srcPath,
            isHighPriority,
            timestamp: Date.now()
        };

        if (isHighPriority) {
            // Add high priority items to the beginning of the queue
            this.loadingQueue.unshift(queueItem);
        } else {
            // Add regular items to the end of the queue
            this.loadingQueue.push(queueItem);
        }
    }

    async processLoadingQueue() {
        if (this.isLoading || this.loadingQueue.length === 0) {
            return;
        }

        this.isLoading = true;
        console.log(`Starting sequential video loading. Queue length: ${this.loadingQueue.length}`);

        while (this.loadingQueue.length > 0) {
            const queueItem = this.loadingQueue.shift();
            const { videoElement, sourceElement, srcPath } = queueItem;

            try {
                await this.loadVideo(videoElement, sourceElement, srcPath);
                this.loadedVideos.add(videoElement);
                console.log(`Video loaded: ${srcPath}`);
            } catch (error) {
                console.error(`Failed to load video ${srcPath}:`, error);
            }

            // Add a small delay between video loads to prevent overwhelming the connection
            const delay = this.networkSpeed === 'slow' ? 700 : 10;
            await this.delay(delay);
        }

        this.isLoading = false;
        console.log('All videos loaded');
    }

    async loadVideo(videoElement, sourceElement, srcPath, isFallback = false) {
        return new Promise((resolve, reject) => {
            // Add loading indicator
            this.addLoadingIndicator(videoElement);
            
            // Check if video already has the same source to avoid unnecessary reload
            if (sourceElement.src === srcPath && videoElement.readyState >= 2) {
                this.removeLoadingIndicator(videoElement);
                videoElement.play().catch(err => {
                    console.warn(`Autoplay failed for ${srcPath}:`, err);
                });
                resolve();
                return;
            }
            
            sourceElement.src = srcPath;
            
            const onCanPlay = () => {
                videoElement.removeEventListener('canplay', onCanPlay);
                videoElement.removeEventListener('error', onError);
                videoElement.removeEventListener('loadstart', onLoadStart);
                
                // Remove loading indicator
                this.removeLoadingIndicator(videoElement);
                
                // Use a small delay to ensure the video is ready to play
                setTimeout(() => {
                    videoElement.play().catch(err => {
                        if (err.name !== 'AbortError') {
                            console.warn(`Autoplay failed for ${srcPath}:`, err);
                        }
                    });
                }, 100);
                resolve();
            };

            const onError = async (error) => {
                videoElement.removeEventListener('canplay', onCanPlay);
                videoElement.removeEventListener('error', onError);
                videoElement.removeEventListener('loadstart', onLoadStart);
                
                // Try fallback video if the current one failed and it was a _slow video
                if (srcPath.includes('_slow') && !isFallback) {
                    console.log(`Slow video failed, trying fallback for ${srcPath}`);
                    
                    const baseName = videoElement.dataset.src;
                    const fallbackPath = this.getFallbackVideoPath(baseName, this.isMobile);
                    
                    try {
                        // Retry with fallback path
                        await this.loadVideo(videoElement, sourceElement, fallbackPath, true);
                        resolve();
                        return;
                    } catch (fallbackError) {
                        console.error(`Fallback video also failed:`, fallbackError);
                    }
                }
                
                // Remove loading indicator on error
                this.removeLoadingIndicator(videoElement);
                
                reject(error);
            };

            const onLoadStart = () => {
                // Video started loading, we can remove the loadstart listener
                videoElement.removeEventListener('loadstart', onLoadStart);
            };

            videoElement.addEventListener('canplay', onCanPlay);
            videoElement.addEventListener('error', onError);
            videoElement.addEventListener('loadstart', onLoadStart);
            
            // Only call load() if the video doesn't already have this source
            if (sourceElement.src !== srcPath || videoElement.readyState < 2) {
                videoElement.load();
            }
        });
    }

    addLoadingIndicator(videoElement) {
        const container = videoElement.closest('.video-container') || videoElement.parentElement;
        if (!container) return;

        // Check if loading indicator already exists
        if (container.querySelector('.video-loading-indicator')) return;

        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'video-loading-indicator';
        loadingIndicator.innerHTML = `
            <div class="video-loading-spinner"></div>
            <div class="video-loading-text">Загрузка видео...</div>
        `;

        container.style.position = 'relative';
        container.appendChild(loadingIndicator);
    }

    removeLoadingIndicator(videoElement) {
        const container = videoElement.closest('.video-container') || videoElement.parentElement;
        if (!container) return;

        const loadingIndicator = container.querySelector('.video-loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }

        // Add loaded class to container
        container.classList.add('video-loaded');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get fallback video path if the primary path fails
    getFallbackVideoPath(baseName, isMobile) {
        if (isMobile) {
            return `lowbitrate/${baseName}3_stretched.mp4`;
        } else {
            return `MP4/${baseName}.mp4`;
        }
    }

    getOptimalVideoQuality() {
        if (this.isMobile) {
            if (this.networkSpeed === 'slow') {
                return 'low';
            } else if (this.networkSpeed === 'slow') {
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

    // Method to manually test network speed detection
    async testNetworkSpeedManually() {
        console.log('=== Network Speed Test ===');
        console.log('Initial detection:', this.networkSpeed);
        
        if ('connection' in navigator) {
            const connection = navigator.connection;
            console.log('Connection API info:', {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            });
        } else {
            console.log('Connection API not available');
        }
        
        await this.testNetworkSpeed();
        console.log('Final network speed:', this.networkSpeed);
        console.log('=== End Test ===');
    }
}

// Инициализация оптимизатора видео
document.addEventListener('DOMContentLoaded', () => {
    window.videoOptimizer = new VideoOptimizer();
    
    // Add global test function for debugging
    window.testNetworkSpeed = () => {
        if (window.videoOptimizer) {
            window.videoOptimizer.testNetworkSpeedManually();
        } else {
            console.log('Video optimizer not initialized yet');
        }
    };
    
    // Add global function to check current network speed
    window.getNetworkSpeed = () => {
        if (window.videoOptimizer) {
            console.log('Current network speed:', window.videoOptimizer.networkSpeed);
            return window.videoOptimizer.networkSpeed;
        } else {
            console.log('Video optimizer not initialized yet');
            return null;
        }
    };
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
