const express = require('express');

const shop = require('../models/shop');

const router = express.Router()

router.get('/mechreg',(req,res)=>{
    res.render('Mechanic_register/mechreg')
})

router.post('/mechreg', async (req, res) => {
    try {
        const newShop = new shop({
            shopname: req.body.shopname,
            ownername: req.body.ownername,
            email : req.body.email,
            desc: req.body.descaboutshop,
            serviceAvailable: req.body.bike && req.body.car ? ['Bike', 'Car'] : (req.body.bike ? ['Bike'] : (req.body.car ? ['Car'] : [])),
            address: req.body.addr,
            timings: {
                Monday: { from: req.body.Mondayf, to: req.body.Mondayt, notavailable: req.body.notavailableMonday === 'Monday' },
                Tuesday: { from: req.body.Tuesdayf, to: req.body.Tuesdayt, notavailable: req.body.notavailableTuesday === 'Tuesday' },
                Wednesday: { from: req.body.Wednesdayf, to: req.body.Wednesdayt, notavailable: req.body.notavailableWednesday === 'Wednesday' },
                Thursday: { from: req.body.Thursdayf, to: req.body.Thursdayt, notavailable: req.body.notavailableThrusday === 'Thrusday' },
                Friday: { from: req.body.Fridayf, to: req.body.Fridayt, notavailable: req.body.notavailableFriday === 'Friday' },
                Saturday: { from: req.body.Saturdayf, to: req.body.Saturdayt, notavailable: req.body.notavailableSaturday === 'Saturday' },
                Sunday: { from: req.body.Sundayf, to: req.body.Sundayt, notavailable: req.body.notavailableSunday === 'Sunday' }
            },
            phnum: req.body.phnum
        });

        await newShop.save();
        console.log("shop added to database");
        let signactionvalue = "/signupmech"
        let loginactionvalue = "/loginmech"
        let name = "Mechanic"
        res.render('loginpage', { errorMessage: null,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
    } catch (err) {
        console.error('Error registering shop:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router
