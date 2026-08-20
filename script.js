// ============================================================
// ZAHRA ALI MAKEUP STUDIO — FINAL SCRIPT.JS (FIXED)
// ============================================================

// ============================================================
// 1. NAVBAR – MOBILE TOGGLE & SCROLL EFFECT
// ============================================================

const navbar = document.getElementById('navbar');
const toggle = document.getElementById('navbarToggle');
const navMenu = document.getElementById('navbarNav');

if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });
}

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================================
// 2. SCROLL REVEAL (FADE-UP)
// ============================================================

const fadeElements = document.querySelectorAll('.fade-up');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

fadeElements.forEach(el => revealObserver.observe(el));

// ============================================================
// 3. LIGHTBOX – Mixed Photos & Videos
// ============================================================

const lightbox = document.getElementById('lightbox');
const mediaContainer = document.getElementById('lightboxMediaContainer');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

let currentGalleryItems = [];
let currentIndex = 0;

function getGalleryItems() {
    const items = document.querySelectorAll('.gallery-item');
    const data = [];
    items.forEach(item => {
        const type = item.dataset.type || 'image';
        let src = '';
        if (type === 'image') {
            const img = item.querySelector('img');
            if (img) src = img.getAttribute('src');
        } else if (type === 'video') {
            const video = item.querySelector('video source');
            if (video) src = video.getAttribute('src');
        }
        if (src) {
            data.push({ type, src });
        }
    });
    return data;
}

function openLightbox(index) {
    currentGalleryItems = getGalleryItems();
    if (currentGalleryItems.length === 0) return;
    currentIndex = (index + currentGalleryItems.length) % currentGalleryItems.length;
    renderMedia(currentIndex);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateCounter();
}

function renderMedia(index) {
    const item = currentGalleryItems[index];
    if (!item) return;
    mediaContainer.innerHTML = '';
    if (item.type === 'image') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = 'Gallery image';
        mediaContainer.appendChild(img);
    } else if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.src;
        video.controls = true;
        video.autoplay = true;
        video.muted = false;
        video.style.width = '100%';
        video.style.maxHeight = '80vh';
        mediaContainer.appendChild(video);
    }
}

