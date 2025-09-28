// Shivneri Transport JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize App
function initializeApp() {
    initNavigation();
    initCarousel();
    initFormValidation();
    initScrollEffects();
    initTestimonials();
    initTrackingSystem();
    initHeroButtons();
}

// Initialize Hero Section Buttons
function initHeroButtons() {
    // Fix the Track Shipment button in hero section
    const heroButtons = document.querySelectorAll('.hero-actions .btn');
    heroButtons.forEach(button => {
        if (button.textContent.includes('Track Shipment')) {
            button.onclick = function() {
                scrollToSection('tracking');
            };
        } else if (button.textContent.includes('Get Quote')) {
            button.onclick = function() {
                scrollToSection('quote-form');
            };
        }
    });
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
        spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translate(7px, -6px)' : 'none';
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--color-surface)';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Carousel functionality
function initCarousel() {
    const carousel = document.getElementById('carousel');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dotsContainer = document.getElementById('carousel-dots');
    let currentSlide = 0;
    let slideInterval;

    // Create dots
    slides.forEach((slide, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Start automatic slideshow
    startSlideshow();

    // Pause on hover
    carousel.addEventListener('mouseenter', stopSlideshow);
    carousel.addEventListener('mouseleave', startSlideshow);
}

// Form validation and submission
function initFormValidation() {
    const quoteForm = document.getElementById('quote-form-element');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {
                origin: document.getElementById('origin').value,
                destination: document.getElementById('destination').value,
                weight: document.getElementById('weight').value,
                date: document.getElementById('date').value,
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value
            };

            // Validate form data
            if (validateQuoteForm(data)) {
                submitQuoteForm(data);
            }
        });
    }

    // Real-time validation
    const inputs = quoteForm?.querySelectorAll('input') || [];
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove previous error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    switch (field.id) {
        case 'origin':
        case 'destination':
            if (!value) {
                isValid = false;
                errorMessage = 'This field is required';
            }
            break;
        case 'weight':
            if (!value) {
                isValid = false;
                errorMessage = 'Please specify weight or size';
            }
            break;
        case 'date':
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (!value || selectedDate < today) {
                isValid = false;
                errorMessage = 'Please select a valid future date';
            }
            break;
        case 'name':
            if (!value) {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            }
            break;
        case 'phone':
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!value) {
                isValid = false;
                errorMessage = 'Phone number is required';
            } else if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;
    }

    if (!isValid) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        errorElement.style.color = 'var(--color-error)';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--space-4)';
        field.parentNode.appendChild(errorElement);
    }

    return isValid;
}

