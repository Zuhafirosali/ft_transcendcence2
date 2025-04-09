function showPopup_2fa_login() {
    const popup = document.querySelector('.popup');
    popup.style.display = 'flex'; // Make it visible
}

function closePopup_2fa_login() {
    const popup = document.querySelector('.popup');
    popup.style.display = 'none'; // Hide the popup
}


async function login(username, password, code_2fa) {
    try {
        const response = await fetch(`${window.location.origin}/api/users/jwtlogin/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                code_2fa: code_2fa
            })
        });
        return response;
    } catch (error) {
        console.error(error);
        showPopup('Connection error. Please check your internet connection.');
    }
}

async function loginPage() {
    const loginBtn = document.getElementById('login-submit-button');
    const intraBtn = document.getElementById('login-intra-button');

    document.getElementById('togglePassword').addEventListener('click', function () {
        const passwordInput = document.getElementById('login-password');
        const eyeIcon = this.querySelector('i');

        // Toggle the password input type between "password" and "text"
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('fa-eye'); // Remove the "eye" icon
            eyeIcon.classList.add('fa-eye-slash'); // Add the "eye-slash" icon
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('fa-eye-slash'); // Remove the "eye-slash" icon
            eyeIcon.classList.add('fa-eye'); // Add the "eye" icon
        }
    });

    loginBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        try {
            const response = await login(username, password, "");
            console.log("Response status:", response.status);
            if (response.status == 202) {
                showPopup_2fa_login();
                console.log("2FA popup shown");

                document.getElementById('twofa-submit').addEventListener('click', async function() {
                    const code = document.getElementById('twofa-code').value;
                    const response_2fa = await login(username, password, code);
                    console.log("tried to log in with 2fa code");

                    if (response_2fa.ok) {
                        console.log("Login successful");

                        closePopup_2fa_login();
                        showPopup('Login successful!', true);
                        await sleep(4500);
                        window.history.pushState({}, "", '/');
                        await loadPage(selectPage('/'));
                    } else {
                        showPopup('Invalid 2FA code. Please try again.');
                    }
                });

                document.getElementById('twofa-cancel').addEventListener('click', function() {
                    closePopup_2fa_login();
                });

            } else if (response.status == 200) {
                showPopup('Login successful!', true);
                await sleep(2000);
                window.history.pushState({}, "", '/');
                await loadPage(selectPage('/'));
            } else if (response.status === 500) {
                showPopup('Server error. Please try again later.');
            } else if (response.status === 401){
                console.log("Authentication failed");
                showPopup('Incorrect username or password. Please try again.');
            }
        } catch (error) {
            console.error(error);
            showPopup('Connection error. Please check your internet connection.');
        }
    });

    intraBtn.addEventListener('click', async function(event) {
        event.preventDefault();
        try {
            window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-e09df46ca0f66425664e33710a991b6e931014cadc2b3036e80603441ca7c9f5&redirect_uri=https%3A%2F%2F127.0.0.1%2Fwait&response_type=code";
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

async function intralogin() {
    try {
        code = getCodeURL('code');
        const response = await fetch(`${window.location.origin}/api/users/login42/${code}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            await loadPage(selectPage('/'));
            window.history.pushState({}, "", '/');
        } else if (response.status === 500) {
            showPopup('Server error. Please try again later.');
        } else {
            console.log("login problem with 42 api");
        }
    } catch (error) {
        console.error(error);
        showPopup('Connection error. Please check your internet connection.');
    }
}

function closePopup2() {
    document.getElementById('overlay-login').style.display = 'none';
    document.getElementById('qr-popup-login').style.display = 'none';
}
