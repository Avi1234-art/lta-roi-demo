/* ———————————————————————————————————————————————————
   Page Transition – Floating Dots Animation
   Plays on page load, fades out after ~750ms
   ——————————————————————————————————————————————————— */

(function () {
    const overlay = document.getElementById("pageTransition");
    const canvas = document.getElementById("transitionCanvas");
    if (!overlay || !canvas) return;

    const ctx = canvas.getContext("2d");
    const DPR = window.devicePixelRatio || 1;
    let W, H;

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * DPR;
        canvas.height = H * DPR;
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    resize();

    /* Create ~60 particles */
    const PARTICLE_COUNT = 60;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            r: Math.random() * 2.5 + 1,
            alpha: Math.random() * 0.5 + 0.3,
        });
    }

    let startTime = performance.now();
    const DURATION = 900; /* ms total animation length */
    const FADE_START = 350; /* ms when fade-out begins */
    let animId;

    function draw(now) {
        const elapsed = now - startTime;
        const globalAlpha = elapsed < FADE_START
            ? 1
            : Math.max(0, 1 - (elapsed - FADE_START) / (DURATION - FADE_START));

        if (elapsed > DURATION) {
            overlay.style.display = "none";
            cancelAnimationFrame(animId);
            return;
        }

        ctx.clearRect(0, 0, W, H);

        /* Draw gradient background */
        const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.6);
        grad.addColorStop(0, `rgba(220, 159, 133, ${0.06 * globalAlpha})`);
        grad.addColorStop(1, `rgba(24, 24, 24, ${globalAlpha})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        /* Draw and update particles */
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            /* Wrap around edges */
            if (p.x < -5) p.x = W + 5;
            if (p.x > W + 5) p.x = -5;
            if (p.y < -5) p.y = H + 5;
            if (p.y > H + 5) p.y = -5;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(220, 159, 133, ${p.alpha * globalAlpha})`;
            ctx.fill();
        }

        /* Draw connections between nearby particles */
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const lineAlpha = (1 - dist / maxDist) * 0.15 * globalAlpha;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(220, 159, 133, ${lineAlpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
})();
