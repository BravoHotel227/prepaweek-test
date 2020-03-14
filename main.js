document.getElementById('connect').addEventListener('click', queryApi);
document.getElementById('users').addEventListener('click', queryUsers);
document.getElementById('login').addEventListener('click', login);
document.getElementById('check').addEventListener('click', check);
async function queryApi(){
    document.getElementById('information').innerHTML = '<ul id="recipeList">';
    var count = 0;
    await fetch(`https://www.mealprepapi.com/api/v1/recipes?user=${localStorage.userId}&&limit=50`)
        .then((response) => {
            return response.json()
        })
        .then((results) => {
            //console.log(results.data[0].title); 
            //document.getElementById('recipes').innerHTML += '<li> ' + results.data + '</li>';
            results.data.forEach(result => {
                //document.getElementById('information').innerHTML += `<li> ` + result.title + `</li>`;
                document.getElementById('recipeList').innerHTML += '<li>' + result.title + '</li>';
               count++;
            });
        })
    document.getElementById('information').innerHTML += '</ul>'; 
    check();
    console.log(count);
    //getRecipe();
}

async function login(){
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
        .then((response) => response.json())
        .then((results) => {
            if(results.success === true){
                document.getElementById('information').innerHTML = 'Logged in sucessfully';
            }
            else{
                document.getElementById('information').innerHTML = 'Incorrect log in details';
            }
            // store token in local storage
            localStorage.token = results.token;
            //console.log(token);
        })
}

async function queryUsers(){
    // retrieve token from local storage
    bToken = 'Bearer '+(localStorage.token);
    await fetch('https://www.mealprepapi.com/api/v1/auth/me', {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'Authorization': bToken
        },
    })
        .then((response) => response.json())
        .then((results) => {
            document.getElementById('information').innerHTML = results.date.name;
            localStorage.userId = results.date._id;
        })
}

function check(){
    var lis = document.getElementById('information').getElementsByTagName('li');
    for(var i =0; i < lis.length; i++){
        //lis[i].addEventListener("click", getRecipe(this))
        lis[i].onclick = function() {
            getRecipe(this);
        }
    }
    //console.log(lis.length);
}

async function getRecipe(recipeName){
  //var lis = document.getElementById('information').getElementsByTagName('li');
   //console.log(lis.length);
   console.log(recipeName.innerHTML);
   checkTitle(recipeName.innerHTML);
   await fetch(`https://www.mealprepapi.com/api/v1/recipes?title=${recipeName}`, {
       method: 'GET',
       headers: {
           'Content-type': 'application/json'
       },
   })
        .then((response) => response.json())
        .then((results) => {
            for(i = 0; i < results.data.length; i++){
                document.getElementById('recipe-info').innerHTML += results.data[0].title;
                for(i=0;i<results.data[0].ingredientNames.length;i++){
                    document.getElementById('recipe-info').innerHTML += '<li>' + results.data[0].ingredientNames[i] + '-' + results.data[0].ingredientQtys[i] +'</li>';
                }
                console.log(results.data[0]);
            }
        })
}

function checkTitle(recipeName){
    for(i = 0; i< recipeName.length; i++){
        if(recipeName[i] === '&'){
            recipeName = recipeName.split('&amp;').join('%26');
            break;
        } 
    }
    console.log(recipeName)
    return recipeName;
}