function updateCounter() {
    if (lightboxCounter) {
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentGalleryItems.length}`;
    }
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    const video = mediaContainer.querySelector('video');
    if (video) video.pause();
}

function prevMedia() {
    if (currentGalleryItems.length === 0) return;
    currentIndex = (currentIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    renderMedia(currentIndex);
    updateCounter();
}

function nextMedia() {
    if (currentGalleryItems.length === 0) return;
    currentIndex = (currentIndex + 1) % currentGalleryItems.length;
    renderMedia(currentIndex);
    updateCounter();
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', prevMedia);
if (lightboxNext) lightboxNext.addEventListener('click', nextMedia);

document.querySelectorAll('.gallery-item').forEach((item, idx) => {
    item.addEventListener('click', () => {
        openLightbox(idx);
    });
});

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevMedia();
    if (e.key === 'ArrowRight') nextMedia();
});

// ============================================================
// 4. REVIEWS SLIDER
// ============================================================

const track = document.getElementById('reviewsTrack');
const dots = document.getElementById('sliderDots');
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');

let currentSlide = 0;
let totalSlides = 0;
let slideInterval = null;

function initSlider() {
    if (!track) return;
    const cards = track.querySelectorAll('.review-card');
    totalSlides = cards.length;
    if (totalSlides === 0) return;

    if (dots) {
        dots.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.dataset.index = i;
            dot.addEventListener('click', () => goToSlide(i));
            dots.appendChild(dot);
        }
    }

    goToSlide(0);
    startAutoSlide();
}

function goToSlide(index) {
    if (!track) return;
    const cards = track.querySelectorAll('.review-card');
    if (cards.length === 0) return;
    currentSlide = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    if (dots) {
        const dotElements = dots.querySelectorAll('span');
        dotElements.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });
}

if (track) {
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);
}

initSlider();

// ============================================================
// 5. BACK TO TOP
// ============================================================

const backBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
        backBtn.classList.add('visible');
    } else {
        backBtn.classList.remove('visible');
    }
});

if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================================
// 6. BOOKING FORM – VALIDATION + WHATSAPP + "BOOK ANOTHER"
// ============================================================

const bookingForm = document.getElementById('bookingForm');
const bookingWrapper = document.querySelector('.booking-wrapper'); // parent container

// Price mapping
const servicePrices = {
    'Party Makeup — Heavy Glam': 'Rs 15,000',
    'Party Makeup — Soft Glam': 'Rs 12,000',
    'Party Makeup — Signature Glam': 'Rs 30,000',
    'Bridal Makeup — Signature Barat': 'Rs 85,000',
    'Bridal Makeup — Signature Walima': 'Rs 85,000',
    'Bridal Makeup — Senior Barat': 'Rs 55,000',
    'Nail Bar — Regular Nail Colour': 'Rs 1,000',
    'Nail Bar — Acrylics': 'Rs 7,000',
    'Nail Bar — Gel-X Extensions': 'Rs 3,000',
    'Massage & Oiling — Full Body (30 min)': 'Rs 4,000',
    'Massage & Oiling — Full Body (60 min)': 'Rs 6,000',
    'Massage & Oiling — Hair Oiling': 'Rs 1,200',
    'Hands & Feet — Executive Spa Manicure': 'Rs 1,950',
    'Hands & Feet — Signature Jelly Brew Pedicure': 'Rs 3,150',
    'Waxing — Full Face': 'Rs 2,700',
    'Waxing — Full Body': 'Rs 6,500',
    'Skin Rituals — Korean Glow Facial': 'Rs 5,500',
    'Skin Rituals — Janssen Supreme Whitening Facial': 'Rs 6,000',
    'Haircuts & Styling — Senior Stylist Cut & Blow Dry': 'Rs 5,500',
    'Haircuts & Styling — Signature WOW Blowdry': 'Rs 4,000'
};

// Pre-fill service
function prefillService() {
    const params = new URLSearchParams(window.location.search);
    let service = params.get('service');
    let price = params.get('price');

    if (!service) {
        const stored = localStorage.getItem('zahra_booking');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                service = data.service;
                price = data.price;
                localStorage.removeItem('zahra_booking');
            } catch (e) {}
        }
    }

    if (service) {
        const select = document.getElementById('bookService');
        if (select) {
            let found = false;
            for (let opt of select.options) {
                if (opt.value === service) {
                    select.value = service;
                    found = true;
                    break;
                }
            }
            if (!found) {
                const opt = document.createElement('option');
                opt.value = service;
                opt.textContent = service;
                select.appendChild(opt);
                select.value = service;
            }
            if (price) {
                select.dataset.price = price;
            } else if (servicePrices[service]) {
                select.dataset.price = servicePrices[service];
            } else {
                select.dataset.price = 'Contact us for price';
            }
        }
    }
}

// Set min date
function setDateMin() {
    const dateInput = document.getElementById('bookDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    prefillService();
    setDateMin();
});

// Validation functions
function validateName(name) {
    return name.trim().length >= 2;
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\s/g, '');
    return /^03[0-9]{2}[-]?[0-9]{7}$/.test(cleaned) || /^03[0-9]{9}$/.test(cleaned);
}

function validateEmail(email) {
    if (email.trim() === '') return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateDate(date) {
    if (!date) return false;
    const selected = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
}

function validateTime(time) {
    return time !== '';
}

function validateService(service) {
    return service !== '';
}

function setError(inputId, show) {
    const group = document.getElementById(inputId)?.closest('.form-group');
    if (group) {
        if (show) {
            group.classList.add('error');
        } else {
            group.classList.remove('error');
        }
    }
}

function validateField(id) {
    const input = document.getElementById(id);
    if (!input) return true;
    let valid = true;
    switch (id) {
        case 'bookName':
            valid = validateName(input.value);
            setError(id, !valid);
            break;
        case 'bookPhone':
            valid = validatePhone(input.value);
            setError(id, !valid);
            break;
        case 'bookEmail':
            valid = validateEmail(input.value);
            setError(id, !valid);
            break;
        case 'bookService':
            valid = validateService(input.value);
            setError(id, !valid);
            break;
        case 'bookDate':
            valid = validateDate(input.value);
            setError(id, !valid);
            break;
        case 'bookTime':
            valid = validateTime(input.value);
            setError(id, !valid);
            break;
        default:
            return true;
    }
    return valid;
}

// Real-time validation
['bookName', 'bookPhone', 'bookEmail', 'bookService', 'bookDate', 'bookTime'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('blur', () => validateField(id));
        el.addEventListener('input', () => {
            if (validateField(id)) {
                setError(id, false);
            }
        });
    }
});

// ===== CREATE SUCCESS DIV ONCE (hidden initially) =====
let successDiv = document.getElementById('bookingSuccess');
if (!successDiv && bookingWrapper) {
    successDiv = document.createElement('div');
    successDiv.id = 'bookingSuccess';
    successDiv.style.cssText = `
        text-align: center;
        padding: 40px 30px;
        background: var(--ivory);
        border-radius: var(--border-radius);
        box-shadow: var(--shadow);
        max-width: 600px;
        margin: 0 auto;
        display: none;
    `;
    bookingWrapper.appendChild(successDiv);
}

// ===== EVENT DELEGATION FOR "BOOK ANOTHER" =====
// Attach once to the wrapper – works even if button is recreated
if (bookingWrapper) {
    bookingWrapper.addEventListener('click', function(e) {
        const target = e.target.closest('#bookAnotherBtn');
        if (target) {
            // Reset the form
            bookingForm.reset();
            // Show the form again
            bookingForm.style.display = 'block';
            // Hide the success div
            successDiv.style.display = 'none';
            // Scroll back to the form
            bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Remove any error states
            document.querySelectorAll('.form-group.error').forEach(el => {
                el.classList.remove('error');
            });
        }
    });
}

// ===== FORM SUBMISSION =====
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all fields
        const fields = ['bookName', 'bookPhone', 'bookEmail', 'bookService', 'bookDate', 'bookTime'];
        let allValid = true;
        fields.forEach(id => {
            if (!validateField(id)) {
                allValid = false;
            }
        });

        if (!allValid) {
            const firstError = document.querySelector('.form-group.error input, .form-group.error select');
            if (firstError) firstError.focus();
            return;
        }

        // Gather data
        const name = document.getElementById('bookName').value.trim();
        const phone = document.getElementById('bookPhone').value.trim();
        const email = document.getElementById('bookEmail').value.trim();
        const service = document.getElementById('bookService').value;
        const price = document.getElementById('bookService').dataset?.price || servicePrices[service] || 'Contact us for price';
        const date = document.getElementById('bookDate').value;
        const time = document.getElementById('bookTime').value;
        const message = document.getElementById('bookMessage').value.trim();

        // Build WhatsApp URL
        let whatsappText = `Hello Zahra Ali Makeup Studio!%0A%0A`;
        whatsappText += `I would like to book an appointment.%0A`;
        whatsappText += `Name: ${encodeURIComponent(name)}%0A`;
        whatsappText += `Phone: ${encodeURIComponent(phone)}%0A`;
        if (email) whatsappText += `Email: ${encodeURIComponent(email)}%0A`;
        whatsappText += `Service: ${encodeURIComponent(service)}%0A`;
        whatsappText += `Price: ${encodeURIComponent(price)}%0A`;
        whatsappText += `Date: ${encodeURIComponent(date)}%0A`;
        whatsappText += `Time: ${encodeURIComponent(time)}%0A`;
        if (message) whatsappText += `Message: ${encodeURIComponent(message)}%0A`;
        whatsappText += `%0AThank you!`;

        const whatsappUrl = `https://wa.me/923094555755?text=${whatsappText}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // ---- HIDE FORM ----
        bookingForm.style.display = 'none';

        // ---- UPDATE SUCCESS DIV ----
        successDiv.innerHTML = `
            <i class="fas fa-check-circle" style="color:#2e7d32; font-size:4rem; display:block; margin-bottom:16px;"></i>
            <h3 style="font-family: var(--font-heading); font-size:2rem; color: var(--ink); margin-bottom:8px;">Thank You!</h3>
            <p style="color: var(--muted); font-weight:300; margin-bottom:8px;">
                Your appointment request has been sent via WhatsApp.
            </p>
            <p style="color: var(--muted); font-weight:300; font-size:0.9rem; margin-bottom:24px;">
                <small>If WhatsApp didn't open, <a href="${whatsappUrl}" target="_blank" style="color: var(--gold); font-weight:600;">click here to send manually</a>.</small>
            </p>
            <button id="bookAnotherBtn" class="btn btn-primary btn-large" style="margin-top:8px;">
                <i class="fas fa-plus-circle"></i> Book Another Appointment
            </button>
        `;

        // ---- SHOW SUCCESS ----
        successDiv.style.display = 'block';

        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        console.log('✅ Booking sent to WhatsApp:', { name, phone, email, service, price, date, time, message });
    });
}

