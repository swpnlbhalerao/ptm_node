
const router = require('express').Router();
const User = require('../model/User')
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Kolkata')

router.post('/register', async (req, res) => {
    /* console.log(req.body); */

    //validate user details
    const { error } = registerValidation(req.body);

    if (error)
        return res.status(400).send({ statsus: 'fail', message: error.details[0].message });

    //check duplicate email
    const checkEmail = await User.findOne({ email: req.body.email });

    if (checkEmail) {
        return res.status(400).send({ status: 'exist', message: 'Email already exist' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    //create user 
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        phone: req.body.phone,
        password: hashPassword,
        crtDate: moment(),
        lastLoginDate: null

    });
    try {
        const savedUser = await newUser.save();
        res.send({ user: savedUser.userName, status: 'success', message: 'user register successfully ' });
    } catch (err) {
        res.status(400).send(err)
        return res.status(400).send({ status: 'fail', message: 'something went wrong  ' + err.message });

    }

});


router.post('/login', async (req, res) => {
   /*  console.log(req.body); */

    const { error } = loginValidation(req.body)

    if (error)
        return res.status(400).send({ statsus: 'fail', message: error.details[0].message });

    //check duplicate email
    let user = await User.findOne({ email: req.body.userName });
    if (!user) {
        user = await User.findOne({ userName: req.body.userName });
    }

    if (!user) {
        return res.status(400).send({ status: 'fail', message: 'user name doesnt exist' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
        return res.status(400).send({ status: 'fail', message: 'password doesnt exist' });
    }

    //update last login
    User.findOneAndUpdate({ _id: user._id }, {
        $set: {
            curr_login_date: moment(),
            lastLoginDate: user.curr_login_date
        }
    }).then((data) => {
       /*  console.log(data) */
    }).catch((err) => {
       /*  console.log(err) */
    })


    const signatureToken = await jwt.sign({ _id: user._id }, process.env.Secret_Token);
    res.header({ 'auth-token': signatureToken, expiresIn: 600 }).send({ status: 'success', message: 'login success full',userInfo: user ,'authtoken': signatureToken, expiresIn: 600 });

});

router.post('/getUserInfo', async (req, res) => {
   /*  console.log(req.body); */
   
    //const { error } = loginValidation(req.body)
    try {
        if (req.body.userName) {

            let user = await User.findOne({ email: req.body.userName });
            if (!user) {
                user = await User.findOne({ userName: req.body.userName });
            }

            if (!user) {
                return res.status(400).send({ status: 'fail', message: 'user name doesnt exist' });
            } else {
                res.send({ user: user, status: 'success', message: 'user details processed' });
            }

        } else {
            return res.status(400).send({ statsus: 'fail', message: "empty request body " + req.body.userName });
        }
    } catch (error) {
        return res.status(400).send({ statsus: 'fail', message: "something went wrong " + error.message });
    }
});


module.exports = router;