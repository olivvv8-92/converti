/* ---------------------------------------------------
   SOUNDS — Airbus MCDU Click
--------------------------------------------------- */

let soundEnabled = true;

const clickSound = new Audio("sounds/click.mp3");
clickSound.volume = 0.35;

function playClick() {
    if (soundEnabled) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    playClick();
}
