// Toggle mobile menu function
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
}

// Canvas setup for particle animation
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle system
let particles = [];
const mouse = { x: null, y: null };
const particleCount = 100;

class Particle {
    constructor(x = Math.random() * canvas.width, y = Math.random() * canvas.height, isClick = false) {
        this.x = x;
        this.y = y;
        this.size = isClick ? Math.random() * 5 + 5 : Math.random() * 3 + 1;
        this.speedX = isClick ? (Math.random() * 4 - 2) : (Math.random() * 1 - 0.5);
        this.speedY = isClick ? (Math.random() * 4 - 2) : (Math.random() * 1 - 0.5);
        this.waveOffset = Math.random() * Math.PI * 2;
        this.opacity = 1;
        this.isClick = isClick;
    }

    update(time) {
        const waveSpeed = 0.02;
        const waveAmplitude = 10;
        this.y += Math.sin(time * waveSpeed + this.waveOffset) * waveAmplitude * 0.05;
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        if (mouse.x && mouse.y && !this.isClick) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                this.speedX += dx / 1000;
                this.speedY += dy / 1000;
            }
        }

        if (this.size > 0.2) this.size -= this.isClick ? 0.1 : 0.02;
        if (this.isClick) this.opacity -= 0.02;
    }

    draw() {
        ctx.fillStyle = `rgba(0, 255, 136, ${this.opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) { // Ye number kam karo = kam lines, zyada karo = zyada lines
                ctx.strokeStyle = `rgba(255, 215, 0, ${1 - distance / 100})`;
                ctx.lineWidth = 0.5; // Ye number kam karo = patli lines, zyada karo = moti lines
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

let time = 0;
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 1;

    particles.forEach(particle => {
        particle.update(time);
        particle.draw();
        if (particle.size <= 0.2 || particle.opacity <= 0) {
            particles.splice(particles.indexOf(particle), 1);
            if (!particle.isClick) {
                particles.push(new Particle());
            }
        }
    });

    connectParticles();
    requestAnimationFrame(animate);
}

// Event listeners
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('click', (e) => {
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(e.clientX, e.clientY, true));
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.pageYOffset - 70,
                behavior: 'smooth'
            });
        }

        // Close mobile menu after clicking
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger');
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Navigation scroll effect
window.addEventListener('scroll', function () {
    const nav = document.querySelector('.nav-menu');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(0, 0, 0, 0.98)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    } else {
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    }
});

// Intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    if (section.id !== 'home') {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    }
});

// Initialize particles
init();
animate();