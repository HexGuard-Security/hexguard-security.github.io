// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeFormHandlers();
    initializeScrollEffects();
    initializeTerminalAnimation();
});

// Navigation functionality
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    
    // Mobile navigation toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to section utility function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Animation initialization
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animation for feature cards
                if (entry.target.classList.contains('feature-card')) {
                    const cards = entry.target.parentNode.querySelectorAll('.feature-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.transform = 'translateY(0)';
                            card.style.opacity = '1';
                        }, index * 100);
                    });
                }
                
                // Stagger animation for pricing cards
                if (entry.target.classList.contains('pricing-card')) {
                    const cards = entry.target.parentNode.querySelectorAll('.pricing-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.transform = 'translateY(0)';
                            card.style.opacity = '1';
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .pricing-card, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Terminal animation
function initializeTerminalAnimation() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    let currentLine = 0;
    
    function showNextLine() {
        if (currentLine < terminalLines.length) {
            terminalLines[currentLine].style.opacity = '1';
            terminalLines[currentLine].style.transform = 'translateX(0)';
            currentLine++;
            setTimeout(showNextLine, 800);
        }
    }
    
    // Hide all lines initially
    terminalLines.forEach(line => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-20px)';
        line.style.transition = 'all 0.3s ease-out';
    });
    
    // Start animation when terminal comes into view
    const terminal = document.querySelector('.terminal-window');
    if (terminal) {
        const terminalObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => showNextLine(), 500);
                    terminalObserver.unobserve(entry.target);
                }
            });
        });
        terminalObserver.observe(terminal);
    }
}

// Form handlers
function initializeFormHandlers() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Form input animations
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if input has value on page load
        if (input.value !== '') {
            input.parentNode.classList.add('focused');
        }
    });
}

// Contact form handler
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#2ed573';
        
        // Reset form
        e.target.reset();
        document.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('focused');
        });
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 2000);
    }, 1500);
}

// Download functionality
function downloadFirmwire(platform = 'default') {
    const downloadUrls = {
        windows: 'https://releases.hexguard.net/firmwire-windows-x64.exe',
        mac: 'https://releases.hexguard.net/firmwire-macos.dmg',
        linux: 'https://releases.hexguard.net/firmwire-linux-x64.tar.gz',
        default: 'https://releases.hexguard.net/firmwire-latest'
    };
    
    // Track download
    trackEvent('download', {
        platform: platform,
        product: 'firmwire'
    });
    
    // Show download notification
    showNotification(`Starting download for ${platform}...`, 'info');
    
    // Simulate download (in real implementation, this would trigger actual download)
    setTimeout(() => {
        showNotification('Download started! Check your downloads folder.', 'success');
    }, 1000);
    
    // In real implementation, uncomment this:
    // window.open(downloadUrls[platform] || downloadUrls.default, '_blank');
}

// Contact sales functionality
function contactSales() {
    // Scroll to contact section
    scrollToSection('contact');
    
    // Pre-fill subject
    setTimeout(() => {
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            subjectSelect.value = 'sales';
            subjectSelect.parentNode.classList.add('focused');
        }
    }, 500);
    
    trackEvent('contact_sales', {
        source: 'pricing_page'
    });
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
        
        // Visual feedback
        const copyBtn = event.target.closest('.copy-btn');
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.color = '#2ed573';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
            copyBtn.style.color = '';
        }, 1500);
    }).catch(() => {
        showNotification('Failed to copy to clipboard', 'error');
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 1001;
        border-left: 4px solid ${getNotificationColor(type)};
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#2ed573',
        error: '#ff4757',
        warning: '#ffa502',
        info: '#0066ff'
    };
    return colors[type] || colors.info;
}

// Analytics tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    // In real implementation, this would send to analytics service
    console.log('Event tracked:', eventName, properties);
    
    // Example: Google Analytics 4
    // gtag('event', eventName, properties);
    
    // Example: Mixpanel
    // mixpanel.track(eventName, properties);
}

// Scroll effects
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero background
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Security grid animation
function animateSecurityGrid() {
    const gridItems = document.querySelectorAll('.grid-item');
    
    gridItems.forEach((item, index) => {
        const delay = parseInt(item.dataset.delay) || 0;
        
        setTimeout(() => {
            item.style.animationDelay = `${delay}ms`;
            item.classList.add('animate');
        }, delay);
        
        // Random pulse intervals
        setInterval(() => {
            const randomDelay = Math.random() * 2000;
            setTimeout(() => {
                item.style.animationDuration = `${1 + Math.random()}s`;
            }, randomDelay);
        }, 5000);
    });
}

// Initialize security grid animation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateSecurityGrid, 1000);
});

// Pricing calculator (if needed for enterprise)
function calculateEnterprisePrice(users, features) {
    // Placeholder for enterprise pricing calculation
    const basePrice = 299;
    const userMultiplier = Math.max(1, Math.floor(users / 10));
    const featureMultiplier = features.length * 0.1 + 1;
    
    return Math.round(basePrice * userMultiplier * featureMultiplier);
}

// Feature comparison toggle
function toggleFeatureComparison() {
    const comparison = document.getElementById('feature-comparison');
    if (comparison) {
        comparison.classList.toggle('visible');
    }
}

