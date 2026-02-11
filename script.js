// ===================================
// DOM Elements
// ===================================
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarClose = document.getElementById('sidebarClose');
const navLinks = document.querySelectorAll('.nav-link');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');

// Carousel Elements
const carousel = document.getElementById('carousel');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dots = document.querySelectorAll('.dot');
const viewMoreBtns = document.querySelectorAll('.view-more-btn');

// Gallery Elements
const galleryGrid = document.getElementById('galleryGrid');
const galleryCards = document.querySelectorAll('.gallery-card');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const yearFilters = document.querySelectorAll('.year-filter');
const noResults = document.getElementById('noResults');

// Modal Elements
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalYear = document.getElementById('modalYear');
const modalMedium = document.getElementById('modalMedium');
const modalDescription = document.getElementById('modalDescription');

// Contact Form
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// ===================================
// State Management
// ===================================
let currentSlide = 0;
let autoplayInterval;
let currentModalIndex = 0;
let filteredCards = Array.from(galleryCards);

// ===================================
// Sidebar Functionality
// ===================================
function openSidebar() {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

hamburgerBtn.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// Close sidebar when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        closeSidebar();
        
        // Smooth scroll to section
        setTimeout(() => {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    });
});

// Close sidebar with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        }
        if (modal.classList.contains('active')) {
            closeModal();
        }
    }
});

// ===================================
// Dark Mode Toggle
// ===================================
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Load saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// ===================================
// Carousel Functionality
// ===================================
function showSlide(index) {
    // Handle wrap-around
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === currentSlide) {
            slide.classList.add('active');
        }
    });
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === currentSlide) {
            dot.classList.add('active');
        }
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Manual controls
prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
});

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
});

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        resetAutoplay();
    });
});

// Autoplay
function startAutoplay() {
    autoplayInterval = setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
}

// Start autoplay on load
startAutoplay();

// Pause autoplay when user hovers over carousel
carousel.addEventListener('mouseenter', stopAutoplay);
carousel.addEventListener('mouseleave', startAutoplay);

// Touch swipe support for carousel
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left, show next
            nextSlide();
        } else {
            // Swiped right, show previous
            prevSlide();
        }
        resetAutoplay();
    }
}

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    }
});

// View More Button Functionality
viewMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slideIndex = btn.dataset.slide;
        const slide = slides[slideIndex];
        const description = slide.querySelector('.slide-description');
        
        if (description.classList.contains('expanded')) {
            description.classList.remove('expanded');
            btn.textContent = 'View More';
        } else {
            description.classList.add('expanded');
            btn.textContent = 'View Less';
        }
    });
});

// ===================================
// Gallery Filtering & Search
// ===================================
let currentYearFilter = 'all';
let currentSearchTerm = '';
let currentSort = 'newest';

// Gallery data extraction
const galleryData = Array.from(galleryCards).map((card, index) => ({
    element: card,
    index: index,
    year: card.dataset.year,
    date: new Date(card.dataset.date),
    title: card.querySelector('.card-title').textContent.toLowerCase(),
    medium: card.querySelector('.card-medium').textContent.toLowerCase(),
    description: card.querySelector('.card-teaser').textContent.toLowerCase(),
    image: card.querySelector('.card-image img').src,
    fullYear: card.querySelector('.card-year').textContent,
    fullMedium: card.querySelector('.card-medium').textContent
}));

function filterGallery() {
    let filtered = [...galleryData];
    
    // Filter by year
    if (currentYearFilter !== 'all') {
        filtered = filtered.filter(item => item.year === currentYearFilter);
    }
    
    // Filter by search term
    if (currentSearchTerm) {
        filtered = filtered.filter(item => 
            item.title.includes(currentSearchTerm) ||
            item.medium.includes(currentSearchTerm) ||
            item.description.includes(currentSearchTerm) ||
            item.year.includes(currentSearchTerm)
        );
    }
    
    // Sort
    if (currentSort === 'newest') {
        filtered.sort((a, b) => b.date - a.date);
    } else {
        filtered.sort((a, b) => a.date - b.date);
    }
    
    // Update display
    galleryGrid.innerHTML = '';
    
    if (filtered.length === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
        filtered.forEach(item => {
            galleryGrid.appendChild(item.element);
        });
    }
    
    filteredCards = filtered;
    
    // Re-attach modal click handlers
    attachModalHandlers();
}

