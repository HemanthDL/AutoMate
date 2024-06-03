const express = require('express')
const router = express.Router()
const collection = require('./models/consumer')
const shop = require('./models/shop')


router.get('/logincon',(req,res)=>{
    res.render('Frontend/Dashboard');
})

router.post('/logincon', async (req, res) => {
    try {
        const consumer = await collection.findOne({ email: req.body.loginid });

        if (!consumer) {
            console.log('Consumer not found');
            let errorMessage = 'Consumer Not Found';
            let signactionvalue = "/signupcon"
            let loginactionvalue = "/logincon"
            let name = "Customer"
            res.render('loginpage', { errorMessage: errorMessage,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
            return;
        }

        if (consumer.password === req.body.loginpassword) {
            console.log('Login successful');
            const a = await shop.find()
            let data = Array.from(a)
            let d = new Date()
            d = d.getDay()
            let days = ['Sunday','Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday']
            let day = days[d]
            console.log(day);
            res.render('Frontend/Dashboard',{data:data , day : day})
            // res.send("<script>alert('Login successful'); window.location.href = '/';</script>");
            return;
        } else {
            console.log('Invalid password');
            let errorMessage = 'Invalid Password!';
            let signactionvalue = "/signupcon"
            let loginactionvalue = "/logincon"
            let name = "Customer"
            res.render('loginpage', { errorMessage: errorMessage,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
            return;
        }
    } catch (error) {
        console.log('Error:', error);
        let errorMessage = 'Error Occurred';
        let signactionvalue = "/signupcon"
        let loginactionvalue = "/logincon"
        let name = "Customer"
        res.render('loginpage', { errorMessage: errorMessage,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
    }
});

module.exports = router;