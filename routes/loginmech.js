const express = require('express')
const router = express.Router()
const collection = require('../models/mechanic')


router.get('/loginmech',(req,res)=>{
    res.render('Frontend/Dashboard');
})

router.post('/loginmech', async (req, res) => {
    try {
        const consumer = await collection.findOne({ email: req.body.loginid });

        if (!consumer) {
            console.log('Mechanic not found');
            let errorMessage = 'Mechanic Not Found';
            let signactionvalue = "/signupmech"
            let loginactionvalue = "/loginmech"
            let name = "Mechanic"
            res.render('loginpage', { errorMessage: errorMessage,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
            return;
        }

        if (consumer.password === req.body.loginpassword) {
            console.log('Login successful');
            res.render('Frontend/Dashboard',{data:null , day : null , name : consumer.username,dashboardname : "Mechanic"})
            // res.send("<script>alert('Login successful'); window.location.href = '/';</script>");
            return;
        } else {
            console.log('Invalid password');
            let errorMessage = 'Invalid Password!';
            let signactionvalue = "/signupmech"
            let loginactionvalue = "/loginmech"
            let name = "Mechanic"
            res.render('loginpage', { errorMessage: errorMessage,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
            return;
        }
    } catch (error) {
        console.log('Error:', error);
        let errorMessage = 'Error Occurred';
        let signactionvalue = "/signupmech"
        let loginactionvalue = "/loginmech"
        let name = "Mechanic"
        res.render('loginpage', { errorMessage: errorMessage,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });    }
});

module.exports = router;