// Year filter
yearFilters.forEach(filter => {
    filter.addEventListener('click', () => {
        yearFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
        currentYearFilter = filter.dataset.year;
        filterGallery();
    });
});

// Search with debounce
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        filterGallery();
    }, 300);
});

// Sort
sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    filterGallery();
});

// ===================================
// Modal/Lightbox Functionality
// ===================================
function openModal(index) {
    const item = filteredCards[index];
    if (!item) return;
    
    currentModalIndex = index;
    
    modalImage.src = item.image;
    modalImage.alt = item.title;
    modalTitle.textContent = item.element.querySelector('.card-title').textContent;
    modalYear.textContent = item.fullYear;
    modalMedium.textContent = item.fullMedium;
    modalDescription.textContent = item.element.querySelector('.card-teaser').textContent;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function showNextModalImage() {
    currentModalIndex = (currentModalIndex + 1) % filteredCards.length;
    openModal(currentModalIndex);
}

function showPrevModalImage() {
    currentModalIndex = (currentModalIndex - 1 + filteredCards.length) % filteredCards.length;
    openModal(currentModalIndex);
}

function attachModalHandlers() {
    const currentCards = galleryGrid.querySelectorAll('.gallery-card');
    currentCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            openModal(index);
        });
    });
}

// Initial attachment
attachModalHandlers();

// Modal controls
modalClose.addEventListener('click', closeModal);
modalNext.addEventListener('click', showNextModalImage);
modalPrev.addEventListener('click', showPrevModalImage);

// Click outside to close
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) {
        if (e.key === 'ArrowRight') {
            showNextModalImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevModalImage();
        }
    }
});

// ===================================
// Contact Form Handling
// ===================================
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Simulate form submission
    formMessage.style.display = 'block';
    formMessage.className = 'form-message success';
    formMessage.textContent = `Thank you, ${formData.name}. We have received your message and will contact you at ${formData.email}. This is only a demo form, so no message was actually sent.`;
    
    // Reset form
    contactForm.reset();
    
    // Hide message after 8 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 8000);
});

// ===================================
// Back to Top Button
// ===================================
function toggleBackToTop() {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', toggleBackToTop);

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Optional: unobserve after animation
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
const animatedElements = document.querySelectorAll('.animate-on-scroll');
animatedElements.forEach(el => observer.observe(el));

// ===================================
// Header Scroll Effect
// ===================================
let lastScroll = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// Image Loading Error Handler
// ===================================
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        // If image fails to load, show a placeholder or alt text
        this.style.background = 'var(--bg-secondary)';
        this.style.display = 'flex';
        this.style.alignItems = 'center';
        this.style.justifyContent = 'center';
        this.style.color = 'var(--text-muted)';
        this.style.fontSize = '0.9rem';
        this.style.padding = '1rem';
        console.warn('Image failed to load:', this.src);
    });
});

// ===================================
// Smooth Reveal for Gallery Cards
// ===================================
const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('animated');
            }, index * 100); // Stagger the animations
            galleryObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

galleryCards.forEach(card => {
    galleryObserver.observe(card);
});

// ===================================
// Prevent Context Menu on Images (Optional)
// ===================================
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        // Uncomment to disable right-click on images
        // e.preventDefault();
    });
});

// ===================================
// Performance Optimization: Lazy Loading
// ===================================
if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support native lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===================================
// Initialize on Page Load
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Mausam Art Portfolio Loaded');
    
    // Initial filter
    filterGallery();
    
    // Trigger initial scroll check
    toggleBackToTop();
    
    // Add smooth entrance animation to hero
    setTimeout(() => {
        document.querySelector('.hero').style.opacity = '1';
    }, 100);
});

// ===================================
// Window Resize Handler
// ===================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Close sidebar on desktop resize
        if (window.innerWidth > 1024 && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    }, 250);
});

// ===================================
// Accessibility: Focus Management
// ===================================
// Trap focus in modal when open
modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});

// Trap focus in sidebar when open
sidebar.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const focusableElements = sidebar.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});

// ===================================
// Console Easter Egg
// ===================================
console.log('%c🎨 Mausam Art', 'font-size: 24px; font-weight: bold; color: #8b7355;');
console.log('%cBuilt with ❤️ using vanilla JavaScript', 'font-size: 14px; color: #666;');
console.log('%cInterested in commissioning artwork? Contact: mausam@example.com', 'font-size: 12px; color: #999;');
