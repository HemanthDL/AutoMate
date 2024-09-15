const express = require('express');

const {handleConsumerSignup,
    viewGeneratedBill,
    redirectInvoice,
    handleConsumerLogin,
    handleSlotBooking} = require("../controllers/consumer")

const router = express.Router();


router.get('/logincon',(req,res)=>{
    res.render('Frontend/Dashboard');
})
router.get('/booking', (req, res) => {
    res.render('BookForm/BookForm');
})
router.post('/signupcon',handleConsumerSignup);
router.post('/view-generatedbill',viewGeneratedBill)
router.get('/invoice',redirectInvoice);
router.post('/logincon',handleConsumerLogin);
router.post('/bookslot',handleSlotBooking)


module.exports = router;