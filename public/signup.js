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

// Show/hide conditional fields based on user type
const userTypeRadios = document.querySelectorAll('input[name="userType"]');
const technicalFields = document.getElementById('technicalFields');
const nonTechnicalFields = document.getElementById('nonTechnicalFields');

userTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        if (e.target.value === 'technical') {
            technicalFields.style.display = 'block';
            nonTechnicalFields.style.display = 'none';
        } else {
            technicalFields.style.display = 'none';
            nonTechnicalFields.style.display = 'block';
        }
    });
});

// Sign up form
const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('errorMessage');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMessage.textContent = '';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const country = document.getElementById('country').value;
    const university = document.getElementById('university').value;
    const userType = document.querySelector('input[name="userType"]:checked').value;

    let bio = '';
    let skills = '';
    let equityOffer = '';
    let projectIdea = '';
    let timeline = '';

    if (userType === 'technical') {
        bio = document.getElementById('bio').value;
        skills = document.getElementById('skills').value;
    } else {
        bio = document.getElementById('bioNonTech').value;
        projectIdea = document.getElementById('projectIdea').value;
        timeline = document.getElementById('timeline').value;
        equityOffer = document.getElementById('equityOffer').value;
    }

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                name,
                country,
                university,
                userType,
                bio,
                skills,
                equityOffer,
                projectIdea,
                timeline
            })
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = '/app';
        } else {
            errorMessage.textContent = data.error || 'Sign up failed';
        }
    } catch (error) {
        errorMessage.textContent = 'An error occurred. Please try again.';
    }
});
