const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

const orbs = [];
// Use very few orbs to create a soft, ambient "aurora" effect
const numOrbs = window.innerWidth < 768 ? 4 : 6;

for (let i = 0; i < numOrbs; i++) {
    // Mix of Rails Red and a subtle Slate Gray for depth
    const isRed = i < Math.ceil(numOrbs / 2);
    
    orbs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        // Extremely slow drift
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        // Very large radius for a massive soft glow
        radius: Math.random() * 300 + 200,
        // Core colors
        color: isRed ? 'rgba(211, 0, 1, ' : 'rgba(45, 55, 72, ',
        // Very discrete opacity
        baseOpacity: isRed ? 0.04 : 0.03
    });
}

function animate() {
    requestAnimationFrame(animate);
    // Clear entire canvas on each frame
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < numOrbs; i++) {
        let orb = orbs[i];
        
        // Move
        orb.x += orb.vx;
        orb.y += orb.vy;
        
        // Softly bounce far outside the screen to allow them to drift in and out elegantly
        const overflow = orb.radius; 
        if (orb.x < -overflow) orb.vx = Math.abs(orb.vx);
        if (orb.x > width + overflow) orb.vx = -Math.abs(orb.vx);
        if (orb.y < -overflow) orb.vy = Math.abs(orb.vy);
        if (orb.y > height + overflow) orb.vy = -Math.abs(orb.vy);
        
        // Draw soft radial gradient (solid center fading completely to transparent outline)
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        
        gradient.addColorStop(0, orb.color + orb.baseOpacity + ')');
        gradient.addColorStop(1, orb.color + '0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

animate();
