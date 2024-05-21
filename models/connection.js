const mon = require('mongoose');


const a = mon.connect("mongodb://localhost:27017/AutoMate")
.then(()=>{
    console.log("database connected");
})
.catch(()=>{
    console.log("failed to connect");
})

module.exports = a;