const express = require('express');
const loginrouter = require('./routes/logincon');
const path = require('path');
const conn = require('./connection')
const signuprouter = require("./routes/signupcon")
const signupmech = require("./routes/signupmech")
const loginmech = require("./routes/loginmech")
const shopadd = require("./routes/shopadd")
const booking = require('./routes/slotbooking')
const bill = require('./routes/billbymech')

// const collection = require('./models/consumer')


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'templates')));



app.get('/', (req, res) => {
    res.render('Homepage/homepage');
});

app.get('/con', (req, res) => {
    let signactionvalue = "/signupcon"
    let loginactionvalue = "/logincon"
    let name = "Customer"
    res.render('loginpage', { errorMessage: null,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
});
app.get('/mech',(req,res)=>{
    let signactionvalue = "/signupmech"
    let loginactionvalue = "/loginmech"
    let name = "Mechanic"
    res.render('loginpage', { errorMessage: null,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
})

app.use(loginrouter)
app.use(signuprouter)
app.use(signupmech)
app.use(loginmech)
app.use(shopadd)
app.use(booking)
app.use(bill)



app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
