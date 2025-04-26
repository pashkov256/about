// Optimized cursor effect
const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.custom-cursor-dot');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let cursorDotX = 0;
let cursorDotY = 0;
let cursorTrail = [];
const maxTrailLength = 5; // Reduced from 10 to 5

// Create optimized cursor trail
for (let i = 0; i < maxTrailLength; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.cssText = `
        width: ${3 + i}px;
        height: ${3 + i}px;
        opacity: ${0.3 - i * 0.05};
        background: var(--primary-color);
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        will-change: transform;
        transform: translate3d(0, 0, 0);
    `;
    document.body.appendChild(trail);
    cursorTrail.push({ element: trail, x: 0, y: 0 });
}

// Optimized mousemove handler with throttling
let lastTime = 0;
const throttleInterval = 1000 / 60; // 60 FPS

document.addEventListener('mousemove', (e) => {
    const currentTime = Date.now();
    if (currentTime - lastTime >= throttleInterval) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastTime = currentTime;
    }
});

// Optimized cursor animation
function animateCursor() {
    // Main cursor with easing
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate3d(${cursorX - 10}px, ${cursorY - 10}px, 0)`;

    // Cursor dot with faster following
    cursorDotX += (mouseX - cursorDotX) * 0.35;
    cursorDotY += (mouseY - cursorDotY) * 0.35;
    cursorDot.style.transform = `translate3d(${cursorDotX - 2}px, ${cursorDotY - 2}px, 0)`;

    // Optimized trail animation
    cursorTrail.forEach((trail, index) => {
        const prevTrail = cursorTrail[index - 1];
        const targetX = prevTrail ? prevTrail.x : cursorDotX;
        const targetY = prevTrail ? prevTrail.y : cursorDotY;
        
        trail.x += (targetX - trail.x) * 0.35;
        trail.y += (targetY - trail.y) * 0.35;
        trail.element.style.transform = `translate3d(${trail.x - 2}px, ${trail.y - 2}px, 0)`;
    });

    requestAnimationFrame(animateCursor);
}

// Start animation
animateCursor();

// Optimized hover effects
const addHoverEffect = (element) => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = `translate3d(${cursorX - 15}px, ${cursorY - 15}px, 0) scale(1.5)`;
        cursor.style.borderColor = 'var(--primary-color)';
        cursorDot.style.transform = `translate3d(${cursorDotX - 2}px, ${cursorDotY - 2}px, 0) scale(1.5)`;
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.style.transform = `translate3d(${cursorX - 10}px, ${cursorY - 10}px, 0) scale(1)`;
        cursor.style.borderColor = 'var(--primary-color)';
        cursorDot.style.transform = `translate3d(${cursorDotX - 2}px, ${cursorDotY - 2}px, 0) scale(1)`;
    });
};

// Apply hover effects only to interactive elements
document.querySelectorAll('a, button, .tech-item').forEach(addHoverEffect);

// Emoji animation
function animateEmojis() {
    const subtitle = document.querySelector('.profile-card h3');
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.innerHTML = text; // Just set the text content directly
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    animateEmojis();
    
    // Enhanced parallax effect
    const hero = document.querySelector('.hero');
    let scrollPos = 0;
    
    window.addEventListener('scroll', () => {
        const currentScrollPos = window.pageYOffset;
        const scrollDirection = currentScrollPos > scrollPos ? 1 : -1;
        const parallaxSpeed = 0.5;
        
        scrollPos = currentScrollPos;
    });
});

// Matrix Rain Effect with updated colors
const canvas = document.getElementById('matrix-rain');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const charArray = chars.split('');
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 25, 41, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#2a5298';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 33);

// Intersection Observer for fade-in animations
const sections = document.querySelectorAll('section');
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    observer.observe(section);
});

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 3D Profile Card Effect
const profileCard = document.querySelector('.profile-card');
let profileRotation = { x: 0, y: 0 };
const maxRotation = 10;

function handleProfileCardMovement(e) {
    if (!profileCard) return;
    
    const rect = profileCard.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotationY = (mouseX / rect.width) * maxRotation;
    const rotationX = -(mouseY / rect.height) * maxRotation;
    
    profileRotation = {
        x: rotationX,
        y: rotationY
    };
    
    gsap.to(profileCard, {
        rotationX: rotationX,
        rotationY: rotationY,
        duration: 0.5,
        ease: 'power2.out'
    });
}

// Reset profile card rotation
function resetProfileCard() {
    if (!profileCard) return;
    
    gsap.to(profileCard, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
    });
}

// Initialize GSAP animations
function initAnimations() {
    // Animate profile image
    gsap.to('.profile-image', {
        rotationY: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
    });
    
    // Animate tech icons
    const techIcons = document.querySelectorAll('.tech-icon-3d');
    techIcons.forEach((icon, index) => {
        gsap.to(icon, {
            rotationY: 360,
            duration: 10,
            repeat: -1,
            ease: 'none',
            delay: index * 0.2
        });
    });
    
    // Animate gradient blobs
    const blobs = document.querySelectorAll('.gradient-blob');
    blobs.forEach((blob, index) => {
        gsap.to(blob, {
            x: 'random(-100, 100)',
            y: 'random(-100, 100)',
            scale: 'random(0.8, 1.2)',
            duration: 'random(10, 20)',
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: index * 0.5
        });
    });
}

// Event listeners for 3D effects
document.addEventListener('mousemove', handleProfileCardMovement);
profileCard?.addEventListener('mouseleave', resetProfileCard);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    
    // Remove all character animation code
    const subtitle = document.querySelector('.profile-card h3');
    if (subtitle) {
        subtitle.style.opacity = 1;
    }
}); 