/* ---------------------------------------------------
   MCDU MENU — Navigation latérale
--------------------------------------------------- */

function openPage(page) {
    playClick();

    // Marque le bouton actif
    document.querySelectorAll(".lsk").forEach(b => b.classList.remove("active"));
    event && event.target && event.target.classList.add("active");

    // Cache toutes les pages
    const pages = document.querySelectorAll(".cockpit-page");
    pages.forEach(p => p.classList.add("hidden"));

    // Affiche la page cible (déclenche le MutationObserver du canvas)
    const target = document.getElementById(`page-${page}`);
    if (target) target.classList.remove("hidden");

    // Rebuild contenu
    if (page === "convert")  buildConversionPanels();
    if (page === "geometry") buildGeometryPanel();
    if (page === "volumes")  buildVolumesPage();
}

/* ---------------------------------------------------
   CLAVIER MCDU — Saisie dans les champs cockpit
--------------------------------------------------- */

let activeField = null;

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("focus", () => {
            activeField = input;
            playClick();
        });
    });

    const kbdConvertir = document.querySelector(".kbd-convert");
    if (kbdConvertir) {
        kbdConvertir.addEventListener("click", () => {
            if (!activeField) return;
            activeField.value = convertValue(activeField.value);
        });
    }

    document.querySelectorAll(".kbd").forEach(key => {
        key.addEventListener("click", () => {
            playClick();
            if (!activeField) return;

            if (key.classList.contains("kbd-del")) {
                activeField.value = activeField.value.slice(0, -1);
                return;
            }
            if (key.classList.contains("kbd-clr")) {
                activeField.value = "";
                return;
            }
            if (key.classList.contains("kbd-enter")) {
                activeField.blur();
                activeField = null;
                return;
            }

            activeField.value += key.textContent;
        });
    });

    // Affiche la page convert par défaut au démarrage
    buildConversionPanels();
});

/* ---------------------------------------------------
   CONVERSION RAPIDE — champ cockpit (FL, kg, nm…)
--------------------------------------------------- */

function convertValue(raw) {
    raw = raw.trim().toUpperCase();

    if (/^FL\d{2,3}$/.test(raw)) {
        const fl = parseInt(raw.replace("FL", ""));
        return (fl * 100) + " FT";
    }
    if (/^\d{4,5}$/.test(raw)) {
        const ft = parseInt(raw);
        if (ft >= 10000 && ft <= 45000) return "FL" + Math.round(ft / 100);
    }
    if (/^\d+KG$/.test(raw)) {
        const kg = parseInt(raw);
        return `${kg} KG / ${Math.round(kg * 2.20462)} LB`;
    }
    if (/^\d+LB$/.test(raw)) {
        const lb = parseInt(raw);
        return `${Math.round(lb / 2.20462)} KG / ${lb} LB`;
    }
    if (/^\d+NM$/.test(raw)) {
        const nm = parseInt(raw);
        return `${nm} NM / ${Math.round(nm * 1.852)} KM`;
    }
    if (/^\d+KM$/.test(raw)) {
        const km = parseInt(raw);
        return `${Math.round(km / 1.852)} NM / ${km} KM`;
    }

    return raw;
}

/* ---------------------------------------------------
   PANNEAUX DE CONVERSION — injection HTML
--------------------------------------------------- */

function buildConversionPanels() {

    const page = document.getElementById("page-convert");

    page.innerHTML = `
        <div class="conv-header">Conversions</div>
        <div class="conv-grid">

            <!-- LONGUEURS -->
            <div class="conv-card">
                <div class="conv-card-header">
                    <div class="conv-dot dot-len"></div>
                    <span class="conv-label lbl-len">Longueurs</span>
                </div>
                <div class="conv-row">
                    <input class="conv-input" type="number" id="len-value" placeholder="Valeur">
                    <select class="conv-select" id="len-from">
                        <option value="m">m</option>
                        <option value="km">km</option>
                        <option value="ft">ft</option>
                        <option value="nmi">NM</option>
                        <option value="mile">mile</option>
                        <option value="inch">in</option>
                        <option value="cm">cm</option>
                    </select>
                    <span class="conv-arrow">→</span>
                    <select class="conv-select" id="len-to">
                        <option value="ft">ft</option>
                        <option value="m">m</option>
                        <option value="km">km</option>
                        <option value="nmi">NM</option>
                        <option value="mile">mile</option>
                        <option value="inch">in</option>
                        <option value="cm">cm</option>
                    </select>
                </div>
                <button class="conv-btn btn-len" onclick="convertLength()">Convertir</button>
                <div class="conv-result res-len" id="len-result">—</div>
            </div>

            <!-- POIDS -->
            <div class="conv-card">
                <div class="conv-card-header">
                    <div class="conv-dot dot-wt"></div>
                    <span class="conv-label lbl-wt">Poids</span>
                </div>
                <div class="conv-row">
                    <input class="conv-input" type="number" id="w-value" placeholder="Valeur">
                    <select class="conv-select" id="w-from">
                        <option value="kg">kg</option>
                        <option value="lb">lb</option>
                        <option value="g">g</option>
                        <option value="oz">oz</option>
                    </select>
                    <span class="conv-arrow">→</span>
                    <select class="conv-select" id="w-to">
                        <option value="lb">lb</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="oz">oz</option>
                    </select>
                </div>
                <button class="conv-btn btn-wt" onclick="convertWeight()">Convertir</button>
                <div class="conv-result res-wt" id="w-result">—</div>
            </div>

            <!-- VOLUMES -->
            <div class="conv-card">
                <div class="conv-card-header">
                    <div class="conv-dot dot-vol"></div>
                    <span class="conv-label lbl-vol">Volumes</span>
                </div>
                <div class="conv-row">
                    <input class="conv-input" type="number" id="v-value" placeholder="Valeur">
                    <select class="conv-select" id="v-from">
                        <option value="l">L</option>
                        <option value="gal_us">gal US</option>
                        <option value="gal_uk">gal UK</option>
                        <option value="ml">mL</option>
                    </select>
                    <span class="conv-arrow">→</span>
                    <select class="conv-select" id="v-to">
                        <option value="gal_us">gal US</option>
                        <option value="l">L</option>
                        <option value="gal_uk">gal UK</option>
                        <option value="ml">mL</option>
                    </select>
                </div>
                <button class="conv-btn btn-vol" onclick="convertVolume()">Convertir</button>
                <div class="conv-result res-vol" id="v-result">—</div>
            </div>

            <!-- VITESSES -->
            <div class="conv-card">
                <div class="conv-card-header">
                    <div class="conv-dot dot-spd"></div>
                    <span class="conv-label lbl-spd">Vitesses</span>
                </div>
                <div class="conv-row">
                    <input class="conv-input" type="number" id="s-value" placeholder="Valeur">
                    <select class="conv-select" id="s-from">
                        <option value="kt">kt</option>
                        <option value="kmh">km/h</option>
                        <option value="mph">mph</option>
                        <option value="ms">m/s</option>
                    </select>
                    <span class="conv-arrow">→</span>
                    <select class="conv-select" id="s-to">
                        <option value="kmh">km/h</option>
                        <option value="kt">kt</option>
                        <option value="mph">mph</option>
                        <option value="ms">m/s</option>
                    </select>
                </div>
                <button class="conv-btn btn-spd" onclick="convertSpeed()">Convertir</button>
                <div class="conv-result res-spd" id="s-result">—</div>
            </div>

        </div>
    `;
}

