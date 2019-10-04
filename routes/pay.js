const router = require('express').Router();
const verify = require('../verifyToken');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Kolkata')
const PayShare = require('../model/payShare');
const User = require('../model/User')


router.post('/pay', async (req, res) => {

    try {

        /*  console.log(req.body);   */
        const payReqValues = new PayShare({
            userName: req.body.userName,
            amount: req.body.amount,
            paymentDate: req.body.paymentDate,
            status: "pending",
            crtDate: moment(),
            paymentDay: req.body.paymentDay,
            paymentMonth: req.body.paymentMonth,
            paymentYear: req.body.paymentYear,
        })

        const payShare = await payReqValues.save();
        res.send({ status: "success", message: "Pay request process and sent for approval" })

    } catch (error) {
        return res.status(400).send({ status: 'fail', message: 'something went wrong  ' + error.message });
    }
})


router.post('/getPayHistByUser', async (req, res) => {

    try {
        let year = +req.body.year;
        let user = req.body.userName;
        data = [];

        let userData = await PayShare.aggregate([
            { $match: { userName: user, paymentYear: year } },
            { $sort: { paymentMonth: -1, paymentDay: -1 } },
            { $project: { crtIp: 0, paymentDay: 0, paymentMonth: 0, paymentYear: 0, } }
        ])

        /* console.log(userData); */

        res.send({ status: "success", message: "payHistory  user Data ", data: userData })

    } catch (error) {
        return res.status(400).send({ status: 'fail', message: 'something went wrong ohh  ' + error.message });
    }
})


router.post('/getPendingAprovals', async (req, res) => {

    try {
        let eventType = req.body.type;
        let userData = [];


        if (eventType === 'apr') {

            userData = await PayShare.aggregate([
                { $match: { status: 'pending' } },
                { $sort: { paymentMonth: -1, paymentDay: -1 } },
                { $project: { crtIp: 0, paymentDay: 0, paymentMonth: 0, paymentYear: 0, mdyBy: 0, mdyDate: 0, remarks: 0, status: 0 } }
            ])
        } else {
            userData = await User.aggregate([
                { $match: { regStatus: ''} },
                { $sort: { crtDate: -1 } },
                { $project: { crtIp: 0, password: 0,  status: 0, lastLoginDate: 0 } }
            ])
        }

        /* console.log(userData); */

        res.send({ status: "success", message: "data fetched successfully ", data: userData })

    } catch (error) {
        return res.status(400).send({ status: 'fail', message: 'something went wrong   ' + error.message });
    }
})

router.post('/processRequest', async (req, res) => {
    try {
        let respMessage = 'Payment accepted successfully';
        let id = req.body.id;
        let type = req.body.type;
        let status = req.body.status;

        console.log(`request recived with status ${status} and objectId ${id}`);
        if (type === 'apr') {
            if (status === 'rejected'){
                respMessage = 'Payment rejected successfully';
            }else{
                respMessage= 'Payment accepted successfully';
            }
            let user = await PayShare.findOne({ _id: id, status: 'pending' });
            if (user) {
                console.log(`processing user with status ${status} and objectId ${id}`);
                const data = await PayShare.findOneAndUpdate(
                    { _id: id, status: 'pending' }, {
                    $set: {
                        status: status,
                        mdyBy: req.body.mdyBy,
                        mdyDate: moment().toString(),
                        remarks: req.body.remarks,
                    }
                })
                console.log("user  status updated Successfully");
                res.send({ status: "success", message: respMessage })
            } else {
                console.log("No data found");
                res.send({ status: "fail", message: "No data found.Please try again later" })
            }
        } else {

            if (status === 'rejected'){
                respMessage = 'Registration rejected successfully';
            }else{
                respMessage= 'Registration accepted successfully';
            }
            let user = await User.findOne({ _id: id, regStatus: '' });
            if (user) {
                console.log(`processing user with status ${status} and objectId ${id}`);
                const data = await User.findOneAndUpdate(
                    { _id: id, regStatus: '' }, {
                    $set: {
                        regStatus: status,
                        mdyBy: req.body.mdyBy,
                        mdyDate: moment().toString(),
                        remarks: req.body.remarks,
                    }
                })
                console.log("Regisration accepted Successfully");
                res.send({ status: "success", message: respMessage })
            } else {
                console.log("No data found");
                res.send({ status: "fail", message: "No data found.Please try again later" })
            }
        }
    } catch (error) {
        console.log("error occured", error);
        return res.status(400).send({ status: 'fail', message: 'Something went wrong please try again later ' + error.message });
    }
})

module.exports = router
