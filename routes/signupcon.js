const express = require('express');
const router = express.Router();
const collection = require('../models/consumer');
const bcrypt = require('bcrypt')


router.post('/signupcon', async (req, res) => {
    let data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mob,
    };

    const saltround = await bcrypt.genSalt(10);
    const hass_password = await bcrypt.hash(data.password,saltround);
    data.password = hass_password;

    await collection.insertMany([data])
        .then(() => {
            console.log('Content added to database');
            let signactionvalue = "/signupcon"
            let loginactionvalue = "/logincon"
            let name = "Customer"
            res.render('loginpage', { errorMessage: null,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
        })
        .catch(() => {
            console.log('Invalid username or password');
            let msg = 'Error: Data could not be stored in the database';
            let signactionvalue = "/signupcon"
            let loginactionvalue = "/logincon"
            let name = "Customer"
            res.render('loginpage', { errorMessage: msg,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
            return;
        });
});


module.exports = router;