// ============================================================
// 7. WHATSAPP BUTTON (dedicated)
// ============================================================

const whatsappBtn = document.getElementById('bookWhatsAppBtn');

function generateWhatsAppMessage() {
    const name = document.getElementById('bookName')?.value || 'Customer';
    const service = document.getElementById('bookService')?.value || 'Not specified';
    const price = document.getElementById('bookService')?.dataset?.price || servicePrices[service] || 'Contact us for price';
    const date = document.getElementById('bookDate')?.value || 'Not specified';
    const time = document.getElementById('bookTime')?.value || 'Not specified';
    const message = document.getElementById('bookMessage')?.value || '';

    let text = `Hello Zahra Ali Makeup Studio!%0A%0A`;
    text += `I would like to book an appointment.%0A`;
    text += `Name: ${encodeURIComponent(name)}%0A`;
    text += `Service: ${encodeURIComponent(service)}%0A`;
    text += `Price: ${encodeURIComponent(price)}%0A`;
    text += `Date: ${encodeURIComponent(date)}%0A`;
    text += `Time: ${encodeURIComponent(time)}%0A`;
    if (message) {
        text += `Message: ${encodeURIComponent(message)}%0A`;
    }
    text += `%0AThank you!`;

    return text;
}

if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function() {
        const msg = generateWhatsAppMessage();
        const url = `https://wa.me/923094555755?text=${msg}`;
        window.open(url, '_blank');
    });
}

