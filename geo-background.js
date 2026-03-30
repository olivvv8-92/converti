/* ---------------------------------------------------
   BACKGROUND — Animations canvas pour 3 sections
--------------------------------------------------- */

(function () {

    const COLORS = [
        "rgba(79,195,255,",
        "rgba(0,230,118,",
        "rgba(159,122,255,",
        "rgba(255,180,50,",
        "rgba(255,80,120,",
        "rgba(100,200,255,",
    ];

    function rand(a, b) { return a + Math.random() * (b - a); }
    function randColor(a) { return COLORS[Math.floor(Math.random() * COLORS.length)] + a + ")"; }

    // Crée un canvas plein écran attaché au body
    function makeCanvas(id) {
        const c = document.createElement("canvas");
        c.id = id;
        c.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;display:none;";
        document.body.appendChild(c);
        return c;
    }

    // Formes disponibles par section
    const SHAPES = {
        geometry : ["circle","rect","triangle","hexagon","diamond","line"],
        convert  : ["rect","line","arrow","circle","cross"],
        volumes  : ["circle","sphere-proj","hexagon","rect","diamond"],
    };

    function createShape(pageKey, w, h) {
        const types = SHAPES[pageKey];
        return {
            type  : types[Math.floor(Math.random() * types.length)],
            x     : rand(0, w), y: rand(0, h),
            size  : rand(18, 85),
            vx    : rand(-0.4, 0.4), vy: rand(-0.4, 0.4),
            angle : rand(0, Math.PI*2), vAngle: rand(-0.007, 0.007),
            color : randColor(rand(0.05, 0.16)),
            stroke: randColor(rand(0.28, 0.60)),
            fill  : Math.random() > 0.5,
        };
    }

    function drawShape(ctx, s) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.beginPath();
        switch (s.type) {
            case "circle":
                ctx.arc(0, 0, s.size, 0, Math.PI*2); break;
            case "rect":
                ctx.rect(-s.size/2, -s.size/2, s.size, s.size); break;
            case "triangle": {
                const h = s.size * Math.sqrt(3)/2;
                ctx.moveTo(0,-h*0.67); ctx.lineTo(s.size/2,h*0.33); ctx.lineTo(-s.size/2,h*0.33);
                ctx.closePath(); break;
            }
            case "hexagon":
                for (let i=0;i<6;i++) { const a=(Math.PI/3)*i; i===0?ctx.moveTo(s.size*Math.cos(a),s.size*Math.sin(a)):ctx.lineTo(s.size*Math.cos(a),s.size*Math.sin(a)); }
                ctx.closePath(); break;
            case "diamond":
                ctx.moveTo(0,-s.size); ctx.lineTo(s.size*0.6,0); ctx.lineTo(0,s.size); ctx.lineTo(-s.size*0.6,0);
                ctx.closePath(); break;
            case "line":
                ctx.moveTo(-s.size,0); ctx.lineTo(s.size,0); break;
            case "arrow":
                ctx.moveTo(-s.size,0); ctx.lineTo(s.size,0);
                ctx.moveTo(s.size*0.5,-s.size*0.3); ctx.lineTo(s.size,0); ctx.lineTo(s.size*0.5,s.size*0.3);
                break;
            case "cross":
                ctx.moveTo(-s.size,0); ctx.lineTo(s.size,0);
                ctx.moveTo(0,-s.size); ctx.lineTo(0,s.size);
                break;
            case "sphere-proj":
                ctx.arc(0,0,s.size,0,Math.PI*2);
                ctx.moveTo(0,-s.size); ctx.bezierCurveTo(s.size*1.5,-s.size,s.size*1.5,s.size,0,s.size);
                ctx.moveTo(0,-s.size); ctx.bezierCurveTo(-s.size*1.5,-s.size,-s.size*1.5,s.size,0,s.size);
                break;
        }
        if (s.fill && !["line","arrow","cross"].includes(s.type)) {
            ctx.fillStyle = s.color; ctx.fill();
        }
        ctx.strokeStyle = s.stroke;
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.restore();
    }

    function updateShape(s, w, h) {
        s.x += s.vx; s.y += s.vy; s.angle += s.vAngle;
        const m = s.size + 10;
        if (s.x < -m) s.x = w+m; if (s.x > w+m) s.x = -m;
        if (s.y < -m) s.y = h+m; if (s.y > h+m) s.y = -m;
    }

    // ── Moteur par section ────────────────────────────
    function makeEngine(pageId, canvasId, shapeKey) {
        const canvas = makeCanvas(canvasId);
        const ctx = canvas.getContext("2d");
        const shapes = [];
        let raf = null;

        function resize() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener("resize", () => { resize(); });

        function init() {
            shapes.length = 0;
            for (let i=0; i<26; i++) shapes.push(createShape(shapeKey, canvas.width, canvas.height));
        }

        function loop() {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = "rgba(2,6,23,0.18)";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            for (const s of shapes) { updateShape(s, canvas.width, canvas.height); drawShape(ctx,s); }
            raf = requestAnimationFrame(loop);
        }

        function start() {
            if (raf) return;
            canvas.style.display = "block";
            resize(); init(); loop();
        }

        function stop() {
            if (raf) { cancelAnimationFrame(raf); raf = null; }
            canvas.style.display = "none";
        }

        const section = document.getElementById(pageId);
        if (!section) return;

        new MutationObserver(() => {
            section.classList.contains("hidden") ? stop() : start();
        }).observe(section, { attributes:true, attributeFilter:["class"] });

        // Démarre uniquement si la section est déjà visible
        if (!section.classList.contains("hidden")) {
            // Petit délai pour laisser la page s'afficher d'abord
            setTimeout(start, 50);
        }
    }

    // Lance les 3 animations
    makeEngine("page-geometry", "geo-canvas",     "geometry");
    makeEngine("page-convert",  "convert-canvas", "convert");
    makeEngine("page-volumes",  "volumes-canvas", "volumes");

})();
