// Configuración de la animación
const config = {
  numBalls: 15, // Número de bolas de lana
  colors: [
    "#FFB3BA",
    "#BAFFC9",
    "#BAE1FF",
    "#FFFFBA",
    "#FFDFBA",
    "#E0BBE4",
    "#D4F0F0",
    "#FEC8D8",
    "#FFDFD3",
    "#CFBAF0",
  ],
  minSize: 30, // Tamaño mínimo de las bolas
  maxSize: 60, // Tamaño máximo de las bolas
  minSpeed: 0.5, // Velocidad mínima
  maxSpeed: 2, // Velocidad máxima
  gravity: 0.05, // Fuerza de gravedad
  bounce: 0.7, // Factor de rebote
};

// Clase que representa una bola de lana
class WoolBall {
  constructor(x, y, size, color, speed) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = (Math.random() - 0.5) * speed;
    this.speedY = Math.random() * speed;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
  }

  // Método para dibujar la bola de lana
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Dibujar el cuerpo principal de la bola de lana
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Dibujar líneas para simular lana enrollada
    for (let i = 0; i < 8; i++) {
      let angle = ((Math.PI * 2) / 8) * i;
      let length = this.size * 1.0; // lineas plomas del interior
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(
        Math.cos(angle) * length * 0.5,
        Math.sin(angle) * length * 0.5,
        Math.cos(angle) * length,
        Math.sin(angle) * length
      );
      ctx.strokeStyle = this.darkenColor(this.color, 20);
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Dibujar hilos sueltos
    for (let i = 0; i < 2; i++) {
      // 5
      let angle = Math.random() * Math.PI * 2;
      let length = this.size * (0.8 + Math.random() * 0.3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(
        Math.cos(angle) * length * 0.2, // 6
        Math.sin(angle) * length * 0.8, // 6
        Math.cos(angle) * length,
        Math.sin(angle) * length
      );
      ctx.strokeStyle = this.lightenColor(this.color, 20);
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }

  // Método para actualizar la posición y velocidad de la bola
  update(width, height) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += config.gravity;
    this.rotation += this.rotationSpeed;

    // Rebotar en los bordes
    if (this.x + this.size > width || this.x - this.size < 0) {
      this.speedX = -this.speedX * config.bounce;
    }
    if (this.y + this.size > height) {
      this.y = height - this.size;
      this.speedY = -this.speedY * config.bounce;
    }
  }

  // Método para oscurecer un color
  darkenColor(color, percent) {
    let num = parseInt(color.slice(1), 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) - amt;
    let G = ((num >> 8) & 0x00ff) - amt;
    let B = (num & 0x0000ff) - amt;
    return `#${(
      (1 << 24) |
      ((R < 255 ? (R < 1 ? 0 : R) : 255) << 16) |
      ((G < 255 ? (G < 1 ? 0 : G) : 255) << 8) |
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  }

  // Método para aclarar un color
  lightenColor(color, percent) {
    let num = parseInt(color.slice(1), 16);
    let amt = Math.round(2.55 * percent);
    let R = Math.min(255, (num >> 16) + amt);
    let G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    let B = Math.min(255, (num & 0x0000ff) + amt);
    return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
  }
}

// Función para inicializar y ejecutar la animación
function initAnimation() {
  // Crear y configurar el canvas
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.zIndex = "-1";

  const ctx = canvas.getContext("2d");

  // Función para redimensionar el canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Agregar event listener para redimensionar el canvas cuando cambie el tamaño de la ventana
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const balls = [];

  // Crear las bolas de lana
  for (let i = 0; i < config.numBalls; i++) {
    const size =
      Math.random() * (config.maxSize - config.minSize) + config.minSize;
    const x = Math.random() * (canvas.width - size * 2) + size;
    const y = Math.random() * (canvas.height - size * 2) + size;
    const color =
      config.colors[Math.floor(Math.random() * config.colors.length)];
    const speed =
      Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed;
    balls.push(new WoolBall(x, y, size, color, speed));
  }

  // Función de animación principal
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball) => {
      ball.update(canvas.width, canvas.height);
      ball.draw(ctx);
    });
    requestAnimationFrame(animate);
  }

  animate();
}

// Iniciar la animación cuando se carga la página
window.addEventListener("load", initAnimation);
