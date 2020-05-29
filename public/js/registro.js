function selectInit(){
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});
}

init()

function init(){
    selectInit();
    registerWatchForm();
    
}

function registerWatchForm(){
    let registerBtn = document.querySelector("#registerBtn");
    var elems = document.querySelectorAll('.modal');
   var instances = M.Modal.init(elems, {});
    registerBtn.addEventListener("click", (event) => {
       event.preventDefault();
       register();
    })
}

function register(){
    let firstNameLabel = document.querySelector("#firstName");
    let lastNameLabel = document.querySelector("#lastName");
    let roleLabel = document.querySelector("#role");
    let emailLabel = document.querySelector("#email");
    let passLabel = document.querySelector("#password");
    var modal1 = document.querySelector("#modal1");
    var modalRegister = M.Modal.getInstance(modal1);
    var modal2 = document.querySelector("#modalError");
    var modalError = M.Modal.getInstance(modal2);
    let modalMessage = document.querySelector("#errorMessage");
    let data = {
        firstName : firstNameLabel.value,
        lastName : lastNameLabel.value,
        role : roleLabel.value,
        email : emailLabel.value,
        password : password.value
    }
    let url = "/api/users/register";
    let settings = {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(url, settings)
    .then(result => {
        if(result.ok){
            modalRegister.open();
            window.location.href = "../index.html"
        }
        else{ 
            modalMessage.innerHTML = result.statusText;
            modalError.open();
        }
    })
    .catch(err => {
        console.log(err);
        modalMessage.innerHTML = err.message;
        modalError.open();
    })
}