// Get elements from the DOM
const home = document.getElementById('home'),
  logout = document.getElementById('logout'),
  profile = document.getElementById('profile'),
  content = document.getElementById('content'),
  table = document.getElementById('table'),
  closeRecipeBtn = document.getElementById('close-btn'),
  single_meal = document.getElementById('planner-meal'),
  matchList = document.getElementById('match-list'),
  editBtn = document.getElementById('edit-recipe'),
  saveBtn = document.getElementById('save-edit'),
  addBtn = document.getElementById('add-planner'),
  selectPlanner = document.getElementById('select-planner'),
  plannerName = document.getElementById('planner-name'),
  cancel = document.getElementById('cancel'),
  modal = document.getElementById('dropdown-alert'),
  modalContent = document.getElementById('dropdown-content'),
  deleteAlert = document.getElementById('delete-modal'),
  plannerNameHd = document.getElementById('name-heading'),
  searchInput = document.getElementById('search-input');

var cellColNum;
var cellRowNum;
var type;
var url;
var mth;

var Recipes = [];
var Planner = [];

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
        // resultHeading.innerHTML = '';
        // meals.innerHTML = '';
        // single_mealEl.innerHTML = '';
        clearStorage();
        location.href = '../login.html';
      } else {
        alert('Logout failed...');
      }
    });
}

function clearStorage() {
  localStorage.removeItem('pagenum');
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
}

const onload = async () => {
  if (!localStorage.getItem('token')) {
    location.href = '../login.html';
  }
  loading.classList.add('loading-active');
  foo = await getRecipes();
  Recipes = foo.data;
  planner = await getPlanner();
  for (var i = 0; i < Planner.length; i++) {
    var opt = document.createElement('option');
    opt.appendChild(document.createTextNode(Planner[i].name));
    opt.value = Planner[i]._id;
    selectPlanner.appendChild(opt);
  }
  showPlanner(planner, false);
  loading.classList.remove('loading-active');
};

async function getPlanner() {
  const planner = await fetch(
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
      Planner = results.data;
      return results.data[0];
    });
  return planner;
}

async function getPlannerById(id) {
  const planner = await fetch(
    `https://www.mealprepapi.com/api/v1/planner/${id}`,
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
      console.log(results);
      return results.data;
    });
  return planner;
}

