// Function to retrieve users from local storage
function getUsersFromStorage() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  return users;
}

// Function to save users to local storage
function saveUsersToStorage(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Function to check if a user exists
function checkUserExists(username, email) {
  const users = getUsersFromStorage();
  return users.some(user => user.username === username || user.email === email);
}

// Function to sign up a user
function signUpUser(username, password, email) {
  if (!username || !password || !email) {
    showAlert('Please fill in all fields.');
    return;
  }

  // Validate email using a simple regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAlert('Please enter a valid email address.');
    return;
  }

  const newUser = { username, password, email };
  let users = getUsersFromStorage();

  // Check if the username or email already exists
  if (checkUserExists(username, email)) {
    alert('User already exists! Please choose a different username or email.');
    return; // Exit function if the user already exists
  }

  // Add the new user to the list
  users.push(newUser);
  saveUsersToStorage(users);

  alert('User successfully signed up!');
  window.location.href = 'login.html';
}

// Function to authenticate user during login
function authenticateUser(username, password) {
  const users = getUsersFromStorage();
  const authenticatedUser = users.find(user => user.username === username && user.password === password);

  if (authenticatedUser) {
    authenticatedUser.isLoggedIn = true; // Set isLoggedIn to true for the authenticated user
    saveUsersToStorage(users); // Save the updated user data
  }

  return authenticatedUser;
}

// Function to set login/logout status in the UI
function updateLoginStatus() {
  const loginBtn = document.getElementById('loginBtn');
  const users = getUsersFromStorage();
  const loggedInUser = users.find(user => user.isLoggedIn);

  if (loggedInUser) {
    // If a user is logged in, change "Login" to "Logout"
    loginBtn.innerHTML = '<a href="#" id="logout">Logout</a>';

    // Add event listener for logout
    document.getElementById('logout').addEventListener('click', function(event) {
      event.preventDefault();
      // Log the user out (set isLoggedIn to false)
      loggedInUser.isLoggedIn = false;
      saveUsersToStorage(users);
      // Redirect to login page after logout
      window.location.href = 'login.html';
    });
  }
}

// Call the function to update login/logout status on page load
document.addEventListener('DOMContentLoaded', function() {
  updateLoginStatus();
});

// // Function to add a default user if it doesn't exist
// function addDefaultUser() {
//   const defaultUser = {
//     username: 'abdulmoiz',
//     password: 'pass123',
//     email: 'abdulmoiziphone4@gmail.com'
//   };
  
//   let users = getUsersFromStorage();
//   users.push(defaultUser);
//   saveUsersToStorage(users);
// }

// // Check if default user exists, if not, add it
// if (!checkUserExists('abdulmoiz', 'abdulmoiziphone4@gmail.com')) {
//   addDefaultUser();
// }

// Event listener for sign up form submission
document.getElementById("sign-up").addEventListener('click', function(event) {
  event.preventDefault();
  const username = document.querySelector('.sign-up-htm #signup-user').value;
  const password = document.querySelector('.sign-up-htm #signup-pass').value;
  const email = document.querySelector('.sign-up-htm #signup-email').value;

  signUpUser(username, password, email);
});

// Event listener for sign in form submission
document.getElementById("sign-in").addEventListener('click', function(event) {
  event.preventDefault();
  const username = document.querySelector('.sign-in-htm #user').value;
  const password = document.querySelector('.sign-in-htm #pass').value;

  const user = authenticateUser(username, password);
  if (user) {
    alert('Login successful! Welcome, ' + user.username + '!');
    // Redirect to homepage after successful login
    window.location.href = 'index.html';
  } else {
    alert('Invalid username or password.');
  }
});

function showAlert(message) {
  var alertBox = document.getElementById('myAlert');
  alertBox.textContent = message;
  alertBox.style.display = 'block';
  setTimeout(function() {
      alertBox.style.display = 'none';
  }, 6000);
}
