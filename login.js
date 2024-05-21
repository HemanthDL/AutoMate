const express = require('express')
const collection = require("./models/consumer")
const path = require('path');


const app = express()
const port = 3000

app.set("view engine","ejs")
app.set('views', path.join(__dirname, 'templates'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'templates')));
app.use(express.static(path.join(__dirname, 'templates','Homepage')));


app.get('/', (req, res) => {
    res.render('Homepage/homepage');
})

app.get('/con',(req,res)=>{
    res.render('loginpage');
})

app.post('/signupcon', async (req, res) => {
    let data ={
      username : req.body.username,
      email : req.body.email,
      password : req.body.password,
      mobile : req.body.mob
    }
  
    await collection.insertMany([data])
    .then(()=>{
      console.log("content added to database");
      res.render('con');
    })
    .catch(()=>{
      console.log("Invalid username or password");
      const errorMessage = 'Error: Data could not be stored in the database.';
      res.send(`<script>alert('${errorMessage}'); window.location.href = '/signupform';</script>`);
    })
  
    
})


app.post('/loginconsumer', async (req, res) => {
    try {
        const consumer = await collection.findOne({ email: req.body.loginid });
        
        if (!consumer) {
            console.log("Consumer not found");
            res.send(`<script>alert('Consumer not found'); window.location.href = '/';</script>`);
            return;
        }

        if (consumer.password === req.body.loginpassword) {
            console.log("Login successful");
            res.send(`<script>alert('Login successful'); window.location.href = '/';</script>`);
            return;
        } else {
            console.log("Invalid password");
            res.send(`<script>alert('Invalid password'); window.location.href = '/loginpage';</script>`);
            return;
        }
    } catch (error) {
        console.log("Error:", error);
        res.send(`<script>alert('An error occurred'); window.location.href = '/';</script>`);
    }
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})