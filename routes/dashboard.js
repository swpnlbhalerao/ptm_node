const router = require('express').Router();
const verify = require('../verifyToken');
const moment =require('moment-timezone');
const Dashboard = require('../model/payShare')


router.get('/getShareByUser', async(req, res) => {

    try {
        let year=req.body.year;
        let user=req.body.userName;
        let matchCondition=`{$match :{ userName :user,paymentYear : year}},`
        let groupCondtion= `{$group : {_id : "$paymentYear",count:{$sum:1},totalAmount :{$sum :"$amount"}}}
                          ,{$project: {_id:0,totalAmount:1}}`
        const userData  = await  Dashboard.aggregate([ 
            {$match :{ userName :user,paymentYear : year}},
            {$group : {_id : "$paymentYear",count:{$sum:1},totalAmount :{$sum :"$amount"}}}
            ,{$project: {_id:0,totalAmount:1}}
            ])

        res.send({ status: "success", message: "dashboard data", data:userData })

    } catch (error) {
        return res.status(400).send({ status: 'fail', message: 'something went wrong  ' + error.message });
    }
})
module.exports = router
