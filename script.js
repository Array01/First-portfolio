// 1. Initialize Lucide Icons
lucide.createIcons();


let isTerminalRunning = false; // Control variable for terminal loop
async function runTerminal() {
    if (isTerminalRunning) return; // Prevent multiple instances if already running

    isTerminalRunning = true; // Start the loop

    const command = 'grep "FIXED" 2026-report.log';
    const target = document.getElementById("typing-command") || null;
    const logs = Array.from(document.querySelectorAll("#terminal-logs > div"));

    //V0.1
    // Typing the command
    //Remove comment to prevent re-triggering
    //if (target.textContent === "") { // Prevent re-triggering if already typed

    // Loop continuously

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); //Helper function for delays
    const randomSpeed = Math.floor(Math.random() * (100 - 40 + 1) + 40); //() a function alwasy need () to execute
    // Remeber the formula : Math.floor(Math.random() * (max - min + 1) + min);
    // 100 - 40 + 1 = 61, so it generates a number between 0 and 60, then we add 40 to shift the range to 40-100ms
    console.log(randomSpeed);

    while (isTerminalRunning) {
        // Typing the command
        for (let i = 0; i < command.length; i++) {
            target.textContent += command[i];
            await sleep(randomSpeed);
        }

        // Showing logs one by one
        for (let log of logs) {
            await sleep(400);
            log.classList.add("show");
        }

        // Wait 7.5 seconds before resetting
        await sleep(7500);
        // Reset for next loop
        // target.textContent = ""; Prototype 1: instant reset
        for (i = command.length; i >= 0; i--) {
            target.textContent = command.slice(0, i);
            await sleep(30); // Faster deletion speed for better effect
        }
        logs.forEach((log) => log.classList.remove("show"));
    }
}

// --- Carousel Logic ---
const track = document.getElementById("carousel-track");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const counter = document.getElementById("service-counter");
const cards = document.querySelectorAll(".carousel-card");

let currentIndex = 0;
const totalCards = cards.length;

function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 24; // width + gap
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    // Update Counter (e.g., 01 / 04)
    counter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(totalCards).padStart(2, "0")}`;
}

nextBtn.addEventListener("click", () => {
    // If on desktop (width > 768), stop at totalCards - 2, otherwise totalCards - 1
    const maxIndex = window.innerWidth >= 768 ? totalCards - 2 : totalCards - 1;
    if (currentIndex < maxIndex) {
        currentIndex++;
        updateCarousel();
    }
});

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

// Resizing can break the offset, so we reset on window resize
window.addEventListener("resize", updateCarousel);

// --- Scroll Reveal Logic ---
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");

            // FIX: Check if the element coming into view contains the terminal
            // This is what triggers your typing animation!
            if (entry.target.querySelector(".terminal-container")) {
                runTerminal();
            }
        }
    });
}, observerOptions);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// --- Interactive Hover Glow (Global) ---
document.addEventListener("mousemove", (e) => {
    document.querySelectorAll(".hover-card").forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    });
});

// 5. Copy to Clipboard Tooltip
const discordBtn = document.getElementById("discord-btn");
const tooltip = document.getElementById("copy-tooltip");

if (discordBtn) {
    discordBtn.addEventListener("click", () => {
        navigator.clipboard.writeText("YourTag#0000");
        tooltip.style.visibility = "visible";
        setTimeout(() => {
            tooltip.style.visibility = "hidden";
        }, 2000);
    });
}