function validateQuoteForm(data) {
    let isValid = true;
    const fields = ['origin', 'destination', 'weight', 'date', 'name', 'phone'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function submitQuoteForm(data) {
    // Show loading state
    const submitButton = document.querySelector('#quote-form-element button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Show success message
        showNotification('Quote request submitted successfully! We will contact you within 2 hours.', 'success');
        
        // Reset form
        document.getElementById('quote-form-element').reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Scroll effects and smooth scrolling
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .fleet-card, .testimonial-card, .pricing-card, .step');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
}

// Smooth scroll to section - Updated to handle tracking section correctly
function scrollToSection(sectionId) {
    // Map section aliases to actual IDs
    const sectionMap = {
        'tracking': 'tracking',
        'track': 'tracking',
        'quote': 'quote-form',
        'quote-form': 'quote-form'
    };

    const actualSectionId = sectionMap[sectionId] || sectionId;
    const section = document.getElementById(actualSectionId);
    
    if (section) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const sectionTop = section.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Testimonials functionality
function initTestimonials() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Tracking system
function initTrackingSystem() {
    const trackingInput = document.getElementById('tracking-input');
    const trackingResult = document.getElementById('tracking-result');

    if (trackingInput) {
        trackingInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                trackShipment();
            }
        });
    }
}

function trackShipment() {
    const trackingNumber = document.getElementById('tracking-input').value.trim();
    const trackingResult = document.getElementById('tracking-result');

    if (!trackingNumber) {
        showNotification('Please enter a tracking number', 'error');
        return;
    }

    // Validate tracking number format
    const trackingRegex = /^SHV\d{9}$/i;
    if (!trackingRegex.test(trackingNumber)) {
        showNotification('Invalid tracking number format. Please use format: SHV123456789', 'error');
        return;
    }

    // Show loading
    trackingResult.style.display = 'block';
    trackingResult.innerHTML = '<div class="tracking-loading">🔄 Tracking your shipment...</div>';

    // Simulate tracking API call
    setTimeout(() => {
        const mockTrackingData = generateMockTrackingData(trackingNumber);
        displayTrackingResult(mockTrackingData);
    }, 2000);
}

function generateMockTrackingData(trackingNumber) {
    const statuses = [
        { status: 'Order Confirmed', date: '2025-09-25 10:30', location: 'Mumbai Hub', completed: true },
        { status: 'Picked Up', date: '2025-09-25 14:15', location: 'Mumbai Hub', completed: true },
        { status: 'In Transit', date: '2025-09-26 08:45', location: 'Pune Hub', completed: true },
        { status: 'Out for Delivery', date: '2025-09-27 09:20', location: 'Destination City', completed: true },
        { status: 'Delivered', date: '2025-09-27 16:30', location: 'Customer Address', completed: false }
    ];

    return {
        trackingNumber: trackingNumber,
        currentStatus: 'Out for Delivery',
        estimatedDelivery: '2025-09-27',
        timeline: statuses
    };
}

function displayTrackingResult(data) {
    const trackingResult = document.getElementById('tracking-result');
    
    const html = `
        <div class="tracking-info">
            <h3>Tracking: ${data.trackingNumber}</h3>
            <div class="current-status">
                <strong>Current Status:</strong> <span class="status status--info">${data.currentStatus}</span>
            </div>
            <div class="estimated-delivery">
                <strong>Estimated Delivery:</strong> ${data.estimatedDelivery}
            </div>
            
            <div class="tracking-timeline">
                <h4>Shipment Timeline</h4>
                ${data.timeline.map(item => `
                    <div class="timeline-item ${item.completed ? 'completed' : 'pending'}">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <div class="timeline-status">${item.status}</div>
                            <div class="timeline-date">${item.date}</div>
                            <div class="timeline-location">${item.location}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    trackingResult.innerHTML = html;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-base);
        padding: var(--space-16);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform var(--duration-normal) var(--ease-standard);
    `;

    // Add type-specific styling
    if (type === 'success') {
        notification.style.borderLeftColor = 'var(--color-success)';
        notification.style.borderLeftWidth = '4px';
    } else if (type === 'error') {
        notification.style.borderLeftColor = 'var(--color-error)';
        notification.style.borderLeftWidth = '4px';
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

// Pricing plan selection
document.addEventListener('click', function(e) {
    if (e.target.textContent.includes('Choose')) {
        const planName = e.target.closest('.pricing-card').querySelector('h3').textContent;
        showNotification(`${planName} plan selected! Please fill the quote form for more details.`, 'success');
        scrollToSection('quote-form');
    }
});

// Service cards "Learn More" functionality
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'Learn More') {
        const serviceName = e.target.closest('.service-card').querySelector('h3').textContent;
        showNotification(`Learn more about ${serviceName}. Contact us for detailed information.`, 'info');
        scrollToSection('contact');
    }
});

// Fleet card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const fleetCards = document.querySelectorAll('.fleet-card');
    
    fleetCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Handle contact form submission (if any contact forms are added later)
function handleContactForm(formData) {
    showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle phone number formatting
document.addEventListener('input', function(e) {
    if (e.target.id === 'phone') {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.startsWith('91')) {
                value = '+91 ' + value.substring(2);
            } else if (value.length === 10) {
                value = '+91 ' + value;
            }
        }
        e.target.value = value;
    }
});

// Add loading states to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') && e.target.type === 'submit') {
        const button = e.target;
        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Processing...';
        
        setTimeout(() => {
            button.disabled = false;
            button.textContent = originalText;
        }, 2000);
    }
});

// Initialize tooltips for interactive elements
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Call tooltip initialization
initTooltips();

// Handle browser back/forward navigation
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.section) {
        scrollToSection(e.state.section);
    }
});

// Save scroll position for navigation
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        const section = this.getAttribute('href').substring(1);
        history.pushState({section: section}, '', '#' + section);
    });
});

// Performance optimization: Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();