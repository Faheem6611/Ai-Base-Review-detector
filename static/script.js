document.addEventListener('DOMContentLoaded', function () {

    // ==============================
    // NAVIGATION & TAB SWITCHING
    // ==============================
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    showTab('home');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            showTab(this.getAttribute('data-tab'));
            navMenu.classList.remove('active');
        });
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => navMenu.classList.toggle('active'));
    }

    function showTab(tabName) {
        tabContents.forEach(c => c.classList.remove('active'));
        navLinks.forEach(l => l.classList.remove('active'));
        const tab = document.getElementById(tabName);
        if (tab) tab.classList.add('active');
        const link = document.querySelector(`[data-tab="${tabName}"]`);
        if (link) link.classList.add('active');
    }

    // ==============================
    // AUTHENTICATION FORMS
    // ==============================
    const authTabBtns = document.querySelectorAll('.auth-tab-btn');
    const authForms = document.querySelectorAll('.auth-form');

    authTabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            switchAuthForm(this.getAttribute('data-form'));
        });
    });

    function switchAuthForm(formType) {
        authTabBtns.forEach(btn => btn.classList.remove('active'));
        authForms.forEach(form => form.classList.remove('active'));
        const form = document.getElementById(`${formType}-form`);
        if (form) form.classList.add('active');
        const btn = document.querySelector(`[data-form="${formType}"]`);
        if (btn) btn.classList.add('active');
    }

    window.switchAuthForm = switchAuthForm;

    // ==============================
    // FORM SUBMISSIONS
    // ==============================
    const loginForm = document.querySelector('#login-form form');
    const signupForm = document.querySelector('#signup-form form');
    const contactForm = document.querySelector('#contact form');
    const checkReviewForm = document.querySelector('#check-review-form');

    // LOGIN
    if (loginForm) {
        loginForm.addEventListener('submit', async e => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            if (!email || !password) return alert('Please fill all fields.');

            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            alert(data.message);
            if (data.success) loginForm.reset();
        });
    }

    // SIGNUP
    if (signupForm) {
        signupForm.addEventListener('submit', async e => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;
            const termsAccepted = document.querySelector('input[name="terms"]').checked;

            if (!name || !email || !password || !confirmPassword) return alert('Please fill all fields.');
            if (password !== confirmPassword) return alert('Passwords do not match.');
            if (!termsAccepted) return alert('Please accept Terms & Conditions.');

            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            alert(data.message);
            if (data.success) signupForm.reset();
        });
    }

   // CONTACT FORM SUBMIT WITH RESULT DISPLAY
const contactFormElement = document.getElementById("contact-form");
const contactResult = document.getElementById("contact-result");

if (contactFormElement) {

    contactFormElement.addEventListener("submit", async function(e) {

        e.preventDefault();

        contactResult.innerHTML = "<p>Sending message...</p>";

        const name = document.getElementById("contact-name").value;
        const email = document.getElementById("contact-email").value;
        const subject = document.getElementById("contact-subject").value;
        const message = document.getElementById("contact-message-text").value;

        try {

            const res = await fetch("/api/contact", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message
                })

            });

            const data = await res.json();

            if (data.success) {

                contactResult.innerHTML =
                    "<p style='color:green; font-weight:bold;'>✅ Message sent successfully!</p>";

                contactFormElement.reset();

            } else {

                contactResult.innerHTML =
                    "<p style='color:red;'>❌ " + data.message + "</p>";

            }

        } catch (error) {

            contactResult.innerHTML =
                "<p style='color:red;'>❌ Server error. Try again.</p>";

        }

    });

}

    // CHECK REVIEW
    if (checkReviewForm) {
        checkReviewForm.addEventListener('submit', async e => {
            e.preventDefault();
            const review = document.getElementById('review-text').value;
            if (!review) return alert('Please enter a review.');

            const res = await fetch('/api/check_review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ review })
            });
            const data = await res.json();
            alert(`Prediction: ${data.prediction} (Confidence: ${data.confidence})`);
        });
    }
    // Submit review and show result on page
document.getElementById("check-review-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const review = document.getElementById("review-text").value;
    const resultDiv = document.getElementById("review-result");

    // Clear previous result
    resultDiv.innerHTML = "<p>Analyzing...</p>";

    try {
        const res = await fetch("/api/check_review", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ review })
        });

        const data = await res.json();

        if (data.error) {
            resultDiv.innerHTML = `<p class="error">${data.error}</p>`;
        } else {
            resultDiv.innerHTML = `
                <p><strong>Prediction:</strong> ${data.prediction}</p>
                <p><strong>Confidence:</strong> ${data.confidence_percent ?? 0}%</p>
            `;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">An error occurred. Please try again.</p>`;
    }
});


    // ==============================
    // FORM VALIDATION
    // ==============================
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    emailInputs.forEach(input => {
        input.addEventListener('blur', function () {
            this.style.borderColor = this.value && !validateEmail(this.value) ? '#e74c3c' : '#ddd';
        });
    });

    passwordInputs.forEach(input => {
        input.addEventListener('blur', function () {
            this.style.borderColor = this.value && !validatePassword(this.value) ? '#e74c3c' : '#ddd';
        });
    });

    // ==============================
    // ACCORDION FAQ
    // ==============================
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('active');
        });
    });

    // ==============================
    // CTA BUTTON
    // ==============================
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => showTab('registration'));
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
});
