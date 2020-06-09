const home = document.getElementById('home'),
  logout = document.getElementById('logout');
content = document.getElementById('content');

function goHome() {
  location.href = '../mainPgae/mainPage.html';
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
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        location.href = '../login.html';
      } else {
        console.log(results);
        alert('Logout failed...');
      }
    });
}

async function loadProfile() {
  if (localStorage.getItem('token')) {
    await fetch('https://www.mealprepapi.com/api/v1/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.token,
      },
    })
      .then((response) => response.json())
      .then((results) => {
        if (results.success === true) {
          console.log(results.data);
          content.innerHTML = `<h1>${results.data.name}</h1> <br /> <h3>${results.data.email}</h3> <br /> <h3>Joined: ${results.data.createdAt}</h3>`;
        }
      });
  } else {
    location.href = '../login.html';
  }
}

// Event listeners
home.addEventListener('click', goHome);
logout.addEventListener('click', logoutUser);
