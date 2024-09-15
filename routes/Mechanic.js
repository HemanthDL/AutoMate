const express = require('express');

const {handleMechanicSignup,
    handleComplaint,
    handleUpdate,
    handleBillPaid,
    handleIsComplete,
    handleMechanicLogin,
    handleGenerateBill,
    handleShopEntry} = require("../controllers/mechanic")

const router = express.Router();

router.get('/loginmech', (req, res) => {
    res.render('Frontend/mechanic_dashboard');
})
router.get('/generatebill', (req, res) => {
    res.render('Bill/Bill');
});
router.get('/mechreg',(req,res)=>{
    res.render('Mechanic_register/mechreg')
})


router.post('/signupmech',handleMechanicSignup);
router.post('/get-complaint',handleComplaint);
router.post('/update-customer',handleUpdate);
router.post('/bill-paid',handleBillPaid);
router.post('/iscomplete-customer',handleIsComplete)
router.post('/loginmech',handleMechanicLogin);
router.post('/storebill',handleGenerateBill);
router.post('/mechreg',handleShopEntry);


module.exports = router;