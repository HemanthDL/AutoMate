const express = require('express')
const router = express.Router()
const collection = require('../models/mechanic')
const book = require('../models/bookslot')
const bodyparser = require('body-parser')
const bill = require('../models/bill')
const mechanic = require('../models/mechanic')

router.use(bodyparser.json());


router.post('/get-complaint', async (req, res) => {
    const { customeremail } = req.body;
    const { mechanicemail } = req.body;
    const { registernumber } = req.body;
    console.log(customeremail+" m "+mechanicemail+" r "+registernumber);

    try {
        let a = await book.findOne({customeremail:customeremail,mechanicemail:mechanicemail,registernumber:registernumber});
        console.log("complaint : "+a);
        // if(!a){
        //     res.json({success:false,complaint:null});
        // }
        const complaint = a.complaint;
        res.json({ success: true,complaint});
    } catch (error) {
        console.error('Error fetching complaint:', error);
        res.json({ success: false });
    }
});

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

router.post('/bill-paid',async(req,res)=>{
    const {customerId} = req.body;
    const {mechanicId} = req.body;
    const {registernumber} = req.body;
    console.log(customerId+" "+mechanicId+" "+registernumber);

    try {
        await book.findOneAndDelete({mechanicemail:mechanicId,customeremail:customerId,registernumber:registernumber});
        await bill.findOneAndDelete({registernumber:registernumber});
        res.status(200).send({ success: true });
        console.log("Succesfully deleted accept button");
        
    } catch (error) {
        console.log("error in deleting");
        res.status(404).send({success:false});
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


router.get('/loginmech',(req,res)=>{
    res.render('Frontend/mechanic_dashboard');
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
                complaint:null
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