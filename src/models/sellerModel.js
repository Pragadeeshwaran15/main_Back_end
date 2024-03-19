const mongoose = require('mongoose');
const validator = require('validator');
const SellerSchema=new mongoose.Schema({
    shopname:{
        type:String,
        required:[true,"Shop Name is required"]
    },email:{
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    }
    ,brand:{
        type:String,
        required:[true,"Brand Name is required"]
    }
    ,
    address:{
        type:String,
        required:[true,"Address is required"]
    },
    country:{
        type:String,
        required:[true,"Enter Country Name"]
     },
    state:{
       type:String,
       required:[true,"Enter State Name"]
    },
    city:{
        type:String,
        required:[true,"City is required"]
    },
    pincode:{
        type:String,
        required:[true,"Pin code is requyired"]
    },
    phone:{
        type:String,
       required:[true,"Phone number is required"]
    },
    status:{
        type:Boolean,
        default:false
    }
})

let model =  mongoose.model('Seller',SellerSchema);


module.exports = model;