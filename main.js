// DOM Elements
const logout = document.getElementById('logout'),
  profile = document.getElementById('profile'),
  resultHeading = document.getElementById('result-heading'),
  mealsEl = document.getElementById('meals'),
  single_mealEl = document.getElementById('container'),
  createRecipeForm = document.getElementById('createRecipe'),
  submitForm = document.getElementById('submit-form'),
  photoForm = document.getElementById('photoUpload'),
  addRecipeBtn = document.getElementById('btn-addRecipe'),
  closeRecipeBtn = document.getElementById('close-btn'),
  getRecipe = document.getElementById('get-recipe'),
  loading = document.getElementById('loading'),
  emptyRecipe = document.getElementById('empty-recipe'),
  formHeading = document.getElementById('form-heading');

let pageNum = 1;

// Fetch all recipes owned by logged in user
async function queryApi(pageNum) {
  loading.classList.add('loading-active');
  await fetch(
    `https://www.mealprepapi.com/api/v1/recipes?user=${localStorage.userId}&&page=${pageNum}&&limit=15`
  )
    .then((response) => response.json())
    .then((results) => {
      if (results.data === null) {
        resultHeading.innerHTML = `<p> No results found </p>`;
      } else {
        console.log(results.data);
        mealsEl.innerHTML = results.data
          .map(
            (recipe) => `
          <div class="recipe">
            <div class="recipe-info" data-recipeID="${recipe._id}">
              <h3>${recipe.title}</h3>
             <h5> Prep Time: ${recipe.prepTime} Serves: ${recipe.serves} </h5>
            </div>
          </div>
        `
          )
          .join('');
      }
      if (results.data.length === 0) {
        emptyRecipe.classList.add('empty-recipe');
        emptyRecipe.innerHTML = `<h3 class="emptyRecipes">Add some recipes...</h3>`;
      } else {
        emptyRecipe.classList.remove('empty-recipe');
        emptyRecipe.innerHTML = '';
        mealsEl.innerHTML += `<div id="page-buttons" class="page-buttons"></div>`;
      }
      if (results.data.length >= 15) {
        const pageButtons = document.getElementById('page-buttons');
        pageButtons.innerHTML += `
         <button id="page-next" onclick="queryApi(${
           pageNum + 1
         })">Next Page</button>
         `;
      }
      if (results.pagination.prev) {
        const pageButtons = document.getElementById('page-buttons');
        pageButtons.innerHTML += `
        <button id="page-prev" onclick="queryApi(${
          pageNum - 1
        })">Previous Page</button>
        `;
      }
    });
  loading.classList.remove('loading-active');
}

