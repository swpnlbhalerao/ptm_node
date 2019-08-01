const mongoose = require('mongoose');


const paySchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        min: 6,
        max: 50,
    },
    amount: {
        type: Number
    },
    crtIp: {
        type: String,
        default: '0.0.0.0'
    },
    crtDate: {
        type: String,
    },
    mdyBy: {
        type: String,
        default: '',
    },
    mdyDate: {
        type: String,
        default : ''
    },
    status: {
        type: String,
    },
    paymentDate: {
        type: String,
    },paymentDay: {
        type: Number,
    },paymentMonth: {
        type: Number,
    },paymentYear: {
        type: Number,
    }
})

module.exports = mongoose.model('payShare', paySchema);