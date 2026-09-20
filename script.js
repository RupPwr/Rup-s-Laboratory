// Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');
        
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        });
        
        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if(targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if(targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Add scroll effect to header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            const currentScroll = window.pageYOffset;
            
            if(currentScroll > 100) {
                header.style.backgroundColor = 'rgba(23, 23, 23, 0.98)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.backgroundColor = 'var(--secondary-black)';
                header.style.backdropFilter = 'none';
                header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }
            
        });
        
        // Gallery tab switching function
        function switchTab(tabName, button) {
            // Hide all tabs
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Remove active class from all buttons
            const buttons = document.querySelectorAll('.tab-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Show selected tab and mark button as active
            document.getElementById(tabName).classList.add('active');
            button.classList.add('active');
        }
        
        // Photo modal functions
        function openPhotoModal(imgSrc, caption) {
            const modal = document.getElementById('photoModal');
            const modalImg = document.getElementById('modalImg');
            const modalCaption = document.getElementById('modalCaption');
            
            modal.classList.add('active');
            modalImg.src = imgSrc;
            modalCaption.textContent = caption;
            document.body.style.overflow = 'hidden';
        }
        
        function closePhotoModal(event) {
            const modal = document.getElementById('photoModal');
            const modalImg = document.getElementById('modalImg');
            
            // Only close if clicking outside the image or on close button
            if (event.target === modal || event.target.closest('.modal-close')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('photoModal');
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
        
        // Add entrance animations on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.feature-card, .photo-card, .contact-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
// Keep gallery and modal controls in the external script while preserving their original behavior.
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab, button));
});

document.querySelectorAll('.photo-card').forEach(card => {
    card.addEventListener('click', () => openPhotoModal(card.dataset.image, card.dataset.caption));
});

document.getElementById('photoModal').addEventListener('click', closePhotoModal);
document.querySelector('.modal-close').addEventListener('click', closePhotoModal);

const fallbackImage = 'images/slider/1.jpg';
document.querySelectorAll('img').forEach(image => {
    if (image.id === 'modalImg') return;

    const applyFallback = () => {
        if (image.dataset.fallbackApplied) return;
        image.dataset.fallbackApplied = 'true';
        image.src = fallbackImage;

        const photoCard = image.closest('.photo-card');
        if (photoCard) {
            photoCard.dataset.image = fallbackImage;
        }
    };

    image.addEventListener('error', applyFallback);
    if (image.complete && image.naturalWidth === 0) {
        applyFallback();
    }
});

const galleryView = document.getElementById('galleryView');
const galleryOpeners = document.querySelectorAll('[data-gallery-open]');
const galleryCloser = document.querySelector('[data-gallery-close]');
let galleryReturnPosition = 0;

function openGallery(event) {
    event.preventDefault();
    galleryReturnPosition = window.scrollY;
    galleryView.classList.add('active');
    galleryView.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gallery-open');
    galleryView.scrollTop = 0;
}

function closeGallery() {
    galleryView.classList.remove('active');
    galleryView.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gallery-open');
    window.scrollTo({ top: galleryReturnPosition, behavior: 'instant' });
}

galleryOpeners.forEach(opener => opener.addEventListener('click', openGallery));
galleryCloser.addEventListener('click', closeGallery);

// Rotate featured images every five seconds.
const sliderSlides = document.querySelectorAll('.slider-slide');
let activeSlide = 0;

if (sliderSlides.length > 1) {
    window.setInterval(() => {
        sliderSlides[activeSlide].classList.remove('active');
        activeSlide = (activeSlide + 1) % sliderSlides.length;
        sliderSlides[activeSlide].classList.add('active');
    }, 5000);
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (galleryView.classList.contains('active')) {
            closeGallery();
        } else if (document.getElementById('photoModal').classList.contains('active')) {
            document.getElementById('photoModal').classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
