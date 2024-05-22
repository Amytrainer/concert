document.querySelector('.menu-btn').addEventListener(
    'click', () => document.querySelector('.secondNavbar').classList.toggle('show'));
// public/main.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
        };

        fetch('/submit-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.text())
        .then(data => {
            alert('Thank you for your message. We will contact you in two days.');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});