function showPlanner(planner, edit) {
  plannerNameHd.innerHTML = `<h1>${planner.name}</h1>`;
  // if (planner.date) {
  //   var date = new Date(planner.startDate);
  //   console.log(date);
  //   plannerDate.innerHTML =
  //     date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
  // }
  table.innerHTML = '';
  var tbl = document.createElement('table');
  var tblBody = document.createElement('tbody');
  var headerTitle = [
    'Category',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  var category = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];
  var headRow = document.createElement('tr');
  for (var i = 0; i < 8; i++) {
    var header = document.createElement('th');
    var headertext = document.createTextNode(`${headerTitle[i]}`);
    header.appendChild(headertext);
    headRow.appendChild(header);
  }
  tbl.appendChild(headRow);

  // creating cells
  for (var i = 0; i < 5; i++) {
    var row = document.createElement('tr');

    for (var j = -1; j < 7; j++) {
      var cell = document.createElement('td');
      var cellText;
      if (edit === false) {
        switch (i) {
          case 0: {
            if (j === -1) {
              cellText = document.createTextNode(`Breakfast`);
            } else if (planner.breakfastName[j] == null) {
              cellText = document.createTextNode('');
            } else {
              cellText = document.createTextNode(`${planner.breakfastName[j]}`);
              cell.setAttribute('data-recipeID', planner.breakfastID[j]);
            }
            break;
          }
          case 1: {
            if (j === -1) {
              cellText = document.createTextNode(`Lunch`);
            } else if (planner.lunchName[j] == null) {
              cellText = document.createTextNode('');
            } else {
              cellText = document.createTextNode(`${planner.lunchName[j]}`);
              cell.setAttribute('data-recipeID', planner.lunchID[j]);
            }
            break;
          }
          case 2: {
            if (j === -1) {
              cellText = document.createTextNode(`Dinner`);
            } else if (planner.dinnerName[j] == null) {
              cellText = document.createTextNode('');
            } else {
              cellText = document.createTextNode(`${planner.dinnerName[j]}`);
              cell.setAttribute('data-recipeID', planner.dinnerID[j]);
            }
            break;
          }
          case 3: {
            if (j === -1) {
              cellText = document.createTextNode(`Dessert`);
            } else if (planner.dessertName[j] == null) {
              cellText = document.createTextNode('');
            } else {
              cellText = document.createTextNode(`${planner.dessertName[j]}`);
              cell.setAttribute('data-recipeID', planner.dessertID[j]);
            }
            break;
          }
          case 4: {
            if (j === -1) {
              cellText = document.createTextNode(`Snack`);
            } else if (planner.snackName[j] == null) {
              cellText = document.createTextNode('');
            } else {
              cellText = document.createTextNode(`${planner.snackName[j]}`);
              cell.setAttribute('data-recipeID', planner.snackID[j]);
            }
            break;
          }
        }
        if (j !== -1) {
          cell.classList.add('recipe-info');
        }
      } else {
        plannerName.value = selectPlanner[selectPlanner.selectedIndex].text;
        switch (i) {
          case 0: {
            if (j === -1) {
              cellText = document.createTextNode(`Breakfast`);
            } else if (planner.breakfastName[j] == null) {
              cellText = document.createElement('input');
            } else {
              cellText = document.createElement('input');
              cellText.value = planner.breakfastName[j];
              cell.setAttribute('data-recipeID', planner.breakfastID[j]);
            }
            break;
          }
          case 1: {
            if (j === -1) {
              cellText = document.createTextNode(`Lunch`);
            } else if (planner.lunchName[j] == null) {
              cellText = document.createElement('input');
            } else {
              cellText = document.createElement('input');
              cellText.value = planner.lunchName[j];
              cell.setAttribute('data-recipeID', planner.lunchID[j]);
            }
            break;
          }
          case 2: {
            if (j === -1) {
              cellText = document.createTextNode(`Dinner`);
            } else if (planner.dinnerName[j] == null) {
              cellText = document.createElement('input');
            } else {
              cellText = document.createElement('input');
              cellText.value = planner.dinnerName[j];
              cell.setAttribute('data-recipeID', planner.dinnerID[j]);
            }
            break;
          }
          case 3: {
            if (j === -1) {
              cellText = document.createTextNode(`Dessert`);
            } else if (planner.dessertName[j] == null) {
              cellText = document.createElement('input');
            } else {
              cellText = document.createElement('input');
              cellText.value = planner.dessertName[j];
              cell.setAttribute('data-recipeID', planner.dessertID[j]);
            }
            break;
          }
          case 4: {
            if (j === -1) {
              cellText = document.createTextNode(`Snack`);
            } else if (planner.snackName[j] == null) {
              cellText = document.createElement('input');
            } else {
              cellText = document.createElement('input');
              cellText.value = planner.snackName[j];
              cell.setAttribute('data-recipeID', planner.snackID[j]);
            }
            break;
          }
        }
        if (j !== -1) {
          cellText.setAttribute('class', 'search-input');
        }
      }

      cell.appendChild(cellText);
      row.appendChild(cell);
    }
    tblBody.appendChild(row);
  }
  // put the <tbody> in the <table>
  tbl.appendChild(tblBody);
  // appends <table> into <body>
  table.appendChild(tbl);
  // sets the border attribute of tbl to 2;
  tbl.setAttribute('border', '2');
  tbl.setAttribute('data-plannerId', planner._id);
}

async function getRecipeById(recipeID) {
  const recipe = await fetch(
    `https://www.mealprepapi.com/api/v1/recipes/${recipeID}`
  )
    .then((response) => response.json())
    .then((results) => {
      return results.data;
    });
  showRecipe(recipe);
  console.log(recipe);
}

