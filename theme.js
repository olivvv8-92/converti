/* ---------------------------------------------------
   THEMES — Day / Night Cockpit
--------------------------------------------------- */

let nightMode = true;

function toggleTheme() {
    nightMode = !nightMode;

    if (nightMode) {
        document.body.classList.remove("day-mode");
        document.body.classList.add("night-mode");
    } else {
        document.body.classList.remove("night-mode");
        document.body.classList.add("day-mode");
    }

    // Mise à jour toggle visuel
    const track = document.getElementById("theme-track");
    const thumb = document.getElementById("theme-thumb");
    const label = document.getElementById("theme-label");

    if (track && thumb && label) {
        if (nightMode) {
            track.classList.remove("toggle-on");
            thumb.classList.remove("toggle-thumb-on");
            label.textContent = "Nuit";
            label.style.color = "#7fc8ff";
        } else {
            track.classList.add("toggle-on");
            thumb.classList.add("toggle-thumb-on");
            label.textContent = "Jour";
            label.style.color = "#ffcc80";
        }
    }

    playClick();
}

function updateSoundToggle() {
    const track = document.getElementById("sound-track");
    const thumb = document.getElementById("sound-thumb");
    const label = document.getElementById("sound-label");

    if (!track || !thumb || !label) return;

    if (soundEnabled) {
        track.classList.add("toggle-on");
        thumb.classList.add("toggle-thumb-on");
        label.textContent = "Activé";
        label.style.color = "#00e676";
    } else {
        track.classList.remove("toggle-on");
        thumb.classList.remove("toggle-thumb-on");
        label.textContent = "Désactivé";
        label.style.color = "#4a5a8a";
    }
}
