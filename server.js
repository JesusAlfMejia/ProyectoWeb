const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const {Users} = require('./models/user-model');
const {Animals} = require('./models/animal-model');
const {Missings} = require('./models/missing-model')
const { DATABASE_URL, PORT, SECRET_TOKEN } = require( './config' );
const app = express();
const jsonParser = bodyParser.json();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const TOKEN = "g$Gs67OSoUk5#VTawD7z#eDo4h#Mcz";
app.use(cors());
app.use(express.static("public"));
app.use(morgan('dev'));

app.listen(PORT, () => {
    console.log("This server is running on port 8080");
    new Promise((resolve, reject) =>{
        const settings = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        };
        mongoose.connect(DATABASE_URL, settings, (err) => {
            if(err){
                return reject(err);
            }
            else{
                console.log("Connected succesfully");
                return resolve();
            }
        })

    })
    .catch(err => {
        console.log(err);
    });
})

app.post('/api/users/register', jsonParser, (req, res) => {
    let {firstName, lastName, role, email, password} = req.body;

    if(!firstName || !lastName || !role || !email || !password){
        res.statusMessage = "Por favor llene todos los datos";
        return res.status(406).end()
    }

    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            let newUser = {
                firstName,
                lastName,
                role,
                password : hashedPassword,
                email
            };

            Users
                .createUser(newUser)
                .then(result => {
                    return res.status(201).json(result);
                })
                .catch(err => {
                    res.statusMessage = err.message;
                    return res.status(400).end();
                })
        })
        .catch(err => {
            res.statusMessage = err.message;
            return res.status(400).end();
        })
});

app.get('/api/validate-user', (req, res) => {
    const {sessiontoken} = req.headers;
    jwt.verify(sessiontoken, SECRET_TOKEN, (err, decoded) => {
        if(err){
            res.statusMessage = "La sesión expiro";
            return res.status(400).end();
        }

        return res.status(200).json(decoded);
    });
});

app.post('/api/users/login', jsonParser, (req, res) => {
    let {email, password} = req.body;

    if(!email || !password){
        res.statusMessage = "Por favor escriba el email y la contraseña"
        return res.status(406).end()
    }

    Users
        .getUserByEmail(email)
        .then(user => {
            if(user){
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if(result){
                            let userData = {
                                firstName : user.firstName,
                                lastName : user.lastName,
                                email : user.email
                            };

                            jwt.sign(userData, SECRET_TOKEN, {expiresIn : '1m'}, (err, token) => {
                                if(err){
                                    res.statusMessage = "Something went wrong with generating token";
                                    return res.status(400).end();
                                }
                                return res.status(200).json({token});
                            });
                            
                        }
                        else{
                            throw new Error("Crendenciales invalidas");
                        }
                    })
                    .catch(err=>{
                        res.statusMessage = err.message;
                        return res.status(400).end();
                    })
            }
            else{
                throw new Error("El usuario no existe")
            }
        })
        .catch(err => {
            res.statusMessage = err.message;
            return res.status(400).end();
        })
})

app.get( '/api/animals/all', ( req, res ) => {
    Animals
        .getAllAnimals()
        .then( animals => {
            return res.status( 200 ).json( animals );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.post( '/api/animals/agregar', jsonParser, ( req, res ) => {
    const { animalType, numID, current, location } = req.body;

    if(!animalType || !numID || !current || !location){
        res.statusMessage = "Por favor llene todos los campos"
        return res.status(406).end()
    }

    const newAnimal = {
        animalType,
        numID,
        current,
        location,
        lost : 0
    };

    Animals
        .createAnimalGroup( newAnimal )
        .then( animal => {
            return res.status( 201 ).json( animal );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.patch('/api/animals/eliminate', jsonParser, (req, res) => {
    const {numID, elimQuantity} = req.body;
    if(!numID || !elimQuantity){
        res.statusMessage = "Por favor llene todos los campos"
        return res.status(406).end()
    }
    Animals
    .getAnimalByGroupID(numID)
        .then(animal => {
            if(animal){
            currentQuantity = animal.current;
            newQuantity = currentQuantity - elimQuantity
                if(newQuantity < 0){
                    throw new Error("La cantidad a eliminar no puede ser mayor a la actual");
                }
                else{
                    let values = {
                        current : newQuantity,
                        lost : elimQuantity
                    }
                    console.log(numID, values)
                    Animals
                        .eliminateAnimals(numID, values)
                        .then( animal => {
                            return res.status( 201 ).json( animal );
                        })
                        .catch(err => {
                            res.statusMessage = err.message;
                            return res.status(400).end();
                        })
                    return res.status( 201 ).json( animal );
                    }
            }
            else{
                throw new Error("El grupo con ese ID no existe")
            }
        })
        .catch(err => {
            res.statusMessage = err.message;
            return res.status(400).end();
        })


});

app.get( '/api/missing/all', ( req, res ) => {
    Missings
        .getAllMissing()
        .then( missing => {
            return res.status( 200 ).json( missing );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});

app.post( '/api/missing/agregar', jsonParser, ( req, res ) => {
    const { quantity, reason, animalNumID } = req.body;

    if(!animalNumID || !quantity || !reason){
        res.statusMessage = "Por favor llene todos los campos"
        return res.status(406).end()
    }

    const newMissing = {
        quantity,
        reason,
        animalNumID
    };

    Missings
        .createMissing( newMissing )
        .then( missing => {
            return res.status( 201 ).json( missing );
        })
        .catch( err => {
            res.statusMessage = err.message;
            return res.status( 400 ).end();
        });
});