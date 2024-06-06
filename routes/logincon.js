const express = require('express')
const router = express.Router()
const collection = require('../models/consumer')
const book = require('../models/bookslot')
const shop = require('../models/shop')


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
            let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
            let day = days[d]
            console.log("Today is : ",day);
            console.log(data[0]['timings'].get(day)['from']);
            let arr = ['Shop List','Pending','Bill'];

            //for board 2
            const b = await book.find({customeremail:consumer.email,iscompleted : false});
            let second = Array.from(b);

            const c = await book.find({customeremail:consumer.email,isaccepted : true})
            let third = Array.from(c);
            console.log(third);

            res.render('Frontend/Dashboard',{
                data:data ,
                day : day , 
                name : consumer.username,
                dashboardname : "Customer",
                phno :consumer.mobile,
                conmail:consumer.email, 
                arr:arr,
                second : second,
                third : third
            });
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