function sideNavInit(){
    var elems = document.querySelectorAll('.sidenav');
    var options = {
        draggable : true
    };
    var instances = M.Sidenav.init(elems, options);
}

init()

function modalSesion(){
    var elems = document.querySelectorAll('.modal');
   var instances = M.Modal.init(elems, {});
}
function saveToken(){
    let url = "/api/validate-user";
    let settings = {
        method : 'GET',
        headers : {
            sessionToken : localStorage.getItem('token')
        }
    };

    fetch(url, settings)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            let welcomeMessage = document.querySelector("#homeMessage");
            welcomeMessage.innerHTML = `Bienvenido ${responseJSON.firstName}`;
            console.log(responseJSON);
        })
        .catch(err => {
            console.log(err.message);
            window.location.href = "../index.html";
        })
}

function init(){
    sideNavInit();
    saveToken();
    modalSesion();
}
