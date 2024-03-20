const mongoose = require('mongoose');


let adschema=new mongoose.Schema({
    adbanner: {
        type: String
    },
    createdAt :{
        type: Date,
        default: Date.now
    }
})

let model =  mongoose.model('Ad', adschema);


module.exports = model;