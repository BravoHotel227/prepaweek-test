// Get elements from the DOM
const home = document.getElementById('home'),
    logout = document.getElementById('logout'),
    profile = document.getElementById('profile'),
    content = document.getElementById('content'),
    table = document.getElementById('table');

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

async function getPlanner(){
 const foo = await fetch(`https://www.mealprepapi.com/api/v1/auth/me/planner`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.token,
    },
  })
    .then((response) => response.json())
    .then((results) => {
      const planner = results;
        console.log(results.data);
        //getRecipeById(results.data[0].monday[0]);
      return planner;
    });
    console.log(foo.data[0].monday[0]);
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
              <td>Breakfast</td>
              <td>` + await getRecipeById(foo.data[0].monday[0]) + `</td>
              <td>` + await getRecipeById(foo.data[0].tuesday[0]) + `</td>
              <td>` + await getRecipeById(foo.data[0].wednesday[0]) + `</td>
              <td>` + await getRecipeById(foo.data[0].thursday[0]) + `</td>
              <td>` + await getRecipeById(foo.data[0].friday[0]) + `</td>
              <td>` + await getRecipeById(foo.data[0].saturday[0]) + `</td>
              <td>` + await getRecipeById(foo.data[0].sunday[0]) + `</td>
            </tr>
            <tr>
            <td>Lunch</td>
            <td>` + await getRecipeById(foo.data[0].monday[1]) + `</td>
            <td>` + await getRecipeById(foo.data[0].tuesday[1]) + `</td>
            <td>` + await getRecipeById(foo.data[0].wednesday[1]) + `</td>
            <td>` + await getRecipeById(foo.data[0].thursday[1]) + `</td>
            <td>` + await getRecipeById(foo.data[0].friday[1]) + `</td>
            <td>` + await getRecipeById(foo.data[0].saturday[1]) + `</td>
            <td>` + await getRecipeById(foo.data[0].sunday[1]) + `</td>
          </tr>
          <tr>
          </table`
    //       <td>Dinner</td>
    //       <td>` + await getRecipeById(foo.data[0].monday[2]) + `</td>
    //       <td>` + await getRecipeById(foo.data[0].tuesday[2]) + `</td>
    //       <td>` + await getRecipeById(foo.data[0].wednesday[2]) + `</td>
    //       <td>` + await getRecipeById(foo.data[0].thursday[2]) + `</td>
    //       <td>` + await getRecipeById(foo.data[0].friday[2]) + `</td>
    //       <td>` + await getRecipeById(foo.data[0].saturday[2]) + `</td>
    //       <td>` + await getRecipeById(foo.data[0].sunday[2]) + `</td>
    //     </tr>
    //     <tr>
    //     <td>Snack</td>
    //     <td>` + await getRecipeById(foo.data[0].monday[3] ? foo.data[0].monday[3] : '') + `</td>
    //     <td>` + await getRecipeById(foo.data[0].tuesday[3] ? foo.data[0].tuesday[3] : '') + `</td>
    //     <td>` + await getRecipeById(foo.data[0].wednesday[3] ? foo.data[0].wednesday[3] : '') + `</td>
    //     <td>` + await getRecipeById(foo.data[0].thursday[3] ? foo.data[0].thursday[3] : '') + `</td>
    //     <td>` + await getRecipeById(foo.data[0].friday[3] ? foo.data[0].friday[3] : '') + `</td>
    //     <td>` + await getRecipeById(foo.data[0].saturday[3] ? foo.data[0].saturday[3] : '') + `</td>
    //     <td>` + await getRecipeById(foo.data[0].sunday[3] ? foo.data[0].sunday[3] : '') + `</td>
    //   </tr>
    //   <tr>
    //   <td>Dessert</td>
    //   <td>` + await getRecipeById(foo.data[0].monday[4] ? foo.data[0].monday[4] : '') + `</td>
    //   <td>` + await getRecipeById(foo.data[0].tuesday[4] ? foo.data[0].tuesday[4] : '') + `</td>
    //   <td>` + await getRecipeById(foo.data[0].wednesday[4] ? foo.data[0].wednesday[4] : '') + `</td>
    //   <td>` + await getRecipeById(foo.data[0].thursday[4] ? foo.data[0].thursday[4] : '') + `</td>
    //   <td>` + await getRecipeById(foo.data[0].friday[4] ? foo.data[0].friday[4] : '') + `</td>
    //   <td>` + await getRecipeById(foo.data[0].saturday[4] ? foo.data[0].saturday[4] : '') + `</td>
    //   <td>` + await getRecipeById(foo.data[0].sunday[4] ? foo.data[0].sunday[4] : '') + `</td>
    // </tr>
}

// Fetch recipe by id
async function getRecipeById(recipeID) {
 const foo = await fetch(`https://www.mealprepapi.com/api/v1/recipes/${recipeID}`)
      .then((response) => response.json())
      .then((results) => {
        return results.data.title;
      });
      console.log(foo)
      //return JSON.stringify(foo);
      return foo;
      
  }

// Event listeners
home.addEventListener('click', showHome);
profile.addEventListener('click', showProfile);
logout.addEventListener('click', logoutUser)