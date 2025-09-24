// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeFormHandlers();
    initializeScrollEffects();
    initializeTerminalAnimation();
    enhanceTerminalBadges();
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
                // Ensure final state persists after animation
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
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
    const body = document.querySelector('.terminal-body');
    if (!body) return;
    const lines = Array.from(body.querySelectorAll('.terminal-line'));

    // replace blinking pseudo-caret with a controlled caret element at end
    function appendCaret(line) {
        const old = line.querySelector('.terminal-caret');
        if (old) old.remove();
        const caret = document.createElement('span');
        caret.className = 'terminal-caret';
        line.appendChild(caret);
    }

    // random intelligent delays: base + jitter, longer on "⚡" steps and before results
    function delayFor(text, idx) {
        const base = 220 + Math.random()*180;
        let factor = 1;
        if (/⚡|Running|Extracting/i.test(text)) factor = 1.7;
        if (/CRITICAL|HIGH|MEDIUM|Reports saved|completed/i.test(text)) factor = 1.4;
        // small additional pause every few lines
        if (idx % 3 === 0) factor += 0.2;
        return base * factor;
    }

    // initialize hidden state
    lines.forEach(l => {
        // cache full text for typewriter support
        l.dataset.fulltext = l.textContent || '';
        l.style.opacity = '0';
        l.style.transform = 'translateX(-12px)';
        l.style.transition = 'opacity 0.25s ease-out, transform 0.25s ease-out';
    });

    const terminal = document.querySelector('.terminal-window');
    if (!terminal) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            // play animation
            let t = 350; // initial delay

            function typeLine(line, text, onDone) {
                // remove pseudo-caret to avoid duplicate
                line.classList.remove('typing');
                // clear and reveal progressively
                line.textContent = '';
                appendCaret(line);
                let i = 0;
                (function step() {
                    if (i < text.length) {
                        const ch = text.charAt(i);
                        // insert character before caret
                        const caret = line.querySelector('.terminal-caret');
                        const node = document.createTextNode(ch);
                        if (caret) {
                            line.insertBefore(node, caret);
                        } else {
                            line.appendChild(node);
                            appendCaret(line);
                        }
                        i++;
                        // dynamic typing speed
                        let d = 18 + Math.random()*30;
                        if (/[,.)]/.test(ch)) d += 60; // small pause on punctuation
                        setTimeout(step, d);
                    } else {
                        // finished typing
                        if (typeof onDone === 'function') onDone();
                    }
                })();
            }

            lines.forEach((line, idx) => {
                setTimeout(() => {
                    line.style.opacity = '1';
                    line.style.transform = 'translateX(0)';
                    // clear existing carets
                    lines.forEach(l => { const c=l.querySelector('.terminal-caret'); if(c) c.remove(); });
                    const text = line.dataset.fulltext || '';
                    if (line.classList.contains('typing')) {
                        typeLine(line, text, () => enhanceTerminalBadges());
                    } else {
                        line.textContent = text;
                        appendCaret(line);
                        enhanceTerminalBadges();
                    }
                }, t);
                t += delayFor(line.dataset.fulltext || '', idx);
            });
        });
    }, { threshold: 0.2 });
    observer.observe(terminal);
}

