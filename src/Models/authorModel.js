const mongoose = require('mongoose');

let validateEmail = function(email) {
    let emailRegex = /^\w+[\.-]?\w+@\w+[\.-]?\w+(\.\w{1,3})+$/;  
    return emailRegex.test(email)
};

let authorSchema = mongoose.Schema(
    {
        fname: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        lname: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
        },
        title: {
            type: String,
            enum: ["Mr", "Mrs", "Miss"],
            required: [true, "Type enum is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validateEmail, "Please enter a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
            validate:[passwordValidate, "Please enter a valid password"],
        }
    },
    { timestamps: true }
)


module.exports = mongoose.model('Author', authorSchema);