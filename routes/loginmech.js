const express = require('express')
const router = express.Router()
const collection = require('../models/mechanic')
const book = require('../models/bookslot')
const bodyparser = require('body-parser')
const view_desc = require('./view_desc')

router.use(bodyparser.json());



router.post('/update-customer',async(req,res)=>{
    const {customerId} = req.body;
    const {mechanicId} = req.body;
    const {registernumber} = req.body;

    try {
        await book.updateOne({mechanicemail:mechanicId,customeremail:customerId,registernumber:registernumber},{$set:{isaccepted:true}});
        res.status(200).send({ success: true });
        console.log("Succesfully Updated accept button");
        
    } catch (error) {
        console.log("error in updating");
    }

});

router.post('/iscomplete-customer',async(req,res)=>{
    const {customerId} = req.body;
    const {mechanicId} = req.body;
    const {registernumber} = req.body;

    try{
        await book.updateOne({mechanicemail:mechanicId,customeremail:customerId,registernumber:registernumber},{$set:{iscompleted:true}});
        res.status(200).send({success:true});
        console.log("Updated");
    } catch(errro){
        console.log("error in updating");
    }
})


// router.get('/loginmech',(req,res)=>{
//     res.render('Frontend/Dashboard');
// })

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
            let arr = ['Requests','Pending','Completed'];
            console.log(consumer.email);
            let a = await book.find({mechanicemail:consumer.email,isaccepted:false});
            let data = Array.from(a);
            console.log(data);

            let b = await book.find({mechanicemail:consumer.email,iscompleted:false,isaccepted:true});
            let second = Array.from(b);

            let c = await book.find({mechanicemail:consumer.email,iscompleted:true});
            let third = Array.from(c);

            res.render('Frontend/mechanic_dashboard',{
                data:data , 
                second:second,
                third:third,
                name : consumer.username,
                dashboardname : "Mechanic",
                phno :consumer.mobile,
                conmail:consumer.email, 
                mechanicnumber:consumer.mobile,
                arr:arr,
            });
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