// Convert CWE codes in terminal lines into badges
function enhanceTerminalBadges() {
    const body = document.querySelector('.terminal-body');
    if (!body) return;
    const lines = body.querySelectorAll('.terminal-line');
    lines.forEach(line => {
        const html = line.innerHTML;
        const replaced = html.replace(/\[(CWE-\d+)\]/g, '<span class="badge cwe">$1</span>');
        if (replaced !== html) {
            line.innerHTML = replaced;
        }
    });
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

// Contact form handler -> WhatsApp deep link
function handleContactForm(e) {
    e.preventDefault();

    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();

    if (!name || !message || !email) {
        showNotification('Please provide your name, email, and a message.', 'warning');
        return;
    }

    const phone = '916366934469'; // E.164 without plus for wa.me
    const text = encodeURIComponent(`Hi HexGuard, I am ${name} (${email}).\n\n${message}`);
    const url = `https://wa.me/${phone}?text=${text}`;

    // Open WhatsApp link
    window.open(url, '_blank');

    trackEvent('contact_whatsapp', { name_length: name.length, email_present: !!email, message_length: message.length });
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

// Enhance older versions details to scroll into view when opened
document.addEventListener('DOMContentLoaded', function() {
    const details = document.querySelector('.older-versions details');
    if (details) {
        details.addEventListener('toggle', function() {
            if (details.open) {
                details.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
});

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

// (old grid animation disabled)

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

// Crawling bugs animation in hero
function initializeBugField() {
    const field = document.querySelector('.bug-field');
    if (!field) return;

    const NUM_BUGS = 8;
    const SPEED_PX_PER_SEC = 40; // average speed

    const bugs = [];

    function random(min, max) { return Math.random() * (max - min) + min; }
    function randomInt(min, max) { return Math.floor(random(min, max)); }

    function spawnBug() {
        const el = document.createElement('img');
        el.src = 'img/logo.svg';
        el.alt = 'HexGuard bug';
        el.className = 'bug';
        const rect = field.getBoundingClientRect();
        const x = random(0, rect.width - 36);
        const y = random(0, rect.height - 36);
        el.style.transform = `translate(${x}px, ${y}px) rotate(${randomInt(0,360)}deg)`;
        field.appendChild(el);
        return { el, x, y, angle: random(0, 2*Math.PI), speed: random(0.6, 1.4) * SPEED_PX_PER_SEC };
    }

    for (let i = 0; i < NUM_BUGS; i++) {
        bugs.push(spawnBug());
    }

    // Build cube face specs with varying blue shades
    const faces = field.querySelectorAll('.cube .face');
    faces.forEach(face => {
        if (face.children.length === 0) {
            const grid = parseInt(getComputedStyle(face).getPropertyValue('--grid')) || 28;
            const cells = grid * grid;
            for (let i = 0; i < cells; i++) {
                const spec = document.createElement('div');
                spec.className = 'spec';
                // aqua/cyan darker shades aligned with site theme
                const hue = 182 + Math.floor(Math.random() * 16);   // 182-198
                const sat = 65 + Math.floor(Math.random() * 30);    // 65-95%
                const light = 22 + Math.floor(Math.random() * 20);  // 22-42%
                const light2 = Math.min(50, light + 6);
                spec.style.background = `linear-gradient(135deg, hsl(${hue} ${sat}% ${light}%), hsl(${hue} ${sat}% ${light2}%))`;
                // subtle staggered pulse
                spec.style.animationDuration = `${1.6 + Math.random() * 1.4}s`;
                spec.style.animationDelay = `${Math.random() * 1.2}s`;
                face.appendChild(spec);
            }
        }
    });

    function step(deltaSec) {
        const rect = field.getBoundingClientRect();
        bugs.forEach(b => {
            b.angle += random(-0.4, 0.4) * deltaSec;
            const vx = Math.cos(b.angle) * b.speed * deltaSec;
            const vy = Math.sin(b.angle) * b.speed * deltaSec;
            b.x += vx; b.y += vy;

            const maxX = rect.width - 36;
            const maxY = rect.height - 36;
            if (b.x < 0) { b.x = 0; b.angle = Math.PI - b.angle; }
            if (b.x > maxX) { b.x = maxX; b.angle = Math.PI - b.angle; }
            if (b.y < 0) { b.y = 0; b.angle = -b.angle; }
            if (b.y > maxY) { b.y = maxY; b.angle = -b.angle; }

            // The source bug image points toward top-left. Empirically offset ~225deg.
            const deg = (b.angle * 180 / Math.PI) + 225;
            b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${deg}deg)`;
        });
    }

    let last = performance.now();
    function animate(now) {
        const deltaSec = Math.min(0.05, (now - last) / 1000);
        last = now;
        step(deltaSec);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
        const rect = field.getBoundingClientRect();
        bugs.forEach(b => {
            b.x = Math.max(0, Math.min(rect.width - 36, b.x));
            b.y = Math.max(0, Math.min(rect.height - 36, b.y));
        });
    });
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

// Three.js firmware-themed hero visualization
function initializeHeroThree() {
    const mount = document.getElementById('hero-three');
    if (!mount || !window.THREE) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 1000);
    camera.position.set(0, 0, 26);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    mount.appendChild(renderer.domElement);

    // Modern particle aesthetic (timeless) using shader-driven points
    const COUNT = 24000;
    const positions = new Float32Array(COUNT * 3);
    const base = new Float32Array(COUNT * 3); // unit sphere base positions
    const colors = new Float32Array(COUNT * 3);
    const rand = (min, max) => Math.random() * (max - min) + min;
    const radius = 8.5;
    for (let i = 0; i < COUNT; i++) {
        // Fibonacci sphere distribution
        const t = i / COUNT;
        const phi = Math.acos(1 - 2 * t);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const ux = Math.sin(phi) * Math.cos(theta);
        const uy = Math.sin(phi) * Math.sin(theta);
        const uz = Math.cos(phi);
        base[i*3+0] = ux;
        base[i*3+1] = uy;
        base[i*3+2] = uz;
        positions[i*3+0] = ux * radius;
        positions[i*3+1] = uy * radius;
        positions[i*3+2] = uz * radius;
        const c = 0.6 + Math.random()*0.4;
        colors[i*3+0] = 0.0 + 0.1 * c; // subtle aqua tint via shader
        colors[i*3+1] = 0.8 * c;
        colors[i*3+2] = 0.7 * c;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('base', new THREE.BufferAttribute(base, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const uniforms = {
        uTime: { value: 0 },
        uRadius: { value: radius },
        uAmp: { value: 2.2 },
        uNoiseScale: { value: 1.15 },
        uPulse: { value: 0.0 },
        uScanY: { value: 0.0 },
        uScanW: { value: 0.15 },
        uScanI: { value: 0.35 }
    };

    const vertexShader = `
        attribute vec3 base;
        attribute vec3 color;
        uniform float uTime;
        uniform float uRadius;
        uniform float uAmp;
        uniform float uNoiseScale;
        uniform float uPulse;
        varying vec3 vColor;
        varying float vScanMix;

        // Simple 3D noise (value noise blend)
        float hash(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7, 74.7))) * 43758.5453123); }
        float noise(vec3 x){
          vec3 i = floor(x); vec3 f = fract(x);
          float n000 = hash(i + vec3(0,0,0));
          float n001 = hash(i + vec3(0,0,1));
          float n010 = hash(i + vec3(0,1,0));
          float n011 = hash(i + vec3(0,1,1));
          float n100 = hash(i + vec3(1,0,0));
          float n101 = hash(i + vec3(1,0,1));
          float n110 = hash(i + vec3(1,1,0));
          float n111 = hash(i + vec3(1,1,1));
          vec3 u = f*f*(3.0-2.0*f);
          return mix(mix(mix(n000, n100, u.x), mix(n010, n110, u.x), u.y),
                     mix(mix(n001, n101, u.x), mix(n011, n111, u.x), u.y), u.z);
        }

        void main(){
          float t = uTime * 0.35;
          // layered noise for organic morph
          float n1 = noise(base * (uNoiseScale*0.9) + vec3(0.0, t, 0.0));
          float n2 = noise(base * (uNoiseScale*1.6) + vec3(t*0.7, 0.0, -t*0.5));
          float disp = (n1*0.6 + n2*0.4 - 0.5) * uAmp * (1.0 + 0.5*uPulse);
          vec3 pos = normalize(base) * (uRadius + disp);
          // subtle drift across surface
          pos += vec3(sin(t+base.y*3.0), cos(t*0.6+base.z*2.5), sin(t*0.8+base.x*2.0)) * 0.15;
          // scanline mix factor based on world-space Y (approx via pos.y in model space)
          vScanMix = pos.y;
          vColor = color;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 1.6 + disp*0.3;
          gl_PointSize *= (300.0 / - (modelViewMatrix * vec4(pos,1.0)).z);
        }
    `;
    const fragmentShader = `
        precision mediump float;
        varying vec3 vColor;
        uniform float uScanY; uniform float uScanW; uniform float uScanI;
        varying float vScanMix;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if(d>0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * 0.95;
          float scan = smoothstep(uScanY - uScanW, uScanY, vScanMix) * smoothstep(uScanY + uScanW, uScanY, vScanMix);
          vec3 col = mix(vColor, vec3(0.0, 1.0, 0.85), scan * uScanI);
          gl_FragColor = vec4(col, alpha);
        }
    `;

    const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    });
    const points = new THREE.Points(geom, mat);
    scene.add(points);

    function resize() {
        const { clientWidth, clientHeight } = mount;
        renderer.setSize(clientWidth, clientHeight, false);
        camera.aspect = clientWidth / Math.max(1, clientHeight);
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    function animate(time){
        uniforms.uTime.value = (time||0)/1000.0;
        // slow parallax rotation
        points.rotation.y += 0.0012;
        points.rotation.x = Math.sin(uniforms.uTime.value*0.3)*0.08;
        // breathing pulse and scan sweep
        uniforms.uPulse.value = (sin(uniforms.uTime.value*0.9)+1.0)*0.5;
        uniforms.uScanY.value = sin(uniforms.uTime.value*0.5)*0.6; // sweep up/down
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
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
    initializeHqMap();
    initializeHeroThree();
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

// Initialize Leaflet map for offices (Bangkok + Bengaluru)
function initializeHqMap() {
    const mapEl = document.getElementById('hq-map');
    if (!mapEl || typeof L === 'undefined') return;

    // Approximate coordinates
    const bkkCoords = [13.7258, 100.5326]; // Silom Soi 3, Bangkok
    const blrCoords = [12.8456, 77.6600];  // Electronic City Phase 1, Bengaluru

    const map = L.map('hq-map', {
        zoomControl: true,
        scrollWheelZoom: false
    }).setView(bkkCoords, 5);

    // Light base tiles, tinted blue via CSS for site theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    // Markers
    const bkkMarker = L.marker(bkkCoords).addTo(map);
    bkkMarker.bindPopup('<b>HexGuard HQ</b><br>Silom 3, Bang Rak, Bangkok');

    const blrMarker = L.marker(blrCoords).addTo(map);
    blrMarker.bindPopup('<b>HexGuard Security Pvt Ltd, Bengaluru</b><br>12th Cross, Electronic City Phase 1, Bengaluru - 560100');

    // Fit to both offices
    const bounds = L.latLngBounds([bkkCoords, blrCoords]);
    map.fitBounds(bounds, { padding: [40, 40] });
    // Zoom out slightly for wider regional context
    map.setZoom(map.getZoom() - 1);
}

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