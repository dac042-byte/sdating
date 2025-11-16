// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    htmlElement.setAttribute('data-theme', 'light');
    themeToggle.querySelector('.theme-icon').textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    themeToggle.querySelector('.theme-icon').textContent = newTheme === 'light' ? '☀️' : '🌙';
});

// State
let currentProfiles = [];
let currentIndex = 0;
let currentUser = null;

// Elements
const cardStack = document.getElementById('cardStack');
const noMoreCards = document.getElementById('noMoreCards');
const passBtn = document.getElementById('passBtn');
const likeBtn = document.getElementById('likeBtn');
const viewMatchesBtn = document.getElementById('viewMatches');
const signoutBtn = document.getElementById('signoutBtn');
const swipeView = document.getElementById('swipeView');
const matchesView = document.getElementById('matchesView');
const backToSwipeBtn = document.getElementById('backToSwipe');
const matchModal = document.getElementById('matchModal');
const closeMatchModal = document.getElementById('closeMatchModal');
const viewAllMatches = document.getElementById('viewAllMatches');

// Initialize
async function init() {
    try {
        const response = await fetch('/api/me');
        if (!response.ok) {
            window.location.href = '/';
            return;
        }
        currentUser = await response.json();
        await loadProfiles();
    } catch (error) {
        console.error('Init error:', error);
        window.location.href = '/';
    }
}

// Load profiles
async function loadProfiles() {
    try {
        const response = await fetch('/api/potential-matches');
        currentProfiles = await response.json();
        currentIndex = 0;
        renderCurrentCard();
    } catch (error) {
        console.error('Error loading profiles:', error);
    }
}

// Render current card
function renderCurrentCard() {
    const existingCards = cardStack.querySelectorAll('.profile-card');
    existingCards.forEach(card => card.remove());

    if (currentIndex >= currentProfiles.length) {
        noMoreCards.style.display = 'block';
        return;
    }

    noMoreCards.style.display = 'none';
    const profile = currentProfiles[currentIndex];

    const card = document.createElement('div');
    card.className = 'profile-card';
    card.innerHTML = `
        <div class="profile-header">
            <h2 class="profile-name">${profile.name}</h2>
            <p class="profile-info">📍 ${profile.university}, ${profile.country}</p>
            <span class="user-type-badge">${profile.user_type === 'technical' ? '⚙️ Technical' : '💡 Non-Technical'}</span>
        </div>

        ${profile.bio ? `
            <div class="profile-section">
                <h3>About</h3>
                <p>${profile.bio}</p>
            </div>
        ` : ''}

        ${profile.skills ? `
            <div class="profile-section">
                <h3>Skills</h3>
                <p>${profile.skills}</p>
            </div>
        ` : ''}

        ${profile.project_idea ? `
            <div class="profile-section">
                <h3>Project Idea</h3>
                <p>${profile.project_idea}</p>
            </div>
        ` : ''}

        ${profile.timeline ? `
            <div class="profile-section">
                <h3>Timeline</h3>
                <p>${profile.timeline}</p>
            </div>
        ` : ''}

        ${profile.equity_offer ? `
            <div class="profile-section">
                <h3>Compensation</h3>
                <p>${profile.equity_offer}</p>
            </div>
        ` : ''}
    `;

    cardStack.appendChild(card);

    // Add touch/drag support
    let startX = 0;
    let isDragging = false;

    card.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
    });

    card.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    card.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        card.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
    });

    card.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        card.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
    });

    const endDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.clientX || e.changedTouches[0].clientX;
        const deltaX = endX - startX;

        if (Math.abs(deltaX) > 100) {
            if (deltaX > 0) {
                swipe('right');
            } else {
                swipe('left');
            }
        } else {
            card.style.transform = '';
        }
    };

    card.addEventListener('mouseup', endDrag);
    card.addEventListener('touchend', endDrag);
    card.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            card.style.transform = '';
        }
    });
}

// Swipe function
async function swipe(direction) {
    const card = cardStack.querySelector('.profile-card');
    if (!card) return;

    const profile = currentProfiles[currentIndex];

    card.classList.add(direction === 'right' ? 'swipe-right' : 'swipe-left');

    try {
        const response = await fetch('/api/swipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                swipedUserId: profile.id,
                direction
            })
        });

        const data = await response.json();

        if (data.match) {
            showMatchModal(profile.name);
        }
    } catch (error) {
        console.error('Swipe error:', error);
    }

    setTimeout(() => {
        currentIndex++;
        renderCurrentCard();
    }, 300);
}

// Show match modal
function showMatchModal(name) {
    document.getElementById('matchName').textContent = name;
    matchModal.style.display = 'flex';
}

// Event listeners
passBtn.addEventListener('click', () => swipe('left'));
likeBtn.addEventListener('click', () => swipe('right'));

signoutBtn.addEventListener('click', async () => {
    try {
        await fetch('/api/signout', { method: 'POST' });
        window.location.href = '/';
    } catch (error) {
        console.error('Signout error:', error);
    }
});

viewMatchesBtn.addEventListener('click', async () => {
    swipeView.style.display = 'none';
    matchesView.style.display = 'block';
    await loadMatches();
});

backToSwipeBtn.addEventListener('click', () => {
    matchesView.style.display = 'none';
    swipeView.style.display = 'block';
});

closeMatchModal.addEventListener('click', () => {
    matchModal.style.display = 'none';
});

viewAllMatches.addEventListener('click', async () => {
    matchModal.style.display = 'none';
    swipeView.style.display = 'none';
    matchesView.style.display = 'block';
    await loadMatches();
});

// Load matches
async function loadMatches() {
    try {
        const response = await fetch('/api/matches');
        const matches = await response.json();

        const matchesList = document.getElementById('matchesList');

        if (matches.length === 0) {
            matchesList.innerHTML = '<div style="text-align: center; padding: 50px; color: var(--text-secondary);">No matches yet. Keep swiping!</div>';
            return;
        }

        matchesList.innerHTML = matches.map(match => `
            <div class="match-card">
                <h3>${match.name}</h3>
                <p class="match-info">📍 ${match.university}, ${match.country}</p>
                <p class="match-info">${match.user_type === 'technical' ? '⚙️ Technical' : '💡 Non-Technical'}</p>
                ${match.bio ? `<p class="match-info" style="margin-top: 10px;">${match.bio}</p>` : ''}
                ${match.skills ? `<p class="match-info"><strong>Skills:</strong> ${match.skills}</p>` : ''}
                ${match.project_idea ? `<p class="match-info"><strong>Project:</strong> ${match.project_idea}</p>` : ''}
                ${match.equity_offer ? `<p class="match-info"><strong>Offer:</strong> ${match.equity_offer}</p>` : ''}
                <p class="match-email">📧 ${match.email}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading matches:', error);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (matchesView.style.display !== 'none') return;
    if (matchModal.style.display !== 'none') return;

    if (e.key === 'ArrowLeft') {
        swipe('left');
    } else if (e.key === 'ArrowRight') {
        swipe('right');
    }
});

// Start
init();
