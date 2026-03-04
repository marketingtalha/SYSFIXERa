document.addEventListener('DOMContentLoaded', async () => {
    const sliderContainer = document.getElementById('marquee');
    if (!sliderContainer) return;
    
    let solutions = [];
    try {
        const response = await fetch('/api/solutions');
        if (!response.ok) throw new Error('API failed');
        solutions = await response.json();
    } catch (err) {
        console.log('Using fallback solution data.');
        solutions = [
            { title: "Boot Configuration Data Error", severity: "Critical", system: "Windows", views: 54 },
            { title: "Driver Power State Failure", severity: "Low impact", system: "Windows", views: 18 },
            { title: "System Kernel Panic", severity: "Critical", system: "Linux", views: 120 },
            { title: "Network Adapter Code 10", severity: "Low impact", system: "Windows", views: 85 },
            { title: "DPC Watchdog Violation", severity: "Critical", system: "Windows", views: 200 },
            { title: "Windows Update Failure", severity: "Moderate", system: "Windows", views: 76 }
        ];
    }

    sliderContainer.innerHTML = solutions.map(s => {
        let pillClass = 'success';
        let displaySeverity = s.severity;
        
        if (s.severity === 'Critical') {
            pillClass = 'critical';
        } else if (s.severity === 'Moderate') {
            pillClass = 'success';
        }

        return `
        <div class="slide-item">
            <div class="error-card-header">
                <h4>${s.title}</h4>
                <span class="error-pill ${pillClass}">● ${displaySeverity}</span>
            </div>
            <p class="error-meta">📁 ${s.severity}</p>
            <p class="error-system">System: ${s.system}</p>
            <div class="error-card-footer">
                <button class="view-btn">View Solution</button>
                <span class="views"><span class="eye-icon">👁</span> ${s.views}</span>
            </div>
        </div>
        `;
    }).join('');

    let currentIndex = 0;
    const cards = sliderContainer.querySelectorAll('.slide-item');
    const totalCards = cards.length;
    
    function updateSlider() {
        if (cards.length === 0) return;
        const cardWidth = cards[0].offsetWidth;
        const gapInPx = 32; 
        sliderContainer.style.transform = `translateX(-${(cardWidth + gapInPx) * currentIndex}px)`;
    }

    setInterval(() => {
        let itemsVisible = 3;
        if (window.innerWidth <= 768) {
            itemsVisible = 1;
        } else if (window.innerWidth <= 1024) {
            itemsVisible = 2;
        }

        currentIndex++;
        if (currentIndex > totalCards - itemsVisible) {
            currentIndex = 0; 
        }
        updateSlider();
    }, 3000);

    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateSlider();
    });
});
