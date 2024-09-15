const collection = require('../models/mechanic')
const book = require('../models/bookslot')
const bill = require('../models/bill')
const shop = require('../models/shop');

const {addToFile} = require("../handleFiles/logs")

const {hashPassword,checkPassword} = require("../services/bcrypt")
const {MechanicDashboardRender} = require("./handleBars/handleMechanic/Render")



const handleMechanicSignup = async (req, res) => {
    const data = {
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
            res.render('Login/loginpage', { errorMessage: msg,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
            return;
        });
}

const handleMechanicLogin = async (req, res) => {
    try {
        const consumer = await collection.findOne({ email: req.body.loginid });
        
        if (!consumer) {
            console.log('Mechanic not found');
            let errorMessage = 'Mechanic Not Found';
            let signactionvalue = "/signupmech"
            let loginactionvalue = "/loginmech"
            let name = "Mechanic"
            res.render('Login/loginpage', { errorMessage: errorMessage, signactionvalue: signactionvalue, loginactionvalue: loginactionvalue, asname: name });
            return;
        }
        
        let enteredpassword = req.body.loginpassword;
        let databasepassword = consumer.password;
        console.log("entered : " + enteredpassword + "\ndatabase : " + databasepassword);
        
        let value = await checkPassword(enteredpassword,databasepassword)
        
        if (value) {
            console.log('Login successful');
            let arr = ['Requests', 'Pending', 'Completed'];
            console.log(consumer.email);
            let a = await book.find({ mechanicemail: consumer.email, isaccepted: false });
            let data = Array.from(a);
            console.log(data);
            
            let b = await book.find({ mechanicemail: consumer.email, iscompleted: false, isaccepted: true });
            let second = Array.from(b);

            let c = await book.find({ mechanicemail: consumer.email, iscompleted: true });
            let third = Array.from(c);
            
            res.render('Frontend/mechanic_dashboard', {
                data: data,
                second: second,
                third: third,
                name: consumer.username,
                dashboardname: "Mechanic",
                phno: consumer.mobile,
                conmail: consumer.email,
                mechanicnumber: consumer.mobile,
                arr: arr,
                complaint: null
            });
            // res.send("<script>alert('Login successful'); window.location.href = '/';</script>");
            return;
        } else {
            console.log('Invalid password');
            let errorMessage = 'Invalid Password!';
            let signactionvalue = "/signupmech"
            let loginactionvalue = "/loginmech"
            let name = "Mechanic"
            res.render('Login/loginpage', { errorMessage: errorMessage, signactionvalue: signactionvalue, loginactionvalue: loginactionvalue, asname: name });
            return;
        }
    } catch (error) {
        console.log('Error:', error);
        let errorMessage = 'Error Occurred';
        let signactionvalue = "/signupmech"
        let loginactionvalue = "/loginmech"
        let name = "Mechanic"
        return res.render('Login/loginpage', { errorMessage: errorMessage, signactionvalue: signactionvalue, loginactionvalue: loginactionvalue, asname: name });
    }
}

const handleComplaint = async (req, res) => {
    const { customeremail } = req.body;
    const { mechanicemail } = req.body;
    const { registernumber } = req.body;
    console.log(customeremail + " m " + mechanicemail + " r " + registernumber);
    
    try {
        let a = await book.findOne({ customeremail: customeremail, mechanicemail: mechanicemail, registernumber: registernumber });
        console.log("complaint : " + a);
        // if(!a){
        //     res.json({success:false,complaint:null});
        // }
        const complaint = a.complaint;
        return res.json({ success: true, complaint });
    } catch (error) {
        console.error('Error fetching complaint:', error);
        return res.json({ success: false });
    }
}

const handleUpdate = async (req, res) => {
    const { customerId } = req.body;
    const { mechanicId } = req.body;
    const { registernumber } = req.body;
    
    try {
        await book.updateOne({ mechanicemail: mechanicId, customeremail: customerId, registernumber: registernumber }, { $set: { isaccepted: true } });
        console.log("Succesfully Updated accept button");
        return res.status(200).send({ success: true });
        
    } catch (error) {
        console.log("error in updating");
    }
    
}

const handleBillPaid =  async (req, res) => {
    const { customerId } = req.body;
    const { mechanicId } = req.body;
    const { registernumber } = req.body;
    console.log(customerId + " " + mechanicId + " " + registernumber);
    
    try {
        await book.findOneAndDelete({ mechanicemail: mechanicId, customeremail: customerId, registernumber: registernumber });
        await bill.findOneAndDelete({ registernumber: registernumber });
        console.log("Succesfully deleted accept button");
        return res.status(200).send({ success: true });
        
    } catch (error) {
        console.log("error in deleting");
        res.status(404).send({ success: false });
    }
    
}

const handleIsComplete = async (req, res) => {
    const { customerId } = req.body;
    const { mechanicId } = req.body;
    const { registernumber } = req.body;
    
    try {
        await book.updateOne({ mechanicemail: mechanicId, customeremail: customerId, registernumber: registernumber }, { $set: { iscompleted: true } });
        console.log("Updated");
        return res.status(200).send({ success: true });
    } catch (errro) {
        console.log("error in updating");
    }
}

const handleGenerateBill = async (req, res) => {
    let regnumber = req.body.registerNumber;
    let mechnum = req.body.mechanicphno;
    const consumer = await collection.findOne({ mobile: mechnum });
    console.log(consumer);

    try {
        const q = await bill.findOne({ registernumber: regnumber });
        if (q) {
            console.log("Bill already generated for this registration number");
            await MechanicDashboardRender(req,res,consumer)
            return;
        }

        const billing = new bill({
            customername: req.body.customerName,
            customernumber: req.body.customerRole,
            vehicletype: req.body.vehicletype,
            registernumber: req.body.registerNumber,
            bookeddate: req.body.bookeddate,
            itemdesc: req.body.description ,
            mechanicnumber: req.body.mechanicphno,
            totalamount: req.body.totalDue,
            shopname:req.body.shopname
        });

        await billing.save();
        console.log("billing done");
        await MechanicDashboardRender(req,res,consumer)
        
    } catch (err) {
        console.error('Error in booking', err);
        await MechanicDashboardRender(req,res,consumer)
    }
}


const handleShopEntry = async (req, res) => {
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
        res.render('Login/loginpage', { errorMessage: null,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
    } catch (err) {
        console.error('Error registering shop:', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    handleMechanicSignup,
    handleComplaint,
    handleUpdate,
    handleBillPaid,
    handleIsComplete,
    handleMechanicLogin,
    handleGenerateBill,
    handleShopEntry
}