function showRecipe(recipe) {
  const ingredients = [];
  for (let i = 0; i < recipe.ingredientNames.length; i++) {
    if (recipe.ingredientQtys[i] === undefined) {
      ingredients.push(`
      ${recipe.ingredientNames[i]}
    `);
    } else {
      ingredients.push(`
      ${recipe.ingredientNames[i]} - ${recipe.ingredientQtys[i]}
    `);
    }
  }
  single_meal.innerHTML = `
    <div class="planner-meal-card" id="container">
      <div class="planner-meal-btn">
        <button id='edit-recipe' onclick='editRecipe()'>Edit</button>
        <button id='delete-recipe' onclick='deleteRecipe()'>Delete</button>
        <button class="close-meal-btn" id="close-meal-btn" onclick="closeMeal()">&times;</button>
      </div>
      <div class="planner-meal-title" data-RecipeId=${
        recipe.id
      } id="recipe-title">
      ${recipe.title}
      </div>
      <div class="planner-meal-body" id="planner-sgl-meal">
      <div class="planner-meal-category">
          ${recipe.category ? `<p>${recipe.category}</p>` : ''}
      </div>
      <div class="planner-meal-serves">
        <h5>Prep time: ${recipe.prepTime} Serves: ${recipe.serves}</h5>
      </div>
      <div class="planner-meal-types">
       ${recipe.vegan ? '<span class="vegan-card">Vegan</span>' : ''}
       ${
         recipe.glutenFree ? '<span class="gluten-card">Gluten Free</span>' : ''
       }
      </div>
      <div class="planner-meal-main">
        <div class="info-block">
          <div class="planner-meal-ingredients">
          <h2>Ingregients</h2>
          <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
         </ul>
        </div>
        <div class="planner-meal-directions">
          <h2>Directions</h2>
          <p>${recipe.directions}</p>
        </div>
        </div>
        <div class="planner-meal-notes">
          <h2 id="note-heading">${recipe.notes ? 'Notes' : ''}</h2>
           <p>${recipe.notes}</p> 
        </div>
      </div>
  </div>
`;
  if (recipe.notes) {
    document.getElementById('note-heading').style.borderBottom =
      '1px solid #727070';
  } else {
    document.getElementById('note-heading').style.borderBottom = '';
  }
  const singleMeal = document.getElementById('container');
  singleMeal.classList.add('planner-active');
}

function closeMeal() {
  const singleMeal = document.getElementById('container');
  singleMeal.classList.remove('planner-active');
}

async function editPlanner() {
  type = 'edit';
  var edit = true;
  planner = await getPlanner();
  console.log(planner);
  showPlanner(planner, edit);
  editActive();
  const search = document.querySelectorAll('.search-input');
  search.forEach(function (search) {
    search.addEventListener('input', () => searchRecipes(search.value));
  });
  getCellIndex();
}

const deletePlanner = async () => {
  openDelete();
};

const deleteYes = async () => {
  var table = document.querySelector('table');
  plannerId = table.getAttribute('data-plannerid');
  await fetch(`https://www.mealprepapi.com/api/v1/planner/${plannerId}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + localStorage.token,
    },
  })
    .then((response) => response.json())
    .then((results) => {
      console.log(results);
      location.reload();
    });
};

const deleteNo = () => {
  closeDelete();
};

const searchRecipes = async (searchText) => {
  let matches = Recipes.filter((recipe) => {
    const regex = new RegExp(`^${searchText}`, 'gi');
    return recipe.title.match(regex) || recipe.category.match(regex);
  });
  if (searchText.length == 0) {
    matches = [];
    matchList.innerHTML = '';
  }
  outputHtml(matches);
};

const getRecipes = async () => {
  const recipes = await fetch(
    `https://www.mealprepapi.com/api/v1/recipes?user=${localStorage.userId}&&limit=50`
  )
    .then((response) => response.json())
    .then((results) => {
      return results;
    });
  return recipes;
};

