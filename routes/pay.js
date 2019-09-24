const router = require('express').Router();
const verify = require('../verifyToken');
const moment =require('moment-timezone');
const PayShare = require('../model/payShare')


router.post('/pay', async(req, res) => {
   
    try {

    /*  console.log(req.body);   */ 
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


router.post('/getPayHistByUser', async(req, res) => {

    try {
        let year=+req.body.year;
        let user=req.body.userName;
         data=[];
        
         let userData  = await  PayShare.aggregate([ 
            {$match :{ userName :user,paymentYear : year}},
            {$sort: {paymentMonth:-1,paymentDay:-1}},
            {$project: {crtIp :0,paymentDay :0,paymentMonth :0,paymentYear :0,}}
            ])

            /* console.log(userData); */
         
        res.send({ status: "success", message: "payHistory  user Data ", data : userData })

    } catch (error) {
        return res.status(400).send({ status: 'fail', message: 'something went wrong ohh  ' + error.message });
    }
})





module.exports = router
