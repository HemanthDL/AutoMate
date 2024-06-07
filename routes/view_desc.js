const express = require('express')
const router = express.Router()
const bodyparser = require('body-parser')
const book = require('../models/bookslot')

router.use(bodyparser.json());

router.post('/view-desc',async(req,res)=>{
    const {customerId} = req.body;
    const {mechanicId} = req.body;
    const {dateb} = req.body;
    
    try {
        let a = await book.findOne({customeremail:customerId,mechanicemail:mechanicId,bookeddate:dateb});
        let desc = Array.from(a);
        res.status(200).send({data:a[0],success:true});
    } catch (error) {
        console.log("error in view desc");
    }
});



module.exports = router;