const outputHtml = (matches) => {
  if (matches.length > 0) {
    const html = matches
      .map(
        (match) => `
      <div class="match-results" data-recipeId="${match.id}">
        <h4>
          ${match.title} 
        </h4>
      </div>
    `
      )
      .join('');

    matchList.innerHTML = html;
  } else {
    matchList.innerHTML = '';
  }
};

const addToPlanner = (recipeId, recipeName) => {
  console.log(cellColNum);
  var cell = document.getElementsByTagName('table')[0].rows[cellRowNum].cells[
    cellColNum
  ];
  var cellValue = cell.querySelector('.search-input');
  cell.setAttribute('data-recipeID', recipeId);
  cellValue.value = recipeName;
};

const getCellIndex = () => {
  const cells = document.querySelectorAll('td');
  cells.forEach((cell) => {
    cell.addEventListener('click', () => {
      cellColNum = cell.cellIndex;
      cellRowNum = cell.closest('tr').rowIndex;
      console.log(cellRowNum, cellColNum);
    });
  });
};

const savePlanner = async () => {
  const table = document.querySelector('table');
  const tableId = table.getAttribute('data-plannerId');
  var breakfastID = [],
    breakfastName = [],
    lunchID = [],
    lunchName = [],
    dinnerID = [],
    dinnerName = [],
    dessertID = [],
    dessertName = [],
    snackID = [],
    snackName = [];

  for (var i = 1, row; (row = table.rows[i]); i++) {
    var index = 0;
    for (var j = 1, col; (col = row.cells[j]); j++) {
      switch (i) {
        case 1: {
          if (!col.getAttribute('data-recipeID')) {
            breakfastID[index] = '';
            breakfastName[index] = '';
          } else {
            breakfastID[index] = col.getAttribute('data-recipeID');
            breakfastName[index] = col.firstChild.value;
          }
          index++;
          break;
        }
        case 2: {
          if (!col.getAttribute('data-recipeID')) {
            lunchID[index] = '';
            lunchName[index] = '';
          } else {
            lunchID[index] = col.getAttribute('data-recipeID');
            lunchName[index] = col.firstChild.value;
          }
          index++;
          break;
        }
        case 3: {
          if (!col.getAttribute('data-recipeID')) {
            dinnerID[index] = '';
            lunchName[index] = '';
          } else {
            dinnerID[index] = col.getAttribute('data-recipeID');
            dinnerName[index] = col.firstChild.value;
          }
          index++;
          break;
        }
        case 4: {
          if (!col.getAttribute('data-recipeID')) {
            dessertID[index] = '';
            dessertName[index] = '';
          } else {
            dessertID[index] = col.getAttribute('data-recipeID');
            dessertName[index] = col.firstChild.value;
          }
          index++;
          break;
        }
        case 5: {
          if (!col.getAttribute('data-recipeID')) {
            snackID[index] = '';
            snackName[index] = '';
          } else {
            snackID[index] = col.getAttribute('data-recipeID');
            snackName[index] = col.firstChild.value;
          }
          index++;
          break;
        }
      }
    }
  }
  if (type === 'edit') {
    url = `https://www.mealprepapi.com/api/v1/planner/${tableId}`;
    mth = 'put';
  } else if (type === 'add') {
    url = `https://www.mealprepapi.com/api/v1/planner`;
    mth = 'post';
  }
  await fetch(url, {
    method: mth,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.token,
    },
    body: JSON.stringify({
      user: localStorage.userId,
      name: plannerName.value,
      breakfastID,
      breakfastName,
      lunchID,
      lunchName,
      dinnerID,
      dinnerName,
      dessertID,
      dessertName,
      snackID,
      snackName,
    }),
  })
    .then((response) => response.json())
    .then((results) => {
      if (results.sucess === true) {
        openModal(true);
        setTimeout(closeModal, 1501);
        type = '';
        plainView();
        showPlanner(results.data, false);
      } else {
        openModal(false);
        setTimeout(closeModal, 1501);
      }
      console.log(results);
    });
};

