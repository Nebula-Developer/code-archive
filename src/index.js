const { ipcRenderer } = require('electron');

var visible = false;
ipcRenderer.on('toggle-visibility', (event, value) => {
    document.body.classList.toggle('visible', value);
    visible = value;
});

var handler = false;

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('get-visibility');
    console.log('a');
});

var drawInterval;
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        ipcRenderer.send('toggle-visibility', false);
    } else if (e.key == 'Enter') {
        handler = !handler;
        document.body.classList.toggle('handler', handler);

        if (handler) {
            loadParticles();
            if (drawInterval) clearInterval(drawInterval);
            drawInterval = setInterval(draw, 1000 / 60);
        }
    }
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// line particles
let particles = [];
const numParticles = 500;

function loadParticles() {
    particles = [];

    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0
        });
    }
}


function draw() {
    if (!handler || !visible) return;
    
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    
    for (let i = 0; i < numParticles; i++) {
        let p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.5;
        p.vy *= 0.5;
        
        // get dist from mouse, repel if close
        let dx = p.x - mouseX;
        let dy = p.y - mouseY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        
        if (dist < 100) {
            let angle = Math.atan2(dy, dx);

            p.vx = Math.cos(angle) * (100 - dist) * 0.5;
            p.vy = Math.sin(angle) * (100 - dist) * 0.5;

            p.x = Math.max(0, Math.min(width, p.x));
            p.y = Math.max(0, Math.min(height, p.y));
        }
    }

    // draw the join lines
    for (let i = 0; i < numParticles; i++) {
        let p0 = particles[i];
        for (let j = i + 1; j < numParticles; j++) {
            let p1 = particles[j];
            let dx = p1.x - p0.x;
            let dy = p1.y - p0.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.lineWidth = 1 - dist / 100;
                
                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.stroke();
    
                let angle = Math.atan2(dy, dx);
                var val = 0.05;
                p0.x -= Math.cos(angle) * (100 - dist) * val;
                p0.y -= Math.sin(angle) * (100 - dist) * val;
                p1.x += Math.cos(angle) * (100 - dist) * val;
                p1.y += Math.sin(angle) * (100 - dist) * val;
    
                p0.x = Math.max(0, Math.min(width, p0.x));
                p0.y = Math.max(0, Math.min(height, p0.y));
                p1.x = Math.max(0, Math.min(width, p1.x));
                p1.y = Math.max(0, Math.min(height, p1.y));
            }
        }
    
        ctx.beginPath();
        ctx.arc(p0.x, p0.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

var mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});
