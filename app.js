const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const conn = require('./connection')

const ConsumerRouter = require("./routes/Consumer")
const MechanicRouter = require("./routes/Mechanic")

// const collection = require('./models/consumer')


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));
app.use(bodyParser.json());
app.use(express.json())

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'templates')));



app.get('/', (req, res) => {
    res.render('Homepage/homepage');
});

app.get('/con', (req, res) => {
    let signactionvalue = "/signupcon"
    let loginactionvalue = "/logincon"
    let name = "Customer"
    res.render('Login/loginpage', { errorMessage: null,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
});
app.get('/mech',(req,res)=>{
    let signactionvalue = "/signupmech"
    let loginactionvalue = "/loginmech"
    let name = "Mechanic"
    res.render('Login/loginpage', { errorMessage: null,signactionvalue:signactionvalue,loginactionvalue:loginactionvalue,asname:name });
})


app.use(ConsumerRouter)
app.use(MechanicRouter)



app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