const addPlanner = async () => {
  type = 'add';
  addActive();
  table.innerHTML = '';
  var tbl = document.createElement('table');
  var tblBody = document.createElement('tbody');
  var headerTitle = [
    'Category',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  var category = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];
  var headRow = document.createElement('tr');
  for (var i = 0; i < 8; i++) {
    var header = document.createElement('th');
    var headertext = document.createTextNode(`${headerTitle[i]}`);
    header.appendChild(headertext);
    headRow.appendChild(header);
  }
  tbl.appendChild(headRow);

  for (var i = 0; i < 5; i++) {
    var row = document.createElement('tr');

    for (var j = -1; j < 7; j++) {
      var cell = document.createElement('td');
      var cellText;
      switch (i) {
        case 0: {
          if (j === -1) {
            cellText = document.createTextNode(category[i]);
          } else {
            cellText = document.createElement('input');
          }
          break;
        }
        case 1: {
          if (j === -1) {
            cellText = document.createTextNode(category[i]);
          } else {
            cellText = document.createElement('input');
          }
          break;
        }
        case 2: {
          if (j === -1) {
            cellText = document.createTextNode(category[i]);
          } else {
            cellText = document.createElement('input');
          }
          break;
        }
        case 3: {
          if (j === -1) {
            cellText = document.createTextNode(category[i]);
          } else {
            cellText = document.createElement('input');
          }
          break;
        }
        case 4: {
          if (j === -1) {
            cellText = document.createTextNode(category[i]);
          } else {
            cellText = document.createElement('input');
          }
          break;
        }
        case 5: {
          if (j === -1) {
            cellText = document.createTextNode(category[i]);
          } else {
            cellText = document.createElement('input');
          }
          break;
        }
      }
      if (j !== -1) {
        cellText.setAttribute('class', 'search-input');
      }
      cell.appendChild(cellText);
      row.append(cell);
    }
    tblBody.appendChild(row);
  }

  tbl.appendChild(tblBody);
  table.appendChild(tbl);
  tbl.setAttribute('border', '2');
  const search = document.querySelectorAll('.search-input');
  search.forEach(function (search) {
    search.addEventListener('input', () => searchRecipes(search.value));
  });
  getCellIndex();
};

const editActive = () => {
  editBtn.classList.add('edit-active');
  plannerName.classList.add('planner-active');
  cancel.classList.remove('no-active');
  addBtn.classList.add('edit-active');
  saveBtn.classList.remove('no-active');
  searchInput.classList.remove('no-active');
};

const addActive = () => {
  addBtn.classList.add('edit-active');
  plannerName.classList.add('planner-active');
  editBtn.classList.add('edit-active');
  cancel.classList.remove('no-active');
  saveBtn.classList.remove('no-active');
  searchInput.classList.remove('no-active');
};

const plainView = () => {
  plannerName.classList.remove('planner-active');
  cancel.classList.add('no-active');
  editBtn.classList.remove('edit-active');
  addBtn.classList.remove('edit-active');
  saveBtn.classList.add('no-active');
  searchInput.classList.add('no-active');
};

const cancelPlanner = () => {
  location.reload();
};

const openModal = (success) => {
  if (success === true) {
    modalContent.innerHTML = `<p>Request was made successfully</p>`;
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

const openDelete = () => {
  deleteAlert.classList.remove('dropdown-not-active');
  deleteAlert.classList.add('dropdown-active');
};

const closeDelete = () => {
  deleteAlert.classList.remove('dropdown-active');
  deleteAlert.classList.add('dropdown-not-active');
};

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
matchList.addEventListener('click', (e) => {
  const recipeInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains('match-results');
    } else {
      return false;
    }
  });
  if (recipeInfo) {
    const recipeId = recipeInfo.getAttribute('data-recipeId');
    const recipeName = recipeInfo.textContent.trim();
    addToPlanner(recipeId, recipeName);
  }
});
selectPlanner.addEventListener('change', async function () {
  var planner = await getPlannerById(this.value);
  console.log(planner);
  showPlanner(planner, false);
});
