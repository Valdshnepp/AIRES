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

// Enhanced form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Валидация в реальном времени
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Очищаем предыдущие ошибки
        clearAllErrors();
        
        const formData = new FormData(this);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();
        
        let hasErrors = false;
        
        // Валидация имени
        if (!name || name.length < 2) {
            showFieldError('name', 'Имя должно содержать минимум 2 символа');
            hasErrors = true;
        }
        
        // Валидация email
        if (!email) {
            showFieldError('email', 'Email обязателен');
            hasErrors = true;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Введите корректный email адрес');
            hasErrors = true;
        }
        
        // Валидация темы
        if (!subject || subject.length < 5) {
            showFieldError('subject', 'Тема должна содержать минимум 5 символов');
            hasErrors = true;
        }
        
        // Валидация сообщения
        if (!message || message.length < 10) {
            showFieldError('message', 'Сообщение должно содержать минимум 10 символов');
            hasErrors = true;
        }
        
        if (hasErrors) {
            showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Отправляется...';
        submitBtn.disabled = true;
        
        // Отправка через Formspree
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                showNotification('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
                this.reset();
                clearAllErrors();
            } else {
                throw new Error('Ошибка отправки');
            }
        })
        .catch(error => {
            showNotification('Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.', 'error');
            console.error('Form submission error:', error);
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// Функции валидации
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field.id, 'Это поле обязательно для заполнения');
    }
}

function clearFieldError(e) {
    const field = e.target;
    clearFieldErrorById(field.id);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Убираем предыдущую ошибку
    clearFieldErrorById(fieldId);
    
    // Создаем элемент ошибки
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // Добавляем класс ошибки к полю
    field.classList.add('error');
    
    // Вставляем ошибку после поля
    field.parentNode.appendChild(errorElement);
}

function clearFieldErrorById(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Убираем класс ошибки
    field.classList.remove('error');
    
    // Убираем элемент ошибки
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearAllErrors() {
    const fields = contactForm.querySelectorAll('input, textarea');
    fields.forEach(field => {
        clearFieldErrorById(field.id);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Добавляем в body
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

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
    

});
