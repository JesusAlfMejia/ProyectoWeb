const mongoose = require('mongoose');

const animalSchema = mongoose.Schema({
    animalType : {
        type : String,
        required : true
    },
    numID : {
        type: Number,
        required: true,
        unique: true
    },
    current : {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    lost: {
        type: Number,
        required: true
    },
    
});

const animalModel = mongoose.model('animal', animalSchema)

const Animals = {
    createAnimalGroup : function(newAnimalGroup){
        return animalModel
            .create(newAnimalGroup)
            .then(animal => {
                return animal;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    },
    getAllAnimals : function(){
        return animalModel
                .find()
                .then( animals => {
                    return animals;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    },
    getAnimalByGroupID: function(groupID){
        return animalModel
            .findOne({numID : groupID})
            .then(animal => {
                return animal;
            })
            .catch(err => {
                throw new Error(err.message);
            })
    },
    eliminateAnimals: function(animalID, values){
        return animalModel
        .findOneAndUpdate({numID: animalID}, {$set: values}, {new: true})
        .then(result =>{
            return  result;
        })
        .catch(err =>{
            return err;
        });
    } 
}

module.exports = {Animals};