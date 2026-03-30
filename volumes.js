/* ---------------------------------------------------
   VOLUMES — Calculs de volumes 3D
--------------------------------------------------- */

const VOL_COLORS = [
    { dot:"#378ADD", lbl:"#4fc3ff" },
    { dot:"#1D9E75", lbl:"#00e676" },
    { dot:"#D4537E", lbl:"#ff80ab" },
    { dot:"#BA7517", lbl:"#ffcc80" },
    { dot:"#9F7AE4", lbl:"#c4b5fd" },
    { dot:"#0F6E56", lbl:"#34d399" },
];

function volCard(idx, title, formula, body, calcFn) {
    const c = VOL_COLORS[idx];
    return `
    <div class="conv-card">
        <div class="conv-card-header">
            <div class="conv-dot" style="background:${c.dot};"></div>
            <span class="conv-label" style="color:${c.lbl};">${title}</span>
        </div>
        <div class="geo-formula">${formula}</div>
        <div class="vol-fields">${body}</div>
        <button class="conv-btn" onclick="${calcFn}()">Calculer</button>
        <div class="conv-result" id="${calcFn}-r">—</div>
    </div>`;
}

function buildVolumesPage() {
    const page = document.getElementById("page-volumes");
    if (!page) return;

    page.innerHTML = `
        <div class="conv-header">Volumes 3D</div>
        <div class="conv-grid">

        ${volCard(0, "Cube / Pavé", "V = a × b × c", `
            <label class="vol-lbl">Longueur (a)</label>
            <input class="conv-input" type="number" id="cube-a" placeholder="a">
            <label class="vol-lbl">Largeur (b — vide = cube)</label>
            <input class="conv-input" type="number" id="cube-b" placeholder="b">
            <label class="vol-lbl">Hauteur (c — vide = cube)</label>
            <input class="conv-input" type="number" id="cube-c" placeholder="c">
        `, "volCube")}

        ${volCard(1, "Sphère", "V = (4/3) × π × r³", `
            <label class="vol-lbl">Rayon (r)</label>
            <input class="conv-input" type="number" id="sphere-r" placeholder="r">
        `, "volSphere")}

        ${volCard(2, "Cylindre", "V = π × r² × h", `
            <label class="vol-lbl">Rayon (r)</label>
            <input class="conv-input" type="number" id="cyl-r" placeholder="r">
            <label class="vol-lbl">Hauteur (h)</label>
            <input class="conv-input" type="number" id="cyl-h" placeholder="h">
        `, "volCylindre")}

        ${volCard(3, "Cône", "V = (1/3) × π × r² × h", `
            <label class="vol-lbl">Rayon (r)</label>
            <input class="conv-input" type="number" id="cone-r" placeholder="r">
            <label class="vol-lbl">Hauteur (h)</label>
            <input class="conv-input" type="number" id="cone-h" placeholder="h">
        `, "volCone")}

        ${volCard(4, "Pyramide", "V = (1/3) × a × b × h", `
            <label class="vol-lbl">Base a</label>
            <input class="conv-input" type="number" id="pyr-a" placeholder="a">
            <label class="vol-lbl">Base b (vide = carré)</label>
            <input class="conv-input" type="number" id="pyr-b" placeholder="b">
            <label class="vol-lbl">Hauteur (h)</label>
            <input class="conv-input" type="number" id="pyr-h" placeholder="h">
        `, "volPyramide")}

        ${volCard(5, "Tore", "V = 2 × π² × R × r²", `
            <label class="vol-lbl">Grand rayon (R)</label>
            <input class="conv-input" type="number" id="tore-R" placeholder="R">
            <label class="vol-lbl">Petit rayon (r)</label>
            <input class="conv-input" type="number" id="tore-r" placeholder="r">
        `, "volTore")}

        </div>`;
}

/* ── Helpers ── */
function vGet(id) { const e=document.getElementById(id); return e?parseFloat(e.value):NaN; }

function vSet(id, V) {
    const el = document.getElementById(id+"-r");
    if (!el) return;
    el.innerHTML = `<span>📦 Volume : <b>${vFmt(V)} u³</b></span>`;
}

function vErr(id) {
    const el = document.getElementById(id+"-r");
    if (el) el.textContent = "Valeur invalide";
}

function vFmt(n) {
    if (isNaN(n)) return "—";
    if (Math.abs(n) >= 1e7 || (Math.abs(n)<0.001 && n!==0)) return n.toExponential(4);
    return parseFloat(n.toFixed(4)).toString();
}

/* ── Calculs ── */
function volCube() {
    playClick();
    const a=vGet("cube-a"), b=isNaN(vGet("cube-b"))?a:vGet("cube-b"), c=isNaN(vGet("cube-c"))?a:vGet("cube-c");
    if (isNaN(a)) { vErr("volCube"); return; }
    vSet("volCube", a*b*c);
}

function volSphere() {
    playClick();
    const r=vGet("sphere-r");
    if (isNaN(r)) { vErr("volSphere"); return; }
    vSet("volSphere", (4/3)*Math.PI*r**3);
}

function volCylindre() {
    playClick();
    const r=vGet("cyl-r"), h=vGet("cyl-h");
    if (isNaN(r)||isNaN(h)) { vErr("volCylindre"); return; }
    vSet("volCylindre", Math.PI*r**2*h);
}

function volCone() {
    playClick();
    const r=vGet("cone-r"), h=vGet("cone-h");
    if (isNaN(r)||isNaN(h)) { vErr("volCone"); return; }
    vSet("volCone", (1/3)*Math.PI*r**2*h);
}

function volPyramide() {
    playClick();
    const a=vGet("pyr-a"), b=isNaN(vGet("pyr-b"))?a:vGet("pyr-b"), h=vGet("pyr-h");
    if (isNaN(a)||isNaN(h)) { vErr("volPyramide"); return; }
    vSet("volPyramide", (1/3)*a*b*h);
}

function volTore() {
    playClick();
    const R=vGet("tore-R"), r=vGet("tore-r");
    if (isNaN(R)||isNaN(r)) { vErr("volTore"); return; }
    vSet("volTore", 2*Math.PI**2*R*r**2);
}
