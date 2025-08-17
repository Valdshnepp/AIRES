// Video and overlay management
let videoActive = true;

function closeVideo() {
    const promo = document.querySelector('.promo');
    const body = document.body;
    const header = document.querySelector('.header');
    
    promo.classList.add('minimized');
    body.classList.remove('video-active');
    header.classList.remove('video-active');
    videoActive = false;
}

// Enhanced smooth transitions and animations
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = document.querySelector('.header');
    
    body.classList.add('video-active');
    header.classList.add('video-active');
    
    // Show overlay text after 1.5 seconds
    setTimeout(() => {
        const overlay = document.querySelector('.promo-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
            overlay.style.transform = 'translateY(0)';
        }
    }, 1500);

    // Initialize all animations
    initializeAnimations();
    
    // Smooth scroll for navigation
    initializeSmoothScroll();
    
    // Parallax effects
    initializeParallax();
    

});

// Initialize all animations with Intersection Observer
function initializeAnimations() {
    // Observer for sections (excluding video sections)
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate child elements with delay (excluding video overlays)
                const animatedElements = entry.target.querySelectorAll('.fade-in-up, .research-card, .project-card, .value-item, .stat-item, .contact-item, .article-stage');
                animatedElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Observe all sections except video sections and article video section
    document.querySelectorAll('section:not(.promo):not(.article-video-section)').forEach(section => {
        sectionObserver.observe(section);
    });

    // Observer for individual elements (excluding article video elements)
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    // Observe text elements (excluding video overlay elements)
    document.querySelectorAll('.section-title:not(.article-video-title), .hero-title, .hero-subtitle, .hero-description').forEach(el => {
        elementObserver.observe(el);
    });

    // Observe images (excluding article video)
    document.querySelectorAll('.article-img').forEach(el => {
        elementObserver.observe(el);
    });

    // Observer for stats with counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach((stat, index) => {
                    setTimeout(() => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        animateCounter(stat, target);
                    }, index * 200);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

// Enhanced smooth scrolling
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced parallax effects
function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });

        // Parallax for video sections
        const videoSections = document.querySelectorAll('.promo, .article-video-section');
        videoSections.forEach(section => {
            const speed = 0.3;
            const yPos = -(scrolled * speed);
            section.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Enhanced counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Enhanced mobile navigation (sidebar with overlay)
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');
const navOverlay = document.getElementById('navOverlay');



function openMobileMenu() {
    navList.classList.add('active');
    navToggle.classList.add('active');
    if (navOverlay) navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    navList.classList.remove('active');
    navToggle.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navList.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
});

if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
}

// Close when clicking a link
navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMobileMenu);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
        closeMobileMenu();
    }
});

// Close mobile menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
    

});

// Enhanced header scroll effect
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Close/minimize video when scrolling down
    if (videoActive && window.scrollY > 100) {
        closeVideo();
    }
});

function closeVideo() {
    const promo = document.querySelector('.promo');
    const body = document.body;
    const header = document.querySelector('.header');
    
    promo.classList.add('minimized');
    body.classList.remove('video-active');
    header.classList.remove('video-active');
    videoActive = false;
}

// Enhanced project card effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Форма обрабатывается через EmailJS в HTML - убираем дублирующий код

// Функции валидации и уведомлений убраны - EmailJS обрабатывает форму

// Article functions (support multiple articles by id)
function showFullArticle(targetId) {
    // Hide all full-articles
    document.querySelectorAll('.article-full').forEach(el => el.style.display = 'none');
    const target = document.getElementById(targetId);
    if (target) target.style.display = 'block';
    // Убираем автоматический скролл - пользователь остается на месте
}

function showPreview(targetId) {
    const target = document.getElementById(targetId);
    if (target) target.style.display = 'none';
    // Убираем автоматический скролл - пользователь остается на месте
}

