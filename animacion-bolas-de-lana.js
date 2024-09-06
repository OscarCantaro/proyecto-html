// Configuración de la animación
const config = {
    numBalls: 20,
    colors: ['#ff9999', '#99ff99', '#9999ff', '#ffff99', '#ff99ff'],
    minSize: 10,
    maxSize: 30,
    minSpeed: 1,
    maxSpeed: 3,
    gravity: 0.1,
    bounce: 0.8
};

// Clase para las bolas de lana
class WoolBall {
    constructor(x, y, size, color, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = (Math.random() - 0.5) * speed;
        this.speedY = Math.random() * speed;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Dibujar líneas para simular lana
        for (let i = 0; i < 4; i++) {
            let angle = Math.random() * Math.PI * 2;
            let length = this.size * 0.8;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos(angle) * length, this.y + Math.sin(angle) * length);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    update(width, height) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += config.gravity;

        if (this.x + this.size > width || this.x - this.size < 0) {
            this.speedX = -this.speedX * config.bounce;
        }
        if (this.y + this.size > height) {
            this.y = height - this.size;
            this.speedY = -this.speedY * config.bounce;
        }
    }
}

// Inicialización y animación
function initAnimation() {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const balls = [];

    for (let i = 0; i < config.numBalls; i++) {
        const size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
        const x = Math.random() * (canvas.width - size * 2) + size;
        const y = Math.random() * (canvas.height - size * 2) + size;
        const color = config.colors[Math.floor(Math.random() * config.colors.length)];
        const speed = Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
        balls.push(new WoolBall(x, y, size, color, speed));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        balls.forEach(ball => {
            ball.update(canvas.width, canvas.height);
            ball.draw(ctx);
        });
        requestAnimationFrame(animate);
    }

    animate();
}

// Iniciar la animación cuando se carga la página
window.addEventListener('load', initAnimation);
