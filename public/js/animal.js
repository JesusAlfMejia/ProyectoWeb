function sideNavInit(){
    var elems = document.querySelectorAll('.sidenav');
    var options = {
        draggable : true
    };
    var instances = M.Sidenav.init(elems, options);
        var elems = document.querySelectorAll('.fixed-action-btn');
        var instances = M.FloatingActionButton.init(elems, options);
}

function floatBtnInit(){
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {hoverEnabled : false});
}

function modalInit(){
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, {});
}

function sendError(errorText){
    let modalErrorRef = document.querySelector("#modalError");
    var modalError = M.Modal.getInstance(modalErrorRef);
    let errorMessage = document.querySelector("#errorMessage");
    errorMessage.innerHTML = errorText;
    modalError.open();
}
function init(){
    sideNavInit();
    floatBtnInit();
    modalInit();
    getAnimales();
    addWatchForm();
    minusWatchForm();
    missingWatchForm();
}

function authRole(role){
    return (req, res, next) => {
        if(req.user.role != role){
            res.status(401)
            return res.send('Not allowed')
        }
    }
}
function addWatchForm(){
    let addBtn = document.querySelector("#addBtn");
    let modal1Ref = document.querySelector("#modalAdd");
    var modal1 = M.Modal.getInstance(modal1Ref);
    let agregarAnimalBtn = document.querySelector("#agregarAnimalBtn");
    addBtn.addEventListener("click", (event) => {
        event.preventDefault();
        modal1.open();
    })
    agregarAnimalBtn.addEventListener("click", (event) => {
        event.preventDefault();
        agregarAnimal();
        modal1.close();
    })
}

function minusWatchForm(){
    let minusBtn = document.querySelector("#minusBtn");
    let modal2Ref = document.querySelector("#modalMinus");
    var modal2 = M.Modal.getInstance(modal2Ref);
    let elimAnimalBtn = document.querySelector("#elimAnimalBtn");
    minusBtn.addEventListener("click", (event) => {
        event.preventDefault();
        modal2.open();
    });
    elimAnimalBtn.addEventListener("click", (event) => {
        event.preventDefault();
        eliminarAnimal();
        modal2.close();
    })
}

function missingWatchForm(){
    let searchBtn = document.querySelector("#searchBtn");
    let modal3Ref = document.querySelector("#modalMissing");
    var modal3 = M.Modal.getInstance(modal3Ref);
    searchBtn.addEventListener("click", (event) => {
        event.preventDefault();
        getMissing();
        modal3.open();
    });
}

function eliminarAnimal(){
    let numIDLabel = document.querySelector("#elimNumID");
    let elimQuantity = document.querySelector("#quantityElim");
    let elimRazon = document.querySelector("#razonElim");
    let data = {
        numID : numIDLabel.value,
        elimQuantity : elimQuantity.value
    };
    let url = "/api/animals/eliminate";
    let settings = {
        method: "PATCH",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(url, settings)
    .then(result => {
        if(result.ok){
            console.log(result);
            getAnimales();
            crearFaltante(elimQuantity.value, elimRazon.value, numIDLabel.value);
        }
        else{ 
           sendError(result.statusText);
        }
    })
    .catch(err => {
        console.log(err);
        sendError(err.message);
    })
}

function crearFaltante(quantity, elimRazon, animalID){
    let data = {
        quantity : quantity,
        reason : elimRazon,
        animalNumID : animalID,
    };
    let url = "/api/missing/agregar";
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
        }
        else{ 
           sendError(result.statusText);
        }
    })
    .catch(err => {
        console.log(err);
        sendError(err.message);
    })
}

function agregarAnimal(){
    let animalLabel = document.querySelector("#animalType");
    let numIDLabel = document.querySelector("#numID");
    let locationLabel = document.querySelector("#location");
    let quantityLabel = document.querySelector("#quantity");
    let data = {
        animalType : animalLabel.value,
        numID : numIDLabel.value,
        location : locationLabel.value,
        current : quantityLabel.value,
        lost : 0
    };
    let url = "/api/animals/agregar";
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
            getAnimales();
        }
        else{ 
           sendError(result.statusText);
        }
    })
    .catch(err => {
        console.log(err);
        sendError(err.message);
    })

}
function getAnimales(){
    let url = "/api/animals/all";
    let settings = {
        method: "GET",
        headers : {

        }
    }
    fetch(url, settings)
    .then(result => {
        if(result.ok){
            return result.json();
        }
    })
    .then(responseJSON => {
        if(responseJSON){
            console.log(responseJSON);
            displayTables(responseJSON);
        }
        
    })
    .catch(err => {
        console.log(err);
    })
}

function getMissing(){
    let url = "/api/missing/all";
    let settings = {
        method: "GET",
        headers : {

        }
    }
    fetch(url, settings)
    .then(result => {
        if(result.ok){
            return result.json();
        }
    })
    .then(responseJSON => {
        if(responseJSON){
            console.log(responseJSON);
            displayMissingTables(responseJSON);
        }
        
    })
    .catch(err => {
        console.log(err);
    })
}

function displayMissingTables(jsonData){
    let datosMissing = document.querySelector("#datosMissing");
    datosMissing.innerHTML="";
    for(let i = 0; i<jsonData.length; i++){
        datosMissing.innerHTML+=
        `
        <tr>
            <td>${jsonData[i].animalNumID}</td>
            <td>${jsonData[i].quantity}</td>
            <td>${jsonData[i].reason}</td>
        </tr>
        `
    }
}

function displayTables(jsonData){
    let datosTablas = document.querySelector("#datosTablas");
    datosTablas.innerHTML="";
    for(let i = 0; i<jsonData.length; i++){
        datosTablas.innerHTML+=
        `
        <tr>
            <td>${jsonData[i].animalType}</td>
            <td>${jsonData[i].numID}</td>
            <td>${jsonData[i].current}</td>
            <td>${jsonData[i].lost}</td>
            <td>${jsonData[i].location}</td>
        </tr>
        `
    }
}
init();