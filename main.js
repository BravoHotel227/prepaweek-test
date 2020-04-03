// DOM Elements
const logout = document.getElementById('logout'),
  resultHeading = document.getElementById('result-heading'),
  mealsEl = document.getElementById('meals'),
  single_mealEl = document.getElementById('container'),
  createRecipeForm = document.getElementById('createRecipe'),
  photoForm = document.getElementById('photoUpload'),
  addRecipeBtn = document.getElementById('btn-addRecipe'),
  closeRecipeBtn = document.getElementById('close-btn');
getRecipe = document.getElementById('get-recipe');

let pageNum = 1;

if (document.readyState === 'complete') {
  console.log("object")
  document.getElementsByTagName('body').innerHTML +=
    '<img src="spinner.gif" width="200px" height="200px">';
}

// Fetch all recipes owned by logged in user
async function queryApi(pageNum) {
  console.log('test');
  await fetch(
    `https://www.mealprepapi.com/api/v1/recipes?user=${localStorage.userId}&&page=${pageNum}`
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
  <div class="meal-header">
    ${recipe.title}
    <span id="recipeId" style="display:none">${recipe.id}</span>
    <button class="close-meal-btn" id="close-meal-btn" onclick="closeMeal()">&times;</button>
  </div>
  <div class="meal-body" id="sgl-meal">
    <div class="meal-btn">
      <button id='edit-recipe' onclick='editRecipe()'>Edit</button>
      <button id='delete-recipe' onclick='deleteRecipe()'>Delete</button>
    </div>
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
  const recipeForm = document.getElementById('add-recipe-container');
  recipeForm.classList.remove('active');
  single_mealEl.classList.add('active');
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
        location.href = './login/login.html';
      } else {
        console.log(results);
        alert('Logout failed...');
      }
    });
}

async function createRecipe(e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('prepTime', document.getElementById('prepTime').value);
  formData.append('category', document.getElementById('category').value);
  formData.append('directions', document.getElementById('directions').value);
  formData.append('photo', document.getElementById('image').files[0]);
  formData.append('notes', document.getElementById('notes').value);
  let vegan;
  if (document.getElementById('vegan').value === true) {
    vegan = true;
  } else {
    vegan = false;
  }
  let gluten;
  if (document.getElementById('glutenfree').value === true) {
    gluten = true;
  } else {
    gluten = false;
  }
  formData.append('vegan', vegan);
  formData.append('glutenFree', gluten);
  let inputCount = document.querySelectorAll('#ingredientCont .ingContainer')
    .length;
  var ingredientNames = [];
  var ingredientQtys = [];
  for (let i = 0; i < inputCount; i++) {
    ingredientNames[i] = document.getElementById(`ingredientName_${i}`).value;
    ingredientQtys[i] = document.getElementById(`ingredientQty_${i}`).value;
    console.log(ingredientNames[i]);
    formData.append('ingredientNames', ingredientNames[i]);
    formData.append('ingredientQtys', ingredientQtys[i]);
  }
  await fetch('https://www.mealprepapi.com/api/v1/recipes', {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + localStorage.token
    },
    body: formData
  })
    .then(response => response.json())
    .then(results => {
      console.log(results);
    });
}

async function uploadPhoto(e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append('photo', document.getElementById('image').files[0]);
  await fetch(
    `https://www.mealprepapi.com/api/v1/recipes/5e30c53696249e33805f9300/photo`,
    {
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + localStorage.token,
        'Content-Type': 'image/jpeg'
      },
      body: formData
    }
  )
    .then(response => response.json())
    .then(results => {
      console.log(results);
    });
}

async function editRecipe() {
  const id = document.getElementById('recipeId').innerHTML;
  await fetch(`https://www.mealprepapi.com/api/v1/recipes/${id}`, {
    method: 'put',
    headers: {
      Authorization: 'Bearer ' + localStorage.token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      vegan: false
    })
  })
    .then(response => response.json())
    .then(results => {
      console.log(results);
      location.reload();
    });
}

async function deleteRecipe() {
  const id = document.getElementById('recipeId').innerHTML;
  await fetch(`https://www.mealprepapi.com/api/v1/recipes/${id}`, {
    method: 'delete',
    headers: {
      Authorization: 'Bearer ' + localStorage.token
    }
  })
    .then(response => response.json())
    .then(results => {
      console.log(results);
      location.reload();
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

// Make the add recipe form visible
function showRecipeForm() {
  const singleMeal = document.getElementById('container');
  singleMeal.classList.remove('active');
  const recipeForm = document.getElementById('add-recipe-container');
  recipeForm.classList.add('active');
}

function closeRecipeForm() {
  const recipeForm = document.getElementById('add-recipe-container');
  recipeForm.classList.remove('active');
}

function closeMeal() {
  const singleMeal = document.getElementById('container');
  singleMeal.classList.remove('active');
}

// Event listeners
logout.addEventListener('click', logoutUser);
createRecipeForm.addEventListener('submit', createRecipe);
addRecipeBtn.addEventListener('click', showRecipeForm);
closeRecipeBtn.addEventListener('click', closeRecipeForm);
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
  const ingredientCont = document.getElementById('ingredientCont');
  let inputCount = document.querySelectorAll('#ingredientCont .ingredientName')
    .length;
  let divCont = document.createElement('DIV');
  divCont.setAttribute('id', `ingContainer_${inputCount}`);
  divCont.setAttribute('class', 'ingContainer');
  divCont.innerHTML += `<input type="text" class="ingredientName" id="ingredientName_${inputCount}" placeholder="">`;
  divCont.innerHTML += `<input type="text" class="ingredientQty" id="ingredientQty_${inputCount}" placeholder="">`;
  document.getElementById('ingredientCont').appendChild(divCont);
}

function removeFields() {
  const container = document.getElementById('ingredientCont');
  let inputCount = document.querySelectorAll('#ingredientCont .ingredientName')
    .length;
  if (inputCount === 1) {
    console.log('Cant remove last object');
  } else {
    container.removeChild(container.childNodes[inputCount]);
  }
}
