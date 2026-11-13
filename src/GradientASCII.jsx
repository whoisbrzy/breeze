import { useEffect, useRef } from 'react';

const CHARS = ' .,:-=+xX0S8#@';
const COLORS = ['#071b50', '#123fc2', '#2878ff', '#9bcaff'];

export default function GradientASCII() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: 0.5, y: 0.5, active: false };
    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;
    let last = 0;
    let time = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw();
    };

    const mix = (a, b, t) => a + (b - a) * t;
    const draw = () => {
      if (!width || !height) return;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#050b19';
      context.fillRect(0, 0, width, height);
      const cellW = width < 700 ? 11 : 13;
      const cellH = cellW * 1.55;
      const cols = Math.ceil(width / cellW);
      const rows = Math.ceil(height / cellH);
      context.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = x / cols;
          const ny = y / rows;
          const px = nx - (pointer.active ? pointer.x : 0.5);
          const py = ny - (pointer.active ? pointer.y : 0.48);
          const distance = Math.sqrt(px * px * 1.15 + py * py);
          const wave = Math.sin(nx * 7.5 + time * 0.55) * 0.12 + Math.cos(ny * 6.2 - time * 0.38) * 0.1;
          const bloom = Math.max(0, 1 - Math.sqrt(((nx - 0.52) * 1.2) ** 2 + ((ny - 0.45) * 1.5) ** 2));
          const cursor = pointer.active ? Math.max(0, 1 - distance * 3.4) * 0.28 : 0;
          const value = Math.max(0, Math.min(1, bloom * 0.78 + wave + cursor - 0.12));
          if (value < 0.09) continue;
          const index = Math.min(CHARS.length - 1, Math.floor(value * (CHARS.length - 1)));
          const colorMix = Math.min(1, value * 1.2);
          const r = Math.round(mix(7, 155, colorMix));
          const g = Math.round(mix(28, 202, colorMix));
          const b = Math.round(mix(82, 255, colorMix));
          context.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + (0.12 + value * 0.62) + ')';
          context.fillText(CHARS[index], x * cellW + cellW / 2, y * cellH + cellH / 2);
        }
      }
      const gradient = context.createRadialGradient(width * 0.52, height * 0.42, 0, width * 0.52, height * 0.42, Math.max(width, height) * 0.72);
      gradient.addColorStop(0, 'rgba(3, 9, 25, 0)');
      gradient.addColorStop(1, 'rgba(3, 8, 20, 0.88)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    };

    const animate = now => {
      raf = 0;
      if (reduceMotion) return;
      if (now - last > 40) {
        time += Math.min((now - (last || now)) / 1000, 0.05);
        last = now;
        draw();
      }
      raf = requestAnimationFrame(animate);
    };
    const move = event => {
      pointer.x = event.clientX / Math.max(width, 1);
      pointer.y = event.clientY / Math.max(height, 1);
      pointer.active = true;
      if (reduceMotion) draw();
    };
    const leave = () => { pointer.active = false; if (reduceMotion) draw(); };

    resize();
    if (!reduceMotion) raf = requestAnimationFrame(animate);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerleave', leave);
    };
  }, []);

  return <canvas ref={canvasRef} className="gradient-ascii-background" aria-hidden="true" />;
}
