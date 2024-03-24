const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Please enter name']
    },
    email:{
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        maxlength: [10, 'Password cannot exceed 10 characters'],
        select: false
    },
    avatar: {
        type: String
    },
    role :{
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt :{
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        if (!this.password) {
            throw new Error('Password is required');
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error); // Pass the error to the next middleware or error handler
    }
});

userSchema.methods.getJwtToken = function(){
   return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

userSchema.methods.isValidPassword = async function(enteredPassword) {
    try {
        // Check if enteredPassword and this.password are defined and not empty
        if (!enteredPassword || !this.password || !enteredPassword.trim() || !this.password.trim()) {
            throw new Error('Password or hashed password is missing or empty');
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(enteredPassword.trim(), this.password.trim());

        return isMatch;
    } catch (error) {
        // Handle any errors, such as logging or throwing an error
        console.error('Error comparing passwords:', error);
        throw new Error('Error comparing passwords');
    }
}


userSchema.methods.getResetToken = function(){
    //Generate Token
    const token = crypto.randomBytes(20).toString('hex');

    //Generate Hash and set to resetPasswordToken
   this.resetPasswordToken =  crypto.createHash('sha256').update(token).digest('hex');

   //Set token expire time
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

    return token
}
let model =  mongoose.model('User', userSchema);


module.exports = model;