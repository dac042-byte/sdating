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

// Sign in form
const signinForm = document.getElementById('signinForm');
const errorMessage = document.getElementById('errorMessage');

signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = '/app';
        } else {
            errorMessage.textContent = data.error || 'Sign in failed';
        }
    } catch (error) {
        errorMessage.textContent = 'An error occurred. Please try again.';
    }
});