// Fetch recipe by id
function getRecipeById(recipeID) {
  fetch(`https://www.mealprepapi.com/api/v1/recipes/${recipeID}`)
    .then((response) => response.json())
    .then((results) => {
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
    <span id="recipeId" style="display:none">${recipe.id}</span>
    <div class="meal-btn">
      <button id='edit-recipe' onclick='editRecipe()'>Edit</button>
      <button id='delete-recipe' onclick='deleteRecipe()'>Delete</button>
      <button class="close-meal-btn" id="close-meal-btn" onclick="closeMeal()">&times;</button>
    </div>
  </div>
  <div class="meal-title" id="meal-title">
    ${recipe.title}
  </div>
  <div class="meal-body" id="sgl-meal">
      <div class="single-meal-category">
          ${recipe.category ? `<p>${recipe.category}</p>` : ''}
      </div>
      <div class="recipe-time-serves">
        <h5>Prep time: ${recipe.prepTime} Serves: ${recipe.serves}</h5>
      </div>
      <div class="single-meal-types">
       ${recipe.vegan ? '<span class="vegan-card">Vegan</span>' : ''}
       ${
         recipe.glutenFree ? '<span class="gluten-card">Gluten Free</span>' : ''
       }
      </div>
      <div class="main">
          <p>${recipe.directions}</p>
          <h2 class="ingregients">Ingregients</h2>
          <ul>
              ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
          <ul>
      </div>
  </div>
`;
  single_mealEl.classList.add('active');
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
        location.href = './login/login.html';
      } else {
        console.log(results);
        alert('Logout failed...');
      }
    });
}

function showProfile() {
  location.href = './profile/profile.html';
}

async function createRecipe(e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('prepTime', document.getElementById('prepTime').value);
  formData.append('serves', document.getElementById('serves').value);
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
  if(formHeading.innerHTML === 'Edit Recipe'){
    const id = document.getElementById('recipeId').innerHTML;
    await fetch(`https://www.mealprepapi.com/api/v1/recipes/${id}`, {
      method: 'put',
      headers: {
        Authorization: 'Bearer ' + localStorage.token,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((results) => {
        console.log(results);
        location.reload();
      });
  }else{
    await fetch('https://www.mealprepapi.com/api/v1/recipes', {
      method: 'post',
      headers: {
        Authorization: 'Bearer ' + localStorage.token,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((results) => {
        location.reload();
        console.log(results);
      });
  }

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
        'Content-Type': 'image/jpeg',
      },
      body: formData,
    }
  )
    .then((response) => response.json())
    .then((results) => {
      console.log(results);
    });
}

async function editRecipe() {
  formHeading.innerHTML = 'Edit Recipe';

  const recipeForm = document.getElementById('add-recipe-container');
  recipeForm.classList.add('active');
  // Get form elements
  const title = document.getElementById('title'),
    prepTime = document.getElementById('prepTime'),
    serves = document.getElementById('serves'),
    category = document.getElementById('category'),
    directions = document.getElementById('directions'),
    notes = document.getElementById('notes'),
    vegan = document.getElementById('vegan'),
    gluten = document.getElementById('glutenfree'),
    ingredientName = document.getElementById("ingredientName_0"),
    ingredientQty = document.getElementById("ingredientQty_0");
  const id = document.getElementById('recipeId').innerHTML;
  await fetch(`https://www.mealprepapi.com/api/v1/recipes/${id}`, {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + localStorage.token,
    },
  })
    .then((response) => response.json())
    .then((results) => {
      title.value = results.data.title;
      prepTime.value = results.data.prepTime;
      serves.value = results.data.serves;
      category.value = results.data.category;
      directions.value = results.data.directions;
      notes.value = results.data.notes;
      vegan.checked = results.data.vegan;
      gluten.checked = results.data.glutenFree;
      ingredientName.value = results.data.ingredientNames[0];
      ingredientQty.value = results.data.ingredientQtys[0];
      for( i = 1; i < results.data.ingredientNames.length; i++){
      let divCont = document.createElement('DIV');
      divCont.setAttribute('id', `ingContainer_${i}`);
      divCont.setAttribute('class', 'ingContainer');
      divCont.innerHTML += `<input type="text" value="${results.data.ingredientNames[i]}" class="ingredientName" id="ingredientName_${i}" placeholder="Ingredient Name">`;
      divCont.innerHTML += `<input type="text" value="${results.data.ingredientQtys[i]}" class="ingredientQty" id="ingredientQty_${i}" placeholder="Ingreditent Quantity">`;
      document.getElementById('ingredientCont').appendChild(divCont);
      }

    });
}

async function deleteRecipe() {
  const id = document.getElementById('recipeId').innerHTML;
  await fetch(`https://www.mealprepapi.com/api/v1/recipes/${id}`, {
    method: 'delete',
    headers: {
      Authorization: 'Bearer ' + localStorage.token,
    },
  })
    .then((response) => response.json())
    .then((results) => {
      console.log(results);
      location.reload();
    });
}

async function getUser() {
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
        localStorage.userId = results.data._id;
        queryApi(pageNum);
      }
    });
}

// Make the add recipe form visible
function showRecipeForm() {
  formHeading.innerHTML = 'Add Recipe';
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

function clear(e){
  e.preventDefault();
  var inputs = document.getElementById('recipe-form').elements;
}


// Event listeners
logout.addEventListener('click', logoutUser);
profile.addEventListener('click', showProfile);
submitForm.addEventListener('click', createRecipe);
addRecipeBtn.addEventListener('click', showRecipeForm);
closeRecipeBtn.addEventListener('click', closeRecipeForm);
mealsEl.addEventListener('click', (e) => {
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

function addFields() {
  let inputCount = document.querySelectorAll('#ingredientCont .ingredientName')
    .length;
  let divCont = document.createElement('DIV');
  divCont.setAttribute('id', `ingContainer_${inputCount}`);
  divCont.setAttribute('class', 'ingContainer');
  divCont.innerHTML += `<input type="text" class="ingredientName" id="ingredientName_${inputCount}" placeholder="Ingredient Name">`;
  divCont.innerHTML += `<input type="text" class="ingredientQty" id="ingredientQty_${inputCount}" placeholder="Ingreditent Quantity">`;
  document.getElementById('ingredientCont').appendChild(divCont);
}

function removeFields() {
  const container = document.getElementById('ingredientCont');
  let inputCount = document.querySelectorAll('#ingredientCont .ingredientName')
    .length;
  if (inputCount === 1) {
    console.log('Cant remove last object');
  } else {
    container.removeChild(container.childNodes[inputCount+1]);
  }
}
