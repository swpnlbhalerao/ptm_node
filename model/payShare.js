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
    },
    mdyDate: {
        type: String,
    },
    status: {
        type: String,
    },
    paymentDate: {
        type: String,
    },paymentDay: {
        type: String,
    },paymentMonth: {
        type: String,
    },paymentYear: {
        type: String,
    }
})

module.exports = mongoose.model('payShare', paySchema);