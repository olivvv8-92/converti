/* ---------------------------------------------------
   GEOMETRY — Formes 2D avec unités et formules
--------------------------------------------------- */

const GEO_UNITS = ["mm", "cm", "m", "km", "in", "ft", "NM"];

function unitSelect(id) {
    return `<select class="conv-select" id="${id}">
        ${GEO_UNITS.map(u => `<option value="${u}"${u==="m"?" selected":""}>${u}</option>`).join("")}
    </select>`;
}

/* ── Couleurs des 7 cartes — pastille + label uniquement ── */
const GEO_COLORS = [
    { dot:"#378ADD", lbl:"#4fc3ff" },  // rectangle
    { dot:"#1D9E75", lbl:"#00e676" },  // cercle
    { dot:"#D4537E", lbl:"#ff80ab" },  // triangle
    { dot:"#BA7517", lbl:"#ffcc80" },  // trapèze
    { dot:"#9F7AE4", lbl:"#c4b5fd" },  // losange
    { dot:"#0F6E56", lbl:"#34d399" },  // pentagone
    { dot:"#4fc3ff", lbl:"#93c5fd" },  // ellipse
];

function geoCard(idx, title, formula, body, calcFn) {
    const c = GEO_COLORS[idx];
    return `
    <div class="conv-card">
        <div class="conv-card-header">
            <div class="conv-dot" style="background:${c.dot};"></div>
            <span class="conv-label" style="color:${c.lbl};">${title}</span>
        </div>
        <div class="geo-formula">${formula}</div>
        <div class="vol-fields">${body}</div>
        <button class="conv-btn" onclick="${calcFn}()">Calculer</button>
        <div class="conv-result" id="${calcFn}-result">—</div>
    </div>`;
}

function buildGeometryPanel() {
    const panel = document.getElementById("panel-geometry");
    if (!panel) return;

    panel.innerHTML = `<div class="conv-grid">

    ${geoCard(0, "Rectangle", "P = 2×(l+w) &nbsp;|&nbsp; A = l×w", `
        <label class="vol-lbl">Longueur (l)</label>
        <div class="conv-row">
            <input class="conv-input" type="number" id="rect-l" placeholder="l">
            ${unitSelect("rect-u")}
        </div>
        <label class="vol-lbl">Largeur (w)</label>
        <input class="conv-input" type="number" id="rect-w" placeholder="w">
    `, "geoRectangle")}

    ${geoCard(1, "Cercle", "P = 2×π×r &nbsp;|&nbsp; A = π×r²", `
        <label class="vol-lbl">Rayon (r)</label>
        <div class="conv-row">
            <input class="conv-input" type="number" id="circle-r" placeholder="r">
            ${unitSelect("circle-u")}
        </div>
    `, "geoCircle")}

    ${geoCard(2, "Triangle", "A = (b×h)/2 &nbsp;|&nbsp; P = a+b+c", `
        <label class="vol-lbl">Base (b)</label>
        <div class="conv-row">
            <input class="conv-input" type="number" id="tri-b" placeholder="b">
            ${unitSelect("tri-u")}
        </div>
        <label class="vol-lbl">Hauteur (h)</label>
        <input class="conv-input" type="number" id="tri-h" placeholder="h">
        <label class="vol-lbl">Côtés a et c (pour périmètre)</label>
        <div class="conv-row" style="gap:6px;">
            <input class="conv-input" type="number" id="tri-a" placeholder="a">
            <input class="conv-input" type="number" id="tri-c" placeholder="c">
        </div>
    `, "geoTriangle")}

    ${geoCard(3, "Trapèze", "A = ((a+b)/2)×h", `
        <label class="vol-lbl">Grande base (a)</label>
        <div class="conv-row">
            <input class="conv-input" type="number" id="trap-a" placeholder="a">
            ${unitSelect("trap-u")}
        </div>
        <label class="vol-lbl">Petite base (b)</label>
        <input class="conv-input" type="number" id="trap-b" placeholder="b">
        <label class="vol-lbl">Hauteur (h)</label>
        <input class="conv-input" type="number" id="trap-h" placeholder="h">
    `, "geoTrapeze")}

    ${geoCard(4, "Losange", "A = (d1×d2)/2 &nbsp;|&nbsp; P = 4×c", `
        <label class="vol-lbl">Diagonale 1 (d1)</label>
        <div class="conv-row">
            <input class="conv-input" type="number" id="loz-d1" placeholder="d1">
            ${unitSelect("loz-u")}
        </div>
        <label class="vol-lbl">Diagonale 2 (d2)</label>
        <input class="conv-input" type="number" id="loz-d2" placeholder="d2">
        <label class="vol-lbl">Côté (c) — pour périmètre</label>
        <input class="conv-input" type="number" id="loz-c" placeholder="c">
    `, "geoLosange")}

    ${geoCard(5, "Pentagone", "A = (5×c²×tan(54°))/4 &nbsp;|&nbsp; P = 5×c", `
        <label class="vol-lbl">Côté (c)</label>
        <div class="conv-row">
            <input class="conv-input" type="number" id="penta-c" placeholder="c">
            ${unitSelect("penta-u")}
        </div>
    `, "geoPentagone")}

    ${geoCard(6, "Ellipse", "A = π×a×b &nbsp;|&nbsp; P ≈ formule de Ramanujan", `
        <label class="vol-lbl">Demi-grand axe (a)</label>
        <div class="conv-row">
            <input class="conv-input" type="number" id="ellipse-a" placeholder="a">
            ${unitSelect("ellipse-u")}
        </div>
        <label class="vol-lbl">Demi-petit axe (b)</label>
        <input class="conv-input" type="number" id="ellipse-b" placeholder="b">
    `, "geoEllipse")}

    </div>`;
}

