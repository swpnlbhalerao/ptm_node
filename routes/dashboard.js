const router = require('express').Router();
const verify = require('../verifyToken');
const moment =require('moment-timezone');
const Dashboard = require('../model/payShare')


router.post('/getShareByUser', async(req, res) => {

    try {
        let year=+req.body.year;
        let user=req.body.userName;
         data=[];
         let piechartJson;
         let userData  = await  Dashboard.aggregate([ 
            {$match :{ userName :user,paymentYear : year}},
            {$group : {_id : "$paymentYear",count:{$sum:1},totalAmount :{$sum :"$amount"}}}
            ,{$project: {_id:0,totalAmount:1}}
            ])

            if(userData){
                dataArray=[]
                dataArray.push('User')
                dataArray.push(userData[0].totalAmount)
               data.push(dataArray); 
            }
            piechartJson={
                text : 'User Share Data for Current Year',
                data : data
            }

          let othersData=await  Dashboard.aggregate([ 
            {$match :{ userName :{$ne :user},paymentYear : year}},
            {$group : {_id : "$paymentYear",count:{$sum:1},totalAmount :{$sum :"$amount"}}}
            ,{$project: {_id:0,totalAmount:1}}
            ])  

            if(othersData){
                dataArray=[]
                dataArray.push('Others')
                dataArray.push(othersData[0].totalAmount)
               data.push(dataArray); 
            }
        res.send({ status: "success", message: "dashboard piechart", data : piechartJson })

    } catch (error) {
        return res.status(400).send({ status: 'fail', message: 'something went wrong  ' + error.message });
    }
})
module.exports = router
