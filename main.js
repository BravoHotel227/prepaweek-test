// DOM Elements
const connect = document.getElementById('connect'),
  users = document.getElementById('users'),
  login = document.getElementById('login'),
  check = document.getElementById('check'),
  resultHeading = document.getElementById('result-heading');
mealsEl = document.getElementById('meals');
single_mealEl = document.getElementById('single-meal');
let pageNum = 1;

// Fetch all recipes owned by logged in user
async function queryApi(pageNum) {
  await fetch(
    `https://www.mealprepapi.com/api/v1/recipes?user=${localStorage.userId}&&page=${pageNum}`
  )
    .then(response => {
      return response.json();
    })
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
      console.log(results);
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
      const recipe = results.data[0];

      addRecipeToDOM(recipe);
    });
}

// Add recipe to DOM
function addRecipeToDOM(recipe) {
  // const ingredients = [];
  // for(let i = 0; i < recipe[ingredientNames.length]; i++){
  //   ingredients.push
  // }
  console.log(recipe);
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
              ${recipe.ingredientNames
                .map(ingName => `<li>${ingName}</li>`)
                .join('')}
          <ul>
      </div>
  </div>
`;
}

async function loginFun() {
  let iptUsername = document.getElementById('ipt-username').value;
  let iptPassword = document.getElementById('ipt-password').value;
  await fetch('https://www.mealprepapi.com/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      email: iptUsername,
      password: iptPassword
    })
  })
    .then(response => response.json())
    .then(results => {
      if (results.success === true) {
        document.getElementById('information').innerHTML =
          'Logged in sucessfully';
      } else {
        document.getElementById('information').innerHTML =
          'Incorrect log in details';
      }
      // store token in local storage
      localStorage.token = results.token;
      //console.log(token);
    });
}

async function queryUsers() {
  // retrieve token from local storage
  bToken = 'Bearer ' + localStorage.token;
  await fetch('https://www.mealprepapi.com/api/v1/auth/me', {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: bToken
    }
  })
    .then(response => response.json())
    .then(results => {
      document.getElementById('information').innerHTML = results.date.name;
      localStorage.userId = results.date._id;
    });
}

function checkFun() {
  var lis = document.getElementById('information').getElementsByTagName('li');
  for (var i = 0; i < lis.length; i++) {
    //lis[i].addEventListener("click", getRecipe(this))
    lis[i].onclick = function() {
      getRecipe(this);
    };
  }
  //console.log(lis.length);
}

async function getRecipe(recipeName) {
  //var lis = document.getElementById('information').getElementsByTagName('li');
  //console.log(lis.length);
  console.log(recipeName.innerHTML);
  checkTitle(recipeName.innerHTML);
  await fetch(
    `https://www.mealprepapi.com/api/v1/recipes?title=${recipeName}`,
    {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    }
  )
    .then(response => response.json())
    .then(results => {
      for (i = 0; i < results.data.length; i++) {
        document.getElementById('recipe-info').innerHTML +=
          results.data[0].title;
        for (i = 0; i < results.data[0].ingredientNames.length; i++) {
          document.getElementById('recipe-info').innerHTML +=
            '<li>' +
            results.data[0].ingredientNames[i] +
            '-' +
            results.data[0].ingredientQtys[i] +
            '</li>';
        }
        console.log(results.data[0]);
      }
    });
}

function checkTitle(recipeName) {
  for (i = 0; i < recipeName.length; i++) {
    if (recipeName[i] === '&') {
      recipeName = recipeName.split('&amp;').join('%26');
      break;
    }
  }
  console.log(recipeName);
  return recipeName;
}

// Event listeners
connect.addEventListener('click', queryApi(pageNum));
users.addEventListener('click', queryUsers);
login.addEventListener('click', loginFun);
check.addEventListener('click', checkFun);
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