/* ── Helpers ── */
function geoGet(id) { const e=document.getElementById(id); return e?parseFloat(e.value):NaN; }
function geoUnit(id) { const e=document.getElementById(id); return e?e.value:"m"; }

function geoSet(id, perim, aire, u) {
    const el = document.getElementById(id+"-result");
    if (!el) return;
    const pStr = isNaN(perim) ? "" : `<span>📐 Périmètre : <b>${fmt(perim)} ${u}</b></span>`;
    const aStr = `<span>📏 Aire : <b>${fmt(aire)} ${u}²</b></span>`;
    el.innerHTML = [pStr, aStr].filter(Boolean).join("");
}

function geoErr(fn) {
    const el = document.getElementById(fn+"-result");
    if (el) el.textContent = "Valeur invalide";
}

function fmt(n) {
    if (isNaN(n)) return "—";
    if (Math.abs(n) >= 1e7 || (Math.abs(n) < 0.001 && n !== 0)) return n.toExponential(4);
    return parseFloat(n.toFixed(4)).toString();
}

/* ── Calculs ── */
function geoRectangle() {
    playClick();
    const l=geoGet("rect-l"), w=geoGet("rect-w"), u=geoUnit("rect-u");
    if (isNaN(l)||isNaN(w)) { geoErr("geoRectangle"); return; }
    geoSet("geoRectangle", 2*(l+w), l*w, u);
}

function geoCircle() {
    playClick();
    const r=geoGet("circle-r"), u=geoUnit("circle-u");
    if (isNaN(r)) { geoErr("geoCircle"); return; }
    geoSet("geoCircle", 2*Math.PI*r, Math.PI*r*r, u);
}

function geoTriangle() {
    playClick();
    const b=geoGet("tri-b"), h=geoGet("tri-h"), u=geoUnit("tri-u");
    const a=geoGet("tri-a"), c=geoGet("tri-c");
    if (isNaN(b)||isNaN(h)) { geoErr("geoTriangle"); return; }
    const perim = (!isNaN(a)&&!isNaN(c)) ? a+b+c : NaN;
    geoSet("geoTriangle", perim, (b*h)/2, u);
}

function geoTrapeze() {
    playClick();
    const a=geoGet("trap-a"), b=geoGet("trap-b"), h=geoGet("trap-h"), u=geoUnit("trap-u");
    if (isNaN(a)||isNaN(b)||isNaN(h)) { geoErr("geoTrapeze"); return; }
    geoSet("geoTrapeze", NaN, ((a+b)/2)*h, u);
}

function geoLosange() {
    playClick();
    const d1=geoGet("loz-d1"), d2=geoGet("loz-d2"), c=geoGet("loz-c"), u=geoUnit("loz-u");
    if (isNaN(d1)||isNaN(d2)) { geoErr("geoLosange"); return; }
    geoSet("geoLosange", !isNaN(c)?4*c:NaN, (d1*d2)/2, u);
}

function geoPentagone() {
    playClick();
    const c=geoGet("penta-c"), u=geoUnit("penta-u");
    if (isNaN(c)) { geoErr("geoPentagone"); return; }
    geoSet("geoPentagone", 5*c, (5*c*c*Math.tan(54*Math.PI/180))/4, u);
}

function geoEllipse() {
    playClick();
    const a=geoGet("ellipse-a"), b=geoGet("ellipse-b"), u=geoUnit("ellipse-u");
    if (isNaN(a)||isNaN(b)) { geoErr("geoEllipse"); return; }
    const perim = Math.PI*(3*(a+b)-Math.sqrt((3*a+b)*(a+3*b)));
    geoSet("geoEllipse", perim, Math.PI*a*b, u);
}
