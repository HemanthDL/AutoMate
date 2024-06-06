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
           const b = await book.find({customeremail:customeremail,iscompleted : false});
           let second = Array.from(b);

           const c = await book.find({customeremail:customeremail,isaccepted : true})
           let third = Array.from(c);
           console.log(third);

           res.render('Frontend/Dashboard',{
               data:data ,
               day : day , 
               name : req.body.name,
               dashboardname : "Customer",
               phno :req.body.phno,
               conmail:req.body.custemail, 
               arr:arr,
               second : second,
               third : third
           });
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
        const b = await book.find({customeremail : customeremail,iscompleted : false});
        let second = Array.from(b);

        const c = await book.find({customeremail : customeremail,isaccepted : true})
        let third = Array.from(c);
        console.log(third);

        res.render('Frontend/Dashboard',{
            data:data ,
            day : day , 
            name : req.body.name,
            dashboardname : "Customer",
            phno :req.body.phno,
            conmail:req.body.custemail, 
            arr:arr,
            second : second,
            third : third
        });
    } catch (err) {
        console.error('Error in booking', err);
        
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
            const b = await book.find({customeremail:req.body.custemail,iscompleted : false});
            let second = Array.from(b);

            const c = await book.find({customeremail:req.body.custemail,isaccepted : true})
            let third = Array.from(c);
            console.log(third);

            res.render('Frontend/Dashboard',{
               data:data ,
               day : day , 
               name : req.body.name,
               dashboardname : "Customer",
               phno :req.body.phno,
               conmail:req.body.custemail, 
               arr:arr,
               second : second,
               third : third
           });
    }
})

module.exports = router;