// DOM Elements
const logout = document.getElementById('logout'),
  login = document.getElementById('login'),
  resultHeading = document.getElementById('result-heading'),
  mealsEl = document.getElementById('meals'),
  iptPassword = document.getElementById('ipt-password'),
  iptUsername = document.getElementById('ipt-username'),
  single_mealEl = document.getElementById('single-meal');

let pageNum = 1;

// Fetch all recipes owned by logged in user
async function queryApi(pageNum) {
  await fetch(
    `https://www.mealprepapi.com/api/v1/recipes?user=${localStorage.userId}&&page=${pageNum}`
    //`https://www.mealprepapi.com/api/v1/recipes?user=5e30c56996249e33805f9302&&page=${pageNum}`
  )
    .then(response => response.json())
    .then(results => {
      if (results.data === null) {
        resultHeading.innerHTML = `<p> No results found </p>`;
      } else {
        mealsEl.innerHTML = results.data
          .map(
            recipe => `
          <div class="recipe">
            <div class="recipe-info" data-recipeID="${recipe._id}">
              <h3>${recipe.title}</h3>
            </div>
          </div>
        `
          )
          .join('');
      }
      if (results.pagination.next) {
        mealsEl.innerHTML += `
         <button id="page-next" onclick="queryApi(${pageNum +
           1})">Next Page</button>
         `;
      }
      if (results.pagination.prev) {
        mealsEl.innerHTML += `
        <button id="page-prev" onclick="queryApi(${pageNum -
          1})">Previous Page</button>
        `;
      }
    });
}

// Fetch recipe by id
function getRecipeById(recipeID) {
  fetch(`https://www.mealprepapi.com/api/v1/recipes/${recipeID}`)
    .then(response => response.json())
    .then(results => {
      const recipe = results.data;
      addRecipeToDOM(recipe);
    });
}

// Add recipe to DOM
function addRecipeToDOM(recipe) {
  const ingredients = [];
  for (let i = 0; i < recipe.ingredientNames.length; i++) {
    ingredients.push(`
      ${recipe.ingredientNames[i]} - ${recipe.ingredientQtys[i]}
    `);
  }
  single_mealEl.innerHTML = `
  <div class="single-meal">
      <h1>${recipe.title}</h1>
      <div class="single-meal-info">
          ${recipe.category ? `<p>${recipe.category}</p>` : ''}
      </div>
      <div class="main">
          <p>${recipe.directions}</p>
          <h2>Ingregients</h2>
          <ul>
              ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
          <ul>
      </div>
  </div>
`;
}

async function loginFun() {
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
        alert('login was sucessful');
        //store token in local storage
        localStorage.token = results.token;
        getUser();
      } else {
        alert('Incorrect details');
      }
    });
}

async function getUser() {
  await fetch('https://www.mealprepapi.com/api/v1/auth/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.token
    }
  })
    .then(response => response.json())
    .then(results => {
      if (results.success === true) {
        localStorage.userId = results.data._id;
        queryApi(pageNum);
      }
    });
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

// Event listeners
logout.addEventListener('click', logoutUser);
login.addEventListener('click', loginFun);
mealsEl.addEventListener('click', e => {
  const recipeInfo = e.path.find(item => {
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

function addFields() {
  const container = document.getElementById('ingredientCont');
  let inputCount = document.querySelectorAll('#ingredientCont .ingredientName')
    .length;
  console.log(inputCount);
  container.innerHTML += `<input type="text" class="ingredientName" id="ingredientName_${inputCount}" placeholder="">`;
  container.innerHTML += `<input type="text" class="ingredientQty" id="ingredientQty_${inputCount}" placeholder=""></br>`;
}