// Dark mode toggle (if implemented)
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    
    const isDark = !document.body.classList.contains('light-mode');
    localStorage.setItem('darkMode', isDark);
    
    trackEvent('theme_change', {
        theme: isDark ? 'dark' : 'light'
    });
}

// Load saved theme preference
function loadThemePreference() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'false') {
        document.body.classList.add('light-mode');
    }
}

// Keyboard navigation support
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Skip to main content
        if (e.key === 'Tab' && e.shiftKey && document.activeElement === document.body) {
            e.preventDefault();
            const skipLink = document.querySelector('.skip-link') || createSkipLink();
            skipLink.focus();
        }
        
        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.focus();
            }
        }
    });
}

function createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        border-radius: 4px;
        text-decoration: none;
        z-index: 9999;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    return skipLink;
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Measure page load time
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        trackEvent('page_load_time', {
            load_time: loadTime,
            page: window.location.pathname
        });
    });
    
    // Measure First Contentful Paint
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.name === 'first-contentful-paint') {
                    trackEvent('first_contentful_paint', {
                        fcp_time: Math.round(entry.startTime)
                    });
                }
            });
        });
        
        observer.observe({ entryTypes: ['paint'] });
    }
}

// Error handling
function initializeErrorHandling() {
    window.addEventListener('error', (e) => {
        trackEvent('javascript_error', {
            error_message: e.message,
            error_filename: e.filename,
            error_line: e.lineno,
            error_column: e.colno,
            user_agent: navigator.userAgent
        });
    });
    
    // Handle promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        trackEvent('unhandled_promise_rejection', {
            error: e.reason?.message || 'Unknown promise rejection',
            user_agent: navigator.userAgent
        });
    });
}

// Security features demo
function runSecurityDemo() {
    const demoSteps = [
        'Initializing firmware analyzer...',
        'Detecting architecture: ARM Cortex-M4',
        'Extracting firmware components...',
        'Analyzing code patterns...',
        '⚠️  Buffer overflow detected in auth_handler()',
        '⚠️  Hardcoded credentials found in config',
        '⚠️  Weak encryption algorithm detected',
        '✅ Analysis complete - 3 critical issues found',
        'Generating security report...',
        '📊 Report ready for download'
    ];
    
    const terminal = document.querySelector('.terminal-body');
    if (!terminal) return;
    
    // Clear existing content
    terminal.innerHTML = '<div class="terminal-line">$ firmwire analyze demo_firmware.bin</div>';
    
    demoSteps.forEach((step, index) => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.textContent = step;
            
            // Add color coding for different types of messages
            if (step.includes('⚠️')) {
                line.style.color = '#ffa502';
            } else if (step.includes('✅')) {
                line.style.color = '#2ed573';
            } else if (step.includes('📊')) {
                line.style.color = '#00d4aa';
            }
            
            terminal.appendChild(line);
            terminal.scrollTop = terminal.scrollHeight;
        }, index * 1000);
    });
}

// Feature spotlight animation
function initializeFeatureSpotlight() {
    const features = document.querySelectorAll('.feature-card');
    let currentFeature = 0;
    
    function spotlightNextFeature() {
        // Remove spotlight from all features
        features.forEach(feature => feature.classList.remove('spotlight'));
        
        // Add spotlight to current feature
        if (features[currentFeature]) {
            features[currentFeature].classList.add('spotlight');
        }
        
        currentFeature = (currentFeature + 1) % features.length;
    }
    
    // Start spotlight animation when features section is visible
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setInterval(spotlightNextFeature, 3000);
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(featuresSection);
    }
}

// Add CSS for spotlight effect
function addSpotlightStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .feature-card.spotlight {
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 25px 50px rgba(0, 102, 255, 0.3);
            border-color: var(--primary-color);
        }
        
        .feature-card.spotlight .feature-icon {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
    `;
    document.head.appendChild(style);
}

// Lazy loading for images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Service Worker registration (for PWA capabilities)
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                    trackEvent('service_worker_registered');
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                    trackEvent('service_worker_failed', {
                        error: registrationError.message
                    });
                });
        });
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    loadThemePreference();
    initializeKeyboardNavigation();
    initializePerformanceMonitoring();
    initializeErrorHandling();
    initializeFeatureSpotlight();
    addSpotlightStyles();
    initializeLazyLoading();
    registerServiceWorker();
});

// Utility functions for external use
window.HexGuard = {
    scrollToSection,
    downloadFirmwire,
    contactSales,
    copyToClipboard,
    showNotification,
    runSecurityDemo,
    trackEvent
};

// Add animations CSS
const animationStyles = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-in {
    animation: fadeInUp 0.6s ease-out;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.notification-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: var(--transition);
    margin-left: auto;
}

.notification-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
}

/* Mobile menu styles */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(10, 15, 28, 0.98);
        backdrop-filter: blur(20px);
        flex-direction: column;
        padding: 2rem;
        text-align: center;
        transition: var(--transition);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .nav-menu.active {
        top: 100%;
    }
    
    .nav-toggle.active {
        transform: rotate(90deg);
    }
}
`;

// Add the animation styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);