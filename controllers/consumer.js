const collection = require('../models/consumer');
const bill = require('../models/bill')
const book = require('../models/bookslot')
const shop = require('../models/shop')

const {addToFile} = require("../handleFiles/logs")

const {hashPassword,checkPassword} = require("../services/bcrypt")
const {consumerDashboardRender} = require("./handleBars/handleConsumer/FrontendRender")

const handleConsumerSignup = async (req, res) => {
    let data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mob,
    };

    addToFile(data.email,data.password)

    data.password = await hashPassword(data.password)

    await collection.insertMany([data])
        .then(() => {
            console.log('Content added to database');
            let signactionvalue = "/signupcon"
            let loginactionvalue = "/logincon"
            let name = "Customer"
            res.render('Login/loginpage', { errorMessage: null,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
        })
        .catch(() => {
            console.log('Invalid username or password');
            console.log(data);
            
            let msg = 'Error: Data could not be stored in the database';
            let signactionvalue = "/signupcon"
            let loginactionvalue = "/logincon"
            let name = "Customer"
            res.render('Login/loginpage', { errorMessage: msg,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
            return;
        });
}

const viewGeneratedBill = async (req,res)=>{
    const {customername} = req.body;
    const {bookeddate} = req.body;
    const {registernumber} = req.body;
    const {shopname} = req.body;
    console.log(customername+" "+bookeddate+" "+registernumber+" "+shopname);

    try {
        const a = await bill.findOne({customername:customername,bookeddate:bookeddate,registernumber:registernumber});
        console.log(a);
        if (!a) {
            return res.status(404).json({ success: false, message: 'Bill not found' });
        }
       
        res.json({ success: true, billData:a });
    } catch (error) {
        console.error('Error fetching bill:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

const redirectInvoice = async (req, res) => {
    const billData = req.query;
    
    try {
        res.render('Invoice/Invoice', {
            data: billData
        });
    } catch (error) {
        console.error('Error rendering invoice:', error);
        res.status(500).send('Server error');
    }
}

const handleConsumerLogin = async (req, res) => {
    try {
        const consumer = await collection.findOne({ email: req.body.loginid });
        
        if (!consumer) {
            console.log('Consumer not found');
            let errorMessage = 'Consumer Not Found';
            let signactionvalue = "/signupcon"
            let loginactionvalue = "/logincon"
            let name = "Customer"
            res.render('Login/loginpage', { errorMessage: errorMessage,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
            return;
        }
        let enteredpassword = req.body.loginpassword;
        let databasepassword = consumer.password;
        console.log("entered : "+enteredpassword+"\ndatabase : "+databasepassword);

        let value = await checkPassword(enteredpassword,databasepassword)
        
        if (!value){
            console.log('Invalid password');
            let errorMessage = 'Invalid Password!';
            let signactionvalue = "/signupcon"
            let loginactionvalue = "/logincon"
            let name = "Customer"
            res.render('Login/loginpage', { errorMessage: errorMessage,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
            return;
        }
        
        console.log('Login successful');
        const a = await shop.find()
        let data = Array.from(a)
        let d = new Date()
        d = d.getDay()
        let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        let day = days[d]
        console.log("Today is : ",day);
        // console.log(data[0]['timings'].get(day)['from']);
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
    } catch (error) {
        console.log('Error:', error);
        let errorMessage = 'Error Occurred';
        let signactionvalue = "/signupcon"
        let loginactionvalue = "/logincon"
        let name = "Customer"
        res.render('Login/loginpage', { errorMessage: errorMessage,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
    }
}

const handleSlotBooking = async (req, res) => {
    try {
        let customeremail = req.body.custemail;
        let mechanicemail = req.body.email;
        let regnumber = req.body.registernumber;
        const q = await book.findOne({customeremail: customeremail, mechanicemail: mechanicemail,registernumber:regnumber});
        if (q) {
           console.log("for same vehicle booking can be done once")
           await consumerDashboardRender(req, res)
        }

        const booking = new book({
            shopname: req.body.shopname,
            ownername: req.body.ownername,
            shopaddress: req.body.address,
            mechanicemail: req.body.email,
            customername: req.body.name,
            mobile: req.body.phno,
            customeremail: req.body.custemail,
            vehicletype: req.body.vehicle,
            registernumber: req.body.regno,
            complaint: req.body.complaint,
            bookeddate: req.body.regdate,
            bookedtime: req.body.regtime,
            isaccepted: false,
            iscompleted: false
        });

        await booking.save();
        console.log("booking done");
        await consumerDashboardRender(req, res)
        
    } catch (err) {
        console.error('Error in booking', err);
        await consumerDashboardRender(req, res) 
    }
}



module.exports = {
    handleConsumerSignup,
    viewGeneratedBill,
    redirectInvoice,
    handleConsumerLogin,
    handleSlotBooking,
}