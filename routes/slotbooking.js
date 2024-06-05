const express = require('express');

const book = require('../models/bookslot');
const shop = require('../models/shop');

const router = express.Router();

router.get('/booking', (req, res) => {
    res.render('BookForm/BookForm');
})

router.post('/bookslot', async (req, res) => {
    try {
        let customeremail = req.body.custemail;
        let mechanicemail = req.body.email;
        const q = await book.findOne({ customeremail: customeremail, mechanicemail: mechanicemail });
        if (q) {
           console.log("for same mechanic booking can be done once")
            const a = await shop.find();
            let data = Array.from(a);
            let d = new Date();
            d = d.getDay();
            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
            let day = days[d];
            console.log(day);

            let arr = ['Shop List', 'Pending', 'Accepted'];
            return res.render('Frontend/Dashboard', { data: data, day: day, name: req.body.name, dashboardname: "Customer", phno: req.body.phno, conmail: customeremail, arr: arr });
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
        const a = await shop.find();
        let data = Array.from(a);
        let d = new Date();
        d = d.getDay();
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
        let day = days[d];
        console.log(day);

        let arr = ['Shop List', 'Pending', 'Accepted'];
        return res.render('Frontend/Dashboard', { data: data, day: day, name: req.body.name, dashboardname: "Customer", phno: req.body.phno, conmail: customeremail, arr: arr });
    } catch (err) {
        console.error('Error in booking', err);
        
        const a = await shop.find();
        let data = Array.from(a);
        let d = new Date();
        d = d.getDay();
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
        let day = days[d];
        console.log(day);

        let arr = ['Shop List', 'Pending', 'Accepted'];
        return res.render('Frontend/Dashboard', { data: data, day: day, name: req.body.name, dashboardname: "Customer", phno: req.body.phno, conmail: req.body.custemail, arr: arr });
    }
})

module.exports = router;