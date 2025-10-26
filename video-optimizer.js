class VideoOptimizer {
    constructor() {
        this.videos = [];
        this.intersectionObserver = null;
        this.isMobile = this.detectMobile();
        this.networkSpeed = 'fast'; // fast, medium, slow
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
            
            if (connection.effectiveType === 'slow-2g') {
                this.networkSpeed = 'slow'; // slow - show images
            } else if (connection.effectiveType === '2g') {
                this.networkSpeed = 'slow'; // slow - show images
            } else if (connection.effectiveType === '3g') {
                this.networkSpeed = 'medium'; // Medium - show _slow videos
            } else if (connection.effectiveType === '4g') {
                this.networkSpeed = 'fast'; // Fast - show regular videos
            } else {
                // Fallback: check downlink speed
                if (connection.downlink && connection.downlink < 0.5) {
                    this.networkSpeed = 'slow'; // slow - show images
                } else if (connection.downlink && connection.downlink < 1.5) {
                    this.networkSpeed = 'medium'; // Slow - show _slow videos
                } else {
                    this.networkSpeed = 'fast'; // Fast - show regular videos
                }
            }
        } else {
            // Fallback when connection API is not available
            this.networkSpeed = 'fast';
        }
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!this.loadedVideos.has(entry.target)) {
                        this.loadVideoOnIntersection(entry.target);
                    }
                    
                    if (entry.target.tagName === 'VIDEO' && entry.target.readyState >= 2) {
                        entry.target.play().catch(err => {
                            if (err.name !== 'AbortError') {
                                console.warn(`Autoplay failed for video:`, err);
                            }
                        });
                    }
                } else {
                    if (entry.target.tagName === 'VIDEO' && !entry.target.paused) {
                        entry.target.pause();
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
    }

    loadVideoOnIntersection(videoElement) {
        const baseName = videoElement.dataset.src;
        if (!baseName) return;

        const srcPath = this.getSourcePath(videoElement);
        if (!srcPath) return;

        const sourceElement = videoElement.querySelector('source');
        if (!sourceElement) return;

        // Load video immediately
        this.loadVideo(videoElement, sourceElement, srcPath);
    }

    getSourcePath(videoElement) {
        if (!videoElement.dataset.src) return null;
        
        const baseName = videoElement.dataset.src;
        
        if (this.networkSpeed === 'slow') {
            // Very slow connection - return image path instead of video
            return `photo/${baseName}.jpg`;
        }
        
        if (this.isMobile) {
            if (this.networkSpeed === 'medium') {
                return `lowbitrate/${baseName}_slow.mp4`;
            } else {
                return `lowbitrate/${baseName}3_stretched.mp4`;
            }
        } else {
            if (this.networkSpeed === 'medium') {
                return `MP4/${baseName}_slow.mp4`;
            } else {
                return `MP4/${baseName}.mp4`;
            }
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

        videoElements.forEach(video => {
            this.videos.push(video);
            this.intersectionObserver.observe(video);
        });

    }

    async loadVideo(videoElement, sourceElement, srcPath, isFallback = false) {
        return new Promise((resolve, reject) => {
            if (srcPath.endsWith('.jpg') || srcPath.endsWith('.jpeg') || srcPath.endsWith('.png')) {
                this.loadImage(videoElement, srcPath).then(resolve).catch(reject);
                return;
            }
            
            if (sourceElement.src === srcPath && videoElement.readyState >= 2) {
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
                
                this.loadedVideos.add(videoElement);
                
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
                
                if (srcPath.includes('_slow') && !isFallback) {
                    console.log(`Slow video failed, trying fallback for ${srcPath}`);
                    
                    const baseName = videoElement.dataset.src;
                    const fallbackPath = this.getFallbackVideoPath(baseName, this.isMobile);
                    
                    try {
                        await this.loadVideo(videoElement, sourceElement, fallbackPath, true);
                        resolve();
                        return;
                    } catch (fallbackError) {
                        console.error(`Fallback video also failed:`, fallbackError);
                    }
                }
                reject(error);
            };

            const onLoadStart = () => {
                videoElement.removeEventListener('loadstart', onLoadStart);
            };

            videoElement.addEventListener('canplay', onCanPlay);
            videoElement.addEventListener('error', onError);
            videoElement.addEventListener('loadstart', onLoadStart);
            
            if (sourceElement.src !== srcPath || videoElement.readyState < 2) {
                videoElement.load();
            }
        });
    }

    async loadImage(videoElement, imagePath) {
        return new Promise((resolve, reject) => {
            const container = videoElement.closest('.video-container') || videoElement.parentElement;
            if (!container) {
                reject(new Error('No container found'));
                return;
            }

            const img = document.createElement('img');
            img.src = imagePath;
            
            img.onload = () => {
                videoElement.style.display = 'none';
                
                const articleVideo = container.querySelector('.article-video');
                if (articleVideo) {
                    articleVideo.style.display = 'none';
                }
                
                container.classList.add('image-mode');
                
                container.insertBefore(img, videoElement);
                
                // Mark as loaded
                this.loadedVideos.add(videoElement);
                
                resolve();
            };
            
            img.onerror = (error) => {
                reject(error);
            };
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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