const mongoose = require('mongoose');

const missingSchema = mongoose.Schema({
    quantity : {
        type: Number,
        required: true
    },
    reason : {
        type: String,
        required: true
    },
    animalNumID : {
        type: Number,
        required: true
    }
});

const missingModel = mongoose.model('missings', missingSchema)

const Missings = {
    createMissing : function(newMissing){
        return missingModel
            .create(newMissing)
            .then(missing => {
                return missing;
            })
            .catch(err => {
                throw new Error(err.message);
            });
    },
    getAllMissing : function(){
        return missingModel
                .find()
                .then( missing => {
                    return missing;
                })
                .catch( err => {
                    throw new Error( err.message );
                }); 
    },
}

module.exports = {Missings};