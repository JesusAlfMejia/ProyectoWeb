const TOKEN = "g$Gs67OSoUk5#VTawD7z#eDo4h#Mcz";

function loginWatchForm(){
   let loginBtn = document.querySelector("#loginBtn");
   var elems = document.querySelectorAll('.modal');
   var instances = M.Modal.init(elems, {});

   loginBtn.addEventListener("click", (event) => {
       event.preventDefault();
       login();
   })
}

init()

function login(){
    let emailLabel = document.querySelector("#email");
    let passLabel = document.querySelector("#password");
    var modal1 = document.querySelector("#modal1");
    var modalLogin = M.Modal.getInstance(modal1);
    var modal2 = document.querySelector("#modalError");
    var modalError = M.Modal.getInstance(modal2);
    let modalMessage = document.querySelector("#errorMessage");
    let data = {
        email : emailLabel.value,
        password : password.value
    }
    let url = "/api/users/login";
    let settings = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(url, settings)
    .then(result => {
        if(result.ok){
            modalLogin.open();
            return result.json();
        }
        else{ 
            modalMessage.innerHTML = result.statusText;
            modalError.open();
        }
    })
    .then(responseJSON => {
        if(responseJSON){
            localStorage.setItem('token', responseJSON.token);
            window.location.href = "../pages/home.html";
        }
        
    })
    .catch(err => {
        console.log(err);
        modalMessage.innerHTML = err.message;
        modalError.open();
    })
}

function init(){
    loginWatchForm()

}
