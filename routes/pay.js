const router = require('express').Router();
const verify = require('../verifyToken');
const moment =require('moment-timezone');
const PayShare = require('../model/payShare')


router.get('/pay', async(req, res) => {
   
    try {

    const payReqValues = new PayShare({
        userName: req.body.userName,
        amount: req.body.amount,
        paymentDate: req.body.paymentDate,
        status: "pending",
        crtDate: moment(),
        paymentDay : req.body.paymentDay,
        paymentMonth : req.body.paymentMonth,
        paymentYear : req.body.paymentYear,
    })
        
        const payShare = await payReqValues.save();
        res.send({ status: "success", message: "Pay request process and sent for approval" })

    } catch (error) {
        return res.status(400).send({ status: 'fail', message: 'something went wrong  ' + error.message });
    }
})
module.exports = router
