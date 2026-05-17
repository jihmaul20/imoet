const monster = document.querySelector(".monster");
const mouth = document.querySelector(".mouth");
const pupils = document.querySelectorAll(".pupil");
const bubble = document.getElementById("message");

let lastClickTime = 0;
let clickCount = 0;
let isAngry = false;

// audio - efek
const sfx = {
    happy: new Audio("https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"),
    angry: new Audio("https://assets.mixkit.co/active_storage/sfx/2552/2552-preview.mp3"),
    talk: new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3") 
};

const messages = {
    happy: ["Halo!", "Geli!", "Hehe!", "⚡ Zap!", "Main yuk!", "Bzzzt!"],
    angry: ["ADUH!", "STOP!", "JANGAN!", "GALAK NIH!", "OVERLOAD!", "AWAAS!"]
};

// sinkronisasi suara
function playEffect(type, duration) {
    const sound = sfx[type];
    sound.currentTime = 0;
    sound.volume = 0.2;
    sound.play();

    setTimeout(() => {
        sound.pause();
        sound.currentTime = 0;
    }, duration);
}

// tampilan pesan + suara klik
function saySomething(mood) {
    const list = messages[mood];
    bubble.textContent = list[Math.floor(Math.random() * list.length)];
    bubble.classList.add("show");

    playEffect('talk', 300);

    setTimeout(() => bubble.classList.remove("show"), 800);
}

// mata
document.addEventListener("mousemove", (e) => {
    if (isAngry) return;
    pupils.forEach(p => {
        const rect = p.getBoundingClientRect();
        const x = (e.clientX - rect.left) / 20;
        const y = (e.clientY - rect.top) / 20;
        p.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
});

// klik monster
monster.addEventListener("mousedown", () => {
    if (isAngry) return;
    
    const now = Date.now();
    monster.style.transform = "scale(0.93)";

    if (now - lastClickTime < 600) {
        clickCount++;
    } else {
        clickCount = 0;
    }
    lastClickTime = now;

    if (clickCount >= 3) {
        triggerAngry();
    } else {
        triggerHappy();
    }
});

monster.addEventListener("mouseup", () => {
    if (!isAngry) monster.style.transform = "scale(1)";
});

function triggerHappy() {
    monster.classList.add("happy");
    mouth.style.height = "25px";
    mouth.style.borderRadius = "50%";
    
    playEffect('happy', 600);
    saySomething('happy');

    setTimeout(() => {
        monster.classList.remove("happy");
        mouth.style.height = "10px";
        mouth.style.borderRadius = "20px";
    }, 600);
}

function triggerAngry() {
    isAngry = true;
    monster.classList.add("angry");
    
    playEffect('angry', 1200);
    saySomething('angry');

    setTimeout(() => {
        monster.classList.remove("angry");
        monster.style.transform = "scale(1)";
        isAngry = false;
        clickCount = 0;
        mouth.style.height = "10px";
        mouth.style.borderRadius = "20px";
    }, 1200);
}

// waktu kedip monster
setInterval(() => {
    if (isAngry) return;
    document.querySelectorAll(".eye").forEach(e => e.style.transform = "scaleY(0.1)");
    setTimeout(() => {
        document.querySelectorAll(".eye").forEach(e => e.style.transform = "scaleY(1)");
    }, 120);
}, 4000);