// ============================================================
// 8. BOOK NOW BUTTONS (Service Pages)
// ============================================================

document.querySelectorAll('.btn-book-now').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const card = this.closest('.service-item') || this.closest('.service-card');
        if (!card) return;

        let service = '';
        let price = '';

        const titleEl = card.querySelector('.item-body h3') || card.querySelector('h3');
        const priceEl = card.querySelector('.price') || card.querySelector('.item-body .price');

        if (titleEl) service = titleEl.textContent.trim();
        if (priceEl) price = priceEl.textContent.trim();

        if (!service) {
            service = this.dataset.service || card.dataset.service || '';
        }
        if (!price) {
            price = this.dataset.price || card.dataset.price || '';
        }

        if (!service) {
            const heroTitle = document.querySelector('.service-hero h1');
            if (heroTitle) service = heroTitle.textContent.trim() + ' — ' + (card.querySelector('.desc')?.textContent?.trim() || '');
        }

        if (service) {
            localStorage.setItem('zahra_booking', JSON.stringify({ service, price }));
            window.location.href = 'index.html#booking';
        } else {
            window.location.href = 'index.html#booking';
        }
    });
});

// ============================================================
// 9. SMOOTH SCROLL – FIXED NAVBAR OFFSET
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
            const top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 10;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// Handle #booking on page load
window.addEventListener('load', function() {
    if (window.location.hash === '#booking') {
        setTimeout(() => {
            const target = document.getElementById('booking');
            if (target) {
                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 10;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }, 400);
    }
});

console.log('✅ Zahra Ali Makeup Studio — All scripts loaded successfully!');