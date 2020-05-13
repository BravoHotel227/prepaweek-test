// Get elements from the DOM
const home = document.getElementById('home'),
    logout = document.getElementById('logout'),
    profile = document.getElementById('profile');

function showHome(){
    location.href = '../mainPage.html';
}
function showProfile(){
    location.href = '../profile/profile.html';
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
          clearStorage();
          location.href = './login/login.html';
        } else {
          console.log(results);
          alert('Logout failed...');
        }
      });
  }

function clearStorage(){
    localStorage.removeItem('pagenum');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
}

// Event listeners
home.addEventListener('click', showHome);
profile.addEventListener('click', showProfile);
logout.addEventListener('click', logoutUser)