// Enhanced page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // Animate hero section on load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 200);
        });
    }, 500);
    
    // Оптимизация видео для мобильных устройств
    optimizeVideosForMobile();
    
    // Дополнительная проверка видео через 2 секунды
    setTimeout(() => {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Принудительно показываем видео
            video.style.display = 'block';
            video.style.visibility = 'visible';
            video.style.opacity = '1';
            
            // Устанавливаем правильное позиционирование
            if (video.classList.contains('promo-video') || video.classList.contains('article-video')) {
                video.style.position = 'absolute';
                video.style.top = '0';
                video.style.left = '0';
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'cover';
                video.style.objectPosition = 'center';
                video.style.zIndex = '1';
                
                // Убираем все трансформации
                video.style.transform = 'none';
                video.style.webkitTransform = 'none';
                video.style.mozTransform = 'none';
                video.style.msTransform = 'none';
            }
        });
    }, 2000);
    
    // Дополнительная проверка через 3 секунды для мобильных
    setTimeout(() => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                // Принудительно исправляем все стили
                video.style.cssText = `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    object-position: center !important;
                    z-index: 1 !important;
                    transform: none !important;
                    -webkit-transform: none !important;
                `;
                
                // Исправляем контейнер
                const container = video.parentElement;
                if (container) {
                    container.style.cssText = `
                        position: relative !important;
                        overflow: hidden !important;
                        width: 100% !important;
                        height: 100vh !important;
                        min-height: 100vh !important;
                    `;
                }
            });
        }
    }, 3000);
    
    // Дополнительная проверка через 4 секунды для мобильных
    setTimeout(() => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // Принудительно исправляем размеры всех контейнеров видео
            const videoContainers = document.querySelectorAll('.promo, .article-video-section');
            videoContainers.forEach(container => {
                container.style.cssText = `
                    position: relative !important;
                    overflow: hidden !important;
                    width: 100% !important;
                    height: 100vh !important;
                    min-height: 100vh !important;
                    max-height: none !important;
                `;
            });
            
            // Принудительно исправляем все видео
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                video.style.cssText = `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                    object-position: center !important;
                    z-index: 1 !important;
                    transform: none !important;
                    -webkit-transform: none !important;
                `;
            });
        }
    }, 4000);
});

// Улучшенная функция оптимизации видео для мобильных устройств
function optimizeVideosForMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-optimized');
        
        // Принудительно исправляем все видео
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Базовые стили для принудительного отображения
            video.style.cssText = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                object-position: center !important;
                z-index: 1 !important;
                transform: none !important;
                -webkit-transform: none !important;
                -moz-transform: none !important;
                -ms-transform: none !important;
                background: #000 !important;
                will-change: auto !important;
                backface-visibility: visible !important;
                -webkit-backface-visibility: visible !important;
                filter: none !important;
                -webkit-filter: none !important;
            `;
            
            // Принудительно устанавливаем размеры контейнера
            const container = video.parentElement;
            if (container) {
                container.style.cssText = `
                    position: relative !important;
                    overflow: hidden !important;
                    width: 100% !important;
                    height: 100vh !important;
                    min-height: 100vh !important;
                    max-height: none !important;
                    background: transparent !important;
                    transform: none !important;
                    -webkit-transform: none !important;
                `;
            }
            
            // Исправляем проблемы с воспроизведением
            video.playsInline = true;
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('playsinline', 'true');
            video.muted = true;
            video.loop = true;
            
            // Добавляем обработчики для исправления зависания
            video.addEventListener('loadedmetadata', () => {
                video.style.display = 'block';
                video.style.visibility = 'visible';
                video.style.opacity = '1';
            });
            
            video.addEventListener('canplay', () => {
                video.style.display = 'block';
                video.style.visibility = 'visible';
                video.style.opacity = '1';
            });
            
            // Исправляем проблемы с паузой/воспроизведением
            video.addEventListener('pause', () => {
                setTimeout(() => {
                    if (video.paused && !video.ended) {
                        video.play().catch(() => {});
                    }
                }, 100);
            });
            
            // Принудительно воспроизводим при ошибках
            video.addEventListener('error', () => {
                setTimeout(() => {
                    video.load();
                    video.play().catch(() => {});
                }, 1000);
            });
        });
        
        // Проверяем скорость соединения
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                videos.forEach(video => {
                    video.autoplay = false;
                    video.muted = false;
                    addPlayButton(video);
                });
            }
        }
        
        // Оптимизация для мобильных устройств
        videos.forEach(video => {
            video.preload = 'metadata';
            
            // Улучшенная обработка скролла
            let isPaused = false;
            let scrollTimeout;
            
            window.addEventListener('scroll', () => {
                if (!isPaused) {
                    video.pause();
                    isPaused = true;
                }
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (video.autoplay) {
                        video.play().catch(() => {});
                    }
                    isPaused = false;
                }, 1000);
            });
        });
        
        // Дополнительные проверки
        setTimeout(() => {
            forceVideoDisplay();
        }, 1000);
        
        setTimeout(() => {
            forceVideoDisplay();
        }, 3000);
        
        setTimeout(() => {
            forceVideoDisplay();
        }, 5000);
    }
}

// Функция принудительного исправления отображения видео
function forceVideoDisplay() {
    const videos = document.querySelectorAll('video');
    const containers = document.querySelectorAll('.promo, .article-video-section');
    
    // Принудительно исправляем все видео
    videos.forEach(video => {
        video.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            object-position: center !important;
            z-index: 1 !important;
            transform: none !important;
            -webkit-transform: none !important;
            background: #000 !important;
            will-change: auto !important;
            backface-visibility: visible !important;
        `;
        
        // Принудительно загружаем и воспроизводим
        if (video.readyState === 0) {
            video.load();
        }
        
        if (video.paused && !video.ended) {
            video.play().catch(() => {});
        }
    });
    
    // Принудительно исправляем все контейнеры
    containers.forEach(container => {
        container.style.cssText = `
            position: relative !important;
            overflow: hidden !important;
            width: 100% !important;
            height: 100vh !important;
            min-height: 100vh !important;
            max-height: none !important;
            background: transparent !important;
            transform: none !important;
            -webkit-transform: none !important;
        `;
    });
}

// Функция для исправления зависания видео
function fixVideoFreezing() {
    const videos = document.querySelectorAll('video');
    
    videos.forEach(video => {
        // Сбрасываем видео при зависании
        if (video.readyState > 0 && video.paused && !video.ended) {
            video.currentTime = 0;
            video.load();
            video.play().catch(() => {});
        }
        
        // Принудительно обновляем рендеринг
        video.style.transform = 'translateZ(0)';
        video.style.webkitTransform = 'translateZ(0)';
    });
}

// Запускаем исправления каждые 10 секунд
setInterval(fixVideoFreezing, 10000);

// Функция добавления кнопки воспроизведения
function addPlayButton(video) {
    const playButton = document.createElement('button');
    playButton.className = 'video-play-button';
    playButton.innerHTML = '▶';
    playButton.style.display = 'none';
    
    // Показываем кнопку при паузе
    video.addEventListener('pause', () => {
        playButton.style.display = 'block';
    });
    
    // Скрываем кнопку при воспроизведении
    video.addEventListener('play', () => {
        playButton.style.display = 'none';
    });
    
    // Обработчик клика по кнопке
    playButton.addEventListener('click', () => {
        video.play();
    });
    
    // Добавляем кнопку в контейнер видео
    const videoContainer = video.parentElement;
    if (videoContainer) {
        videoContainer.style.position = 'relative';
        videoContainer.appendChild(playButton);
    }
}

// Функция для удаления рекламы от Reg.ru
function removeRegRuAds() {
    // Удаляем элементы по содержимому
    const adTexts = [
        'Россия работает умно',
        'Курс на цифровизацию',
        'Наши дроны',
        'В России так мощно растет IT',
        'Память - без границ',
        'Алкоголь уже не в моде'
    ];
    
    // Удаляем по тексту
    adTexts.forEach(text => {
        const elements = Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent && el.textContent.includes(text)
        );
        elements.forEach(el => {
            if (el.style.background === 'white' || 
                el.style.backgroundColor === 'white' ||
                el.style.background === '#fff' ||
                el.style.backgroundColor === '#fff') {
                el.remove();
            }
        });
    });
    
    // Удаляем белые блоки с изображениями
    const whiteBlocks = document.querySelectorAll('div[style*="background: white"], div[style*="background-color: white"]');
    whiteBlocks.forEach(block => {
        if (block.querySelector('img')) {
            block.remove();
        }
    });
    
    // Удаляем элементы без классов/ID (часто реклама)
    const suspiciousElements = document.querySelectorAll('body > div:not([class]):not([id])');
    suspiciousElements.forEach(el => {
        if (el.style.background === 'white' || 
            el.style.backgroundColor === 'white' ||
            el.innerHTML.includes('img')) {
            el.remove();
        }
    });
}

// Запускаем удаление рекламы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    removeRegRuAds();
    
    // Повторно проверяем через 2 секунды (на случай динамической загрузки)
    setTimeout(removeRegRuAds, 2000);
    
    // Проверяем каждые 5 секунд
    setInterval(removeRegRuAds, 5000);
});

// Дополнительная проверка при изменении DOM
const observer = new MutationObserver(() => {
    removeRegRuAds();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
