const logout = document.getElementById('logout'),
  login = document.getElementById('login'),
  iptPassword = document.getElementById('ipt-password'),
  iptUsername = document.getElementById('ipt-username'),
  register = document.getElementById('register'),
  closeRgt = document.getElementById('close-register'),
  spinner = document.getElementById('spinner');

async function loginFun() {
  // spinner.innerHTML = `<img src="../2.gif" width="200px" height="200px" />`;
  spinner.classList.add('spinner-active');
  await fetch('https://www.mealprepapi.com/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      email: iptUsername.value,
      password: iptPassword.value
    })
  })
    .then(response => response.json())
    .then(results => {
      if (results.success === true) {
        //store token in local storage
        localStorage.token = results.token;
        location.href = '../mainPage.html';
      } else {
        alert('Incorrect details');
      }
    });

  spinner.innerHTML = '';
}

async function logoutUser() {
  // retrieve token from local storage
  await fetch('https://www.mealprepapi.com/api/v1/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.token
    }
  })
    .then(response => response.json())
    .then(results => {
      if (results.success === true) {
        resultHeading.innerHTML = '';
        meals.innerHTML = '';
        single_mealEl.innerHTML = '';
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
      } else {
        console.log(results);
        alert('Logout failed...');
      }
    });
}

// Register user
async function registerForm() {
  const name = document.getElementById('rgt-name').value,
    email = document.getElementById('rgt-email').value,
    password = document.getElementById('rgt-password').value,
    registerCheck = document.getElementById('register-ipt');

  registerCheck.classList.add('active');

  iptUsername.disabled = true;
  iptPassword.disabled = true;

  await fetch(`https://www.mealprepapi.com/api/v1/auth/register`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password
    })
  })
    .then(response => response.json())
    .then(results => {
      console.log(results);
      if (results.success === true) {
        alert('Registration was successful');
        name.value = '';
        email.value = '';
        password.value = '';
        location.reload();
      }
    });
}

function closeRegister() {
  registerCheck = document.getElementById('register-ipt');
  registerCheck.classList.remove('active');
  iptUsername.disabled = false;
  iptPassword.disabled = false;
}

// Event listeners
login.addEventListener('click', loginFun);
register.addEventListener('click', registerForm);
closeRgt.addEventListener('click', closeRegister);
