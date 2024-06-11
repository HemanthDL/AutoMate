const express = require('express');
const router = express.Router();
const collection = require('../models/mechanic');
const bcrypt = require('bcrypt')

router.post('/signupmech', async (req, res) => {
    const data = {
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
            res.render('Mechanic_register/mechreg',{
                ownername : req.body.username,
                email : req.body.email,
                mobile : req.body.mob
            });
        })
        .catch(() => {
            console.log('Invalid username or password');
            let msg = 'Error: Data could not be stored in the database';
            let signactionvalue = "/signupmech"
            let loginactionvalue = "/loginmech"
            let name = "Mechanic"
            res.render('loginpage', { errorMessage: msg,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
            return;
        });
});


module.exports = router;