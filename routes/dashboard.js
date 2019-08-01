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
        res.send({ status: "success",type :'PieChart', message: "dashboard piechart", data : piechartJson })

    } catch (error) {
        return res.status(400).send({ status: 'fail', message: 'something went wrong  ' + error.message });
    }
})

router.post('/getMonthShareByUser', async(req, res) => {

    try {
        let year=+req.body.year;
        let user=req.body.userName;
         data=[];
         
         /*Creating default month with default values */
         monthArray =['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',];
         defaultValueArray=[];
         for(var i=0;i<12;i++){
             dataArray=[];
             dataArray.push(monthArray[i]);
             dataArray.push(0); 
             defaultValueArray.push(dataArray);
         }


         let barChartJson;
         let userData  = await  Dashboard.aggregate([ 
            {$match :{ userName :user,paymentYear : year}},
            {$group : {_id  :"$paymentMonth",count:{$sum:1},totalAmount :{$sum :"$amount"}}}
            ,{$sort: {_id:1}},
            {$project: {_id:0,month :"$_id" ,totalAmount:1}}
            ])

            /* console.log(userData); */
            if(userData.length>0){
               /* Settung actual values return from db */
                userData.forEach(element => {
                    defaultValueArray[(element.month)-1][1]=element.totalAmount; 
                  });
            }


            barChartJson={
                text : 'User Monthly Data for Current Year',
                data : defaultValueArray
            }

        res.send({ status: "success",type :'BarChart', message: "dashboard barchart", data : barChartJson })

    } catch (error) {
        return res.status(400).send({ status: 'fail', message: 'something went wrong  ' + error.message });
    }
})




module.exports = router
