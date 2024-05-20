async function login(email, password) {
    try {
        var formData = {
            email: email,
            password: password
        };

        const response = await axios.post(
            'http://127.0.0.1:5000/api/v1/auth/login',

            formData,
        );
        console.log(formData);


        var token = response.data.token;

        // Store the token in local storage
        localStorage.setItem('Authorization', token);

        // Redirect to a new page or perform any other action as needed
        window.location.href = 'index.html'; // Replace 'dashboard.html' with your actual dashboard page URL
    } catch (error) {
        console.error('There was a problem with the login:', error);
        alert('Invalid email or password. Please try again.');
    }
}


document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    // Call the login function with the email and password
    login(email, password);
});
window.addEventListener("load", CheckToken);
function CheckToken() {
    if (window.location.href === "http://127.0.0.1:5500/public/login.html") {
        localStorage.clear()
    }

}