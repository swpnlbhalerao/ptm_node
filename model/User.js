const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    lastName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    userName: {
        type: String,
        required: true,
        min: 6,
        max: 50,
    },
    email: {
        type: String,
        required: true,
        max: 1024,
        min: 10
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        default: 'user'
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    crtIp: {
        type: String,
        default: '0.0.0.0'
    },
    crtDate: {
        type: String,
       
    },
    status: {
        type: String,
        default: 'active'
    },
    lastLoginDate: {
        type: String,
        default :null
    }
})



module.exports = mongoose.model('User', userSchema);