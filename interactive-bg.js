// Interactive Background Effects
document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.className = 'interactive-particles';
    document.body.appendChild(container);

    // Create initial particles
    for (let i = 0; i < 50; i++) {
        createParticle(container);
    }

    // Mouse move effect
    let timeout;
    document.addEventListener('mousemove', (e) => {
        if (timeout) clearTimeout(timeout);
        
        const particle = createParticle(container);
        const size = Math.random() * 5 + 3;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${e.clientX}px`;
        particle.style.top = `${e.clientY}px`;
        particle.style.animation = 'particlePulse 1s ease-in-out';
        
        timeout = setTimeout(() => {
            if (particle && particle.parentElement) {
                particle.parentElement.removeChild(particle);
            }
        }, 1000);
    });

    // Background particle system
    setInterval(() => {
        const particles = document.querySelectorAll('.particle');
        if (particles.length < 50) {
            createParticle(container);
        }
    }, 200);
});

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * window.innerWidth}px`;
    particle.style.top = `${Math.random() * window.innerHeight}px`;
    
    // Random movement
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 1;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    
    let x = parseFloat(particle.style.left);
    let y = parseFloat(particle.style.top);
    
    function animate() {
        x += vx;
        y += vy;
        
        // Bounce off walls
        if (x < 0 || x > window.innerWidth) vx *= -1;
        if (y < 0 || y > window.innerHeight) vy *= -1;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        if (particle.parentElement) {
            requestAnimationFrame(animate);
        }
    }
    
    container.appendChild(particle);
    requestAnimationFrame(animate);
    
    // Remove particle after some time
    setTimeout(() => {
        if (particle.parentElement) {
            particle.parentElement.removeChild(particle);
        }
    }, Math.random() * 5000 + 3000);
    
    return particle;
} 