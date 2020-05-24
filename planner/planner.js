// Get elements from the DOM
const home = document.getElementById('home'),
  logout = document.getElementById('logout'),
  profile = document.getElementById('profile'),
  content = document.getElementById('content'),
  table = document.getElementById('table');

function showHome() {
  location.href = '../mainPage.html';
}
function showProfile() {
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

function clearStorage() {
  localStorage.removeItem('pagenum');
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
}

async function getPlanner() {
  const foo = await fetch(
    `https://www.mealprepapi.com/api/v1/auth/me/planner`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.token,
      },
    }
  )
    .then((response) => response.json())
    .then((results) => {
      const planner = results.data[0];
      console.log(results.data);
      return planner;
    });
  console.log(foo);
  table.innerHTML = `
          <table>
            <tr>
              <th>Category</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
              <th>Saturday</th>
              <th>Sunday</th>
            </tr>
            <tr>
              <td class="breakfast">Breakfast</td>
              <td class="recipe-info" data-recipeID="${foo.breakfastID[0]}">${foo.breakfastName[0]}</td>
              <td data-recipeID="${foo.breakfastID[1]}">>${foo.breakfastName[1]}</td>
              <td data-recipeID="${foo.breakfastID[2]}">>${foo.breakfastName[2]}</td>
              <td data-recipeID="${foo.breakfastID[3]}">>${foo.breakfastName[3]}</td>
              <td data-recipeID="${foo.breakfastID[4]}">>${foo.breakfastName[4]}</td>
              <td data-recipeID="${foo.breakfastID[5]}">>${foo.breakfastName[5]}</td>
              <td data-recipeID="${foo.breakfastID[6]}">>${foo.breakfastName[6]}</td>
            </tr>
            <tr>
            <td class="lunch">Lunch</td>
            <td data-recipeID="${foo.lunchID[0]}">${foo.lunchName[0]}</td>
            <td data-recipeID="${foo.lunchID[1]}">${foo.lunchName[1]}</td>
            <td data-recipeID="${foo.lunchID[2]}">${foo.lunchName[2]}</td>
            <td data-recipeID="${foo.lunchID[3]}">${foo.lunchName[3]}</td>
            <td data-recipeID="${foo.lunchID[4]}">${foo.lunchName[4]}</td>
            <td data-recipeID="${foo.lunchID[5]}">${foo.lunchName[5]}</td>
            <td data-recipeID="${foo.lunchID[6]}">${foo.lunchName[6]}</td>
          </tr>
          <tr>
                 <td class="dinner">Dinner</td>
                 <td>Loaded Beef Burgers</td>
                 <td>Loaded Beef Burgers</td>
                 <td>Loaded Beef Burgers</td>
                 <td>Loaded Beef Burgers</td>
                 <td>Loaded Beef Burgers</td>
                 <td>Loaded Beef Burgers</td>
                 <td>Loaded Beef Burgers</td>
               </tr>
               <tr>
               <td class="dessert">Dessert</td>
               <td></td>
               <td></td>
               <td></td>
               <td></td>
               <td></td>
               <td></td>
               <td></td>
             </tr>
             <tr>
             <td class="snack">Snack</td>
             <td>Kale Chips</td>
             <td>Kale Chips</td>
             <td>Kale Chips</td>
             <td>Kale Chips</td>
             <td>Kale Chips</td>
             <td>Kale Chips</td>
             <td>Kale Chips</td>
           </tr>
          </table`;
}

function getRecipeById(recipeID) {
  fetch(`https://www.mealprepapi.com/api/v1/recipes/${recipeID}`)
    .then((response) => response.json())
    .then((results) => {
      const recipe = results.data;
      console.log(recipe);
    });
}

// Event listeners
home.addEventListener('click', showHome);
profile.addEventListener('click', showProfile);
logout.addEventListener('click', logoutUser);
table.addEventListener('click', (e) => {
  const recipeInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('recipe-info');
    } else {
      return false;
    }
  });
  if (recipeInfo) {
    const recipeID = recipeInfo.getAttribute('data-recipeID');
    getRecipeById(recipeID);
  }
});
