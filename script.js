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
        
        // Start animated text sequence
        startTextAnimation();
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
                const animatedElements = entry.target.querySelectorAll('.fade-in-up, .research-card, .project-card, .value-item, .stat-item, .contact-item');
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

    // Observe images (excluding article video) - удалено, так как изображения статей больше не используются

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
    // Отключаем параллакс на мобильных, чтобы не "уползало" видео и не появлялись черные полосы
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile || window.innerWidth <= 1024) {
        return; // без параллакса на мобильных/узких экранах
    }

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
        // Видеоблоки больше не двигаем при скролле (убран эффект увеличения/параллакса)
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

/* Функции для полных статей удалены - теперь используются только видео с описаниями */

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
    
    // Улучшаем загрузку видео на мобильных устройствах
    improveMobileVideoLoading();
});

// Удалены функции мобильной «оптимизации» видео — используем нативное поведение браузера

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

// Удалены агрессивные функции удаления рекламных блоков, которые затрагивали легитимные элементы

// Функция анимации появления текста "Открой дверь в мир будущего"
function startTextAnimation() {
    const words = document.querySelectorAll('.promo-text-animated .word');
    words.forEach((word, index) => {
        setTimeout(() => {
            word.classList.add('visible');
        }, index * 500); // Задержка 0.5 секунды между словами
    });
}

// Функция улучшения загрузки видео на мобильных устройствах
function improveMobileVideoLoading() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        const videos = document.querySelectorAll('video');
        
        videos.forEach(video => {
            // Принудительно загружаем видео
            video.load();
            
            // Добавляем обработчики для лучшей совместимости
            video.addEventListener('canplay', () => {
                video.play().catch(e => {
                    console.log('Автовоспроизведение заблокировано, добавляем кнопку воспроизведения');
                    addPlayButton(video);
                });
            });
            
            // Обработка ошибок загрузки
            video.addEventListener('error', () => {
                console.log('Ошибка загрузки видео:', video.src);
            });
        });
    }
}
