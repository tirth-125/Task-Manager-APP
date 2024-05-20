function validateForm() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
  
    if (name.trim() == "") {
      alert("Name must be filled out");
      return false;
    }
  
    if (email.trim() == "") {
      alert("Email must be filled out");
      return false;
    }
  
    if (password.trim() == "") {
      alert("Password must be filled out");
      return false;
    }
  
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return false;
    }
  
    // If form is valid, make API call
    signUp(name, email, password,confirmPassword);
    return false; // Prevent form submission
  }
  
  function signUp(name, email, password,confirmPassword) {
    var formData = {
      name: name,
      email: email,
      password: password,
      confirmPassword:confirmPassword
    };
  
    // Replace 'api/signup' with your actual API endpoint for signup
    axios.post('http://127.0.0.1:5000/api/v1/auth/signup', formData)
      .then(response => {
        console.log(response," = rsp");
        // var token = response.data.token;
        // localStorage.setItem('token', token);
        // console.log(response.formData,"=data");
        // Upon successful signup, navigate to a new HTML URLx
        window.location.href = 'login.html'; // Replace 'success.html' with your actual success page URL
      })
      .catch(error => {
        console.error('There was a problem with the signup:', error);
        // alert('There was a problem with the signup. Please try again later.');
      });
  }
  document.addEventListener("DOMContentLoaded", function() {
    var registerButton = document.getElementById("registerButton");
    registerButton.addEventListener("click", function() {
      console.log("ksdds");
      validateForm();
      console.log("ksmsddds");

    });
  });