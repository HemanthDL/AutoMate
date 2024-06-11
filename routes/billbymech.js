const express = require('express');
const bodyParser = require('body-parser');

const book = require('../models/bookslot');
const bill = require('../models/bill');
const mech = require('../models/mechanic');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/generatebill', (req, res) => {
    res.render('Bill/Bill');
});

router.post('/storebill', async (req, res) => {
    let regnumber = req.body.registerNumber;
    let mechnum = req.body.mechanicphno;
    const consumer = await mech.findOne({ mobile: mechnum });
    console.log(consumer);

    try {
        const q = await bill.findOne({ registernumber: regnumber });
        if (q) {
            console.log("Bill already generated for this registration number");
            let arr = ['Requests', 'Pending', 'Completed'];
            let a = await book.find({ mechanicemail: consumer.email, isaccepted: false });
            let data = Array.from(a);
            console.log(data);

            let b = await book.find({ mechanicemail: consumer.email, iscompleted: false, isaccepted: true });
            let second = Array.from(b);

            let c = await book.find({ mechanicemail: consumer.email, iscompleted: true });
            let third = Array.from(c);

            res.render('./Frontend/mechanic_dashboard', {
                data: data,
                second: second,
                third: third,
                name: consumer.username,
                dashboardname: "Mechanic",
                phno: consumer.mobile,
                conmail: consumer.email,
                mechanicnumber: consumer.mobile,
                arr: arr,
                complaint:null
            });
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
        let arr = ['Requests', 'Pending', 'Completed'];
        let a = await book.find({ mechanicemail: consumer.email, isaccepted: false });
        console.log("a");
        let data = Array.from(a);
        console.log("data : ",data);

        let b = await book.find({ mechanicemail: consumer.email, iscompleted: false, isaccepted: true });
        let second = Array.from(b);
        console.log("second : ",second);

        let c = await book.find({ mechanicemail: consumer.email, iscompleted: true });
        let third = Array.from(c);
        console.log("third : ",third);

        res.render('./Frontend/mechanic_dashboard', {
            data: data,
            second: second,
            third: third,
            name: consumer.username,
            dashboardname: "Mechanic",
            phno: consumer.mobile,
            conmail: consumer.email,
            mechanicnumber: consumer.mobile,
            arr: arr,
            complaint:null
        });
    } catch (err) {
        console.error('Error in booking', err);

        let arr = ['Requests', 'Pending', 'Completed'];
        console.log(consumer.email);
        let a = await book.find({ mechanicemail: consumer.email, isaccepted: false });
        let data = Array.from(a);
        console.log(data);

        let b = await book.find({ mechanicemail: consumer.email, iscompleted: false, isaccepted: true });
        let second = Array.from(b);

        let c = await book.find({ mechanicemail: consumer.email, iscompleted: true });
        let third = Array.from(c);

        res.render('./Frontend/mechanic_dashboard', {
            data: data,
            second: second,
            third: third,
            name: consumer.username,
            dashboardname: "Mechanic",
            phno: consumer.mobile,
            conmail: consumer.email,
            mechanicnumber: consumer.mobile,
            arr: arr,
            complaint:null
        });
    }
});

module.exports = router;
