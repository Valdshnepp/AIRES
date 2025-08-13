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

// Enhanced mobile navigation
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-list');

navToggle.addEventListener('click', () => {
    navList.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Close mobile menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navList.classList.remove('active');
        navToggle.classList.remove('active');
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
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        if (!name || !email || !subject || !message) {
            alert('Пожалуйста, заполните все поля формы');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Пожалуйста, введите корректный email адрес');
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Отправляется...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Article functions
function showFullArticle() {
    document.getElementById('article-full').style.display = 'block';
    
    // Smooth scroll to article
    setTimeout(() => {
        document.getElementById('article').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function showPreview() {
    document.getElementById('article-full').style.display = 'none';
    
    setTimeout(() => {
        document.getElementById('article').scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
