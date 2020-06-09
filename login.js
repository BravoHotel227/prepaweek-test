const logout = document.getElementById('logout'),
  login = document.getElementById('login'),
  iptPassword = document.getElementById('ipt-password'),
  iptUsername = document.getElementById('ipt-username'),
  register = document.getElementById('register'),
  closeRgt = document.getElementById('close-register'),
  spinner = document.getElementById('spinner'),
  rememberDets = document.getElementById('remember-details'),
  modal = document.getElementById('dropdown-alert'),
  modalContent = document.getElementById('dropdown-content');

const onload = () => {
  if (localStorage.username && localStorage.password) {
    iptUsername.value = localStorage.username;
    iptPassword.value = localStorage.password;
    rememberDets.checked = true;
  }
};

async function loginFun() {
  // spinner.innerHTML = `<img src="../2.gif" width="200px" height="200px" />`;
  console.log(rememberDets.checked);
  spinner.classList.add('spinner-active');
  await fetch('https://www.mealprepapi.com/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      email: iptUsername.value,
      password: iptPassword.value,
    }),
  })
    .then((response) => response.json())
    .then((results) => {
      if (results.success === true) {
        if (rememberDets.checked === true) {
          localStorage.username = iptUsername.value;
          localStorage.password = iptPassword.value;
        } else {
          localStorage.username = '';
          localStorage.password = '';
        }
        //store token in local storage
        localStorage.token = results.token;
        location.href = 'mainPage/mainPage.html';
      } else {
        var type = 'login';
        openModal(false, type);
        setTimeout(closeModal, 1501);
      }
    });

  spinner.classList.remove('spinner-active');
}

async function logoutUser() {
  // retrieve token from local storage
  await fetch('https://www.mealprepapi.com/api/v1/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.token,
    },
  })
    .then((response) => response.json())
    .then((results) => {
      if (results.success === true) {
        resultHeading.innerHTML = '';
        meals.innerHTML = '';
        single_mealEl.innerHTML = '';
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
      } else {
      }
    });
}

// Register user
async function registerForm() {
  const name = document.getElementById('rgt-name').value,
    email = document.getElementById('rgt-email').value,
    password = document.getElementById('rgt-password').value,
    registerCheck = document.getElementById('register-ipt');

  iptUsername.disabled = true;
  iptPassword.disabled = true;
  if (registerCheck.classList.contains('active')) {
    await fetch(`https://www.mealprepapi.com/api/v1/auth/register`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((results) => {
        console.log(results);
        if (results.success === true) {
          var type = 'register';
          openModal(true, type);
          setTimeout(closeModal, 1501);
          name.value = '';
          email.value = '';
          password.value = '';
          location.reload();
        } else {
          openModal(false);
          setTimeout(closeModal, 1501);
        }
      });
  } else {
    registerCheck.classList.add('active');
  }
}

function closeRegister() {
  registerCheck = document.getElementById('register-ipt');
  registerCheck.classList.remove('active');
  iptUsername.disabled = false;
  iptPassword.disabled = false;
}

const openModal = (success, type) => {
  if (success === true && type === 'register') {
    modalContent.innerHTML = `<p>Registration was successful</p>`;
  } else if (success === false && type === 'login') {
    modalContent.innerHTML = `<p>Incorrect login details</p>`;
  } else {
    modalContent.innerHTML = `<p>Oops... Something went wrong</p>`;
  }
  modal.classList.add('dropdown-active');
  modal.classList.remove('dropdown-not-active');
};

const closeModal = () => {
  modal.classList.add('dropdown-not-active');
  modal.classList.remove('dropdown-active');
};

// Event listeners
login.addEventListener('click', loginFun);
register.addEventListener('click', registerForm);
closeRgt.addEventListener('click', closeRegister);
