async function registerPage(){
    const registerBtn = document.getElementById('registerBtn');

    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function () {
            const targetInput = document.querySelector(this.getAttribute('data-target'));
            const icon = this.querySelector('i');

            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                targetInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    registerBtn.addEventListener('click', async function(event) {
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const first_name = document.getElementById('register-first-name').value;
        const last_name = document.getElementById('register-last-name').value;
        const pass1 = document.getElementById('register-password').value;
        const pass2 = document.getElementById('register-confirm-password').value;

        const errorMessages = []; 

        if (!email || !username || !first_name || !last_name || !pass1 || !pass2) {
            errorMessages.push('Please fill in all fields.');
        }
        if (first_name === last_name) {
            errorMessages.push('First name and Last name cannot be the same.');
        }
        if (pass1 !== pass2) {
            errorMessages.push('Passwords do not match.');
        }
        

        if (errorMessages.length > 0) {
            showPopup(errorMessages.join('<br>')); 
            return; 
        }

        try {
            const response = await fetch(`${window.location.origin}/api/users/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "username": username,
                    "first_name": first_name,
                    "last_name": last_name,
                    "email": email,
                    "password": pass1
                })
            });

            console.log('Status Code:', response.status);
            if (response.ok) {
                showPopup('Registration successful!', true);
                await sleep(2000);
                await loadPage(selectPage('/'));
            }

            if (response.status === 400) {
                const errorData = await response.json();
                console.log('Error Data:', errorData);

                if (typeof errorData === 'object') {
                    const apiMessagesArray = Object.entries(errorData).flatMap(([key, messages]) =>
                        messages.map(msg => `<div>${msg}</div>`)
                    );
                    const combinedMessages = apiMessagesArray.join('');
                    showPopup(combinedMessages); 
                } else {
                    console.log('Bilinmeyen hata meydana geldi:', errorData);
                }
            } else if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}
