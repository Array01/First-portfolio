    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 1. Terminal Typing Effect
    async function runTerminal() {
        const command = 'grep "FIXED" 2026-report.log';
        const target = document.getElementById('typing-command');
        const logs = document.querySelectorAll('#terminal-logs > div');
        
        // Typing the command
        //Remove comment to prevent re-triggering
        //if (target.textContent === "") { // Prevent re-triggering if already typed

        // Loop continuously
        while (true) {
            // Typing the command
            for(let i = 0; i < command.length; i++) {
                target.textContent += command[i];
                await new Promise(r => setTimeout(r, 60));
            }

            // Showing logs one by one
            for(let log of logs) {
                await new Promise(r => setTimeout(r, 400));
                log.classList.add('show');
            }

            // Wait 4 seconds before resetting
            await new Promise(r => setTimeout(r, 7500));

            // Reset for next loop
            target.textContent = '';
            logs.forEach(log => log.classList.remove('show'));
        }
    }

    // --- Carousel Logic ---
    const track = document.getElementById('carousel-track');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const counter = document.getElementById('service-counter');
    const cards = document.querySelectorAll('.carousel-card');

    let currentIndex = 0;
    const totalCards = cards.length;

    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth + 24; // width + gap
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Update Counter (e.g., 01 / 04)
        counter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(totalCards).padStart(2, '0')}`;
    }

    nextBtn.addEventListener('click', () => {
        // If on desktop (width > 768), stop at totalCards - 2, otherwise totalCards - 1
        const maxIndex = window.innerWidth >= 768 ? totalCards - 2 : totalCards - 1;
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    // Resizing can break the offset, so we reset on window resize
    window.addEventListener('resize', updateCarousel);

    // --- Scroll Reveal Logic ---
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // FIX: Check if the element coming into view contains the terminal
                // This is what triggers your typing animation!
                if (entry.target.querySelector('.terminal-container')) {
                    runTerminal();
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // --- Interactive Hover Glow (Global) ---
    document.addEventListener('mousemove', e => {
        document.querySelectorAll('.hover-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);  
        });
    });

    // 5. Copy to Clipboard Tooltip
    const discordBtn = document.getElementById('discord-btn');
    const tooltip = document.getElementById('copy-tooltip');

    if (discordBtn) {
        discordBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('YourTag#0000');
            tooltip.style.visibility = 'visible';
            setTimeout(() => { tooltip.style.visibility = 'hidden'; }, 2000);
        });

    }
