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

// --- Carousel Logic ---
const track = document.getElementById("carousel-track");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const counter = document.getElementById("service-counter");
const cards = document.querySelectorAll(".carousel-card");

let currentIndex = 0;
const totalCards = cards.length;

function getDimensions() {
    if (cards.length === 0) return null; //Safety check to prevent errors if there are no cards

    const firstCardRect = cards[0].getBoundingClientRect();
    const secondCard = cards[1] ? cards[1] : cards[0];
    const secondCardRect = secondCard.getBoundingClientRect();

    return {
        cardWidth: secondCardRect.left - firstCardRect.left,
        containerWidth: track.parentElement.offsetWidth,
        visibleCards: Math.floor(
            track.parentElement.offsetWidth / firstCardRect.width,
        ),
    };
}

const realCardWidth = getDimensions()?.cardWidth || 0; //Fallback to 0 if dimensions can't be calculated
const containerWidth = track.parentElement.offsetWidth;

/**
 * Updates carousel position and counter display
 */
function updateCarousel() {
    const dimensions = getDimensions();
    if (!dimensions || cards.length === 0) return; //Safety check to prevent errors if dimensions can't be calculated or there are no cards

    const maxIndex = cards.length - 1; //Cap at the last card

    // Clamp index bounds
    currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);

    //Move the track with hardware acceleration
    track.style.transform = `translateX(-${currentIndex * realCardWidth}px)`;

    // Update Counter (e.g., "01 / 04")
    counter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    // Dispatch custom event for external listeners
    track.dispatchEvent(
        new CustomEvent("carousel:update", { detail: currentIndex }),
    );
}

/**
 * Debounce utility function
 */
function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// --- Touch/Scroll Gesture Handlers ---
let touchStartX = 0;
let touchEndX = 0;

function handleTouchGesture() {
    const swipeThreshold = 50;
    const deltaX = touchStartX - touchEndX;

    if (deltaX > swipeThreshold && currentIndex < cards.length - 1) {
        currentIndex++;
    } else if (deltaX < -swipeThreshold && currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }

    // Reset touch coordinates
    touchStartX = 0;
    touchEndX = 0;
}

track.addEventListener(
    "touchstart",
    (e) => {
        touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
);

track.addEventListener(
    "touchend",
    () => {
        touchEndX = 0; // Prevent phantom touch events
        handleTouchGesture();
    },
    { passive: true },
);

// --- Button Event Listeners ---
nextBtn.addEventListener("click", () => {
    if (currentIndex < cards.length - 1) {
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

// --- Scroll Reveal Logic ---

const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px", // Trigger slightly before element appears
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");

            // Trigger terminal animation if present
            if (entry.target.querySelector(".terminal-container")) {
                runTerminal();
            } else if (!entry.target.querySelector(".terminal-container")) {
                // Optional: Remove active class when scrolled out
                // entry.target.classList.remove("active");
            }
        }
    });
}, observerOptions);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// --- Resize Handler ---
window.addEventListener(
    "resize",
    debounce(() => {
        updateCarousel();
    }, 250),
);

// --- Initialization ---
// Force first update on load
requestAnimationFrame(updateCarousel);

// --- Accessibility Enhancements ---
// Add keyboard navigation
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    }
});

// Update ARIA labels
track.setAttribute("aria-roledescription", "Carousel navigation");
track.setAttribute("role", "region");
counter.setAttribute(
    "aria-label",
    `${currentIndex + 1} of ${cards.length} - Service selection`,
);
nextBtn.setAttribute("aria-label", "Go to next service");
prevBtn.setAttribute("aria-label", "Go to previous service");

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
