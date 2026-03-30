/* ---------------------------------------------------
   CONVERSIONS — Longueurs, Poids, Volumes, Vitesses
--------------------------------------------------- */

const lenFactor = {
    m:1, cm:0.01, mm:0.001, km:1000,
    inch:0.0254, ft:0.3048, yd:0.9144,
    mile:1609.34, nmi:1852
};

const wFactor = {
    kg:1, g:0.001, lb:0.453592, oz:0.0283495
};

const vFactor = {
    l:1, ml:0.001, gal_us:3.78541, gal_uk:4.54609
};

const sFactor = {
    kmh:1, ms:3.6, mph:1.60934, kt:1.852
};

function convResult(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function convGet(id) {
    const el = document.getElementById(id);
    return el ? el.value : null;
}

/* ----------- Longueurs ----------- */
function convertLength() {
    playClick();
    const v    = parseFloat(convGet("len-value"));
    const from = convGet("len-from");
    const to   = convGet("len-to");
    if (isNaN(v) || !lenFactor[from] || !lenFactor[to]) { convResult("len-result", "Erreur"); return; }
    const result = (v * lenFactor[from]) / lenFactor[to];
    convResult("len-result", `${v} ${from} = ${fmt6(result)} ${to}`);
}

/* ----------- Poids ----------- */
function convertWeight() {
    playClick();
    const v    = parseFloat(convGet("w-value"));
    const from = convGet("w-from");
    const to   = convGet("w-to");
    if (isNaN(v) || !wFactor[from] || !wFactor[to]) { convResult("w-result", "Erreur"); return; }
    const result = (v * wFactor[from]) / wFactor[to];
    convResult("w-result", `${v} ${from} = ${fmt6(result)} ${to}`);
}

/* ----------- Volumes ----------- */
function convertVolume() {
    playClick();
    const v    = parseFloat(convGet("v-value"));
    const from = convGet("v-from");
    const to   = convGet("v-to");
    if (isNaN(v) || !vFactor[from] || !vFactor[to]) { convResult("v-result", "Erreur"); return; }
    const result = (v * vFactor[from]) / vFactor[to];
    convResult("v-result", `${v} ${from} = ${fmt6(result)} ${to}`);
}

/* ----------- Vitesses ----------- */
function convertSpeed() {
    playClick();
    const v    = parseFloat(convGet("s-value"));
    const from = convGet("s-from");
    const to   = convGet("s-to");
    if (isNaN(v) || !sFactor[from] || !sFactor[to]) { convResult("s-result", "Erreur"); return; }
    const result = (v * sFactor[from]) / sFactor[to];
    convResult("s-result", `${v} ${from} = ${fmt6(result)} ${to}`);
}

/* ----------- Formatage ----------- */
function fmt6(n) {
    if (Math.abs(n) < 0.000001 || Math.abs(n) >= 1e9) return n.toExponential(4);
    return parseFloat(n.toFixed(6)).toString();
}
