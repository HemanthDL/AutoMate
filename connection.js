// const mon = require('mongoose');


// const a = mon.connect("mongodb://localhost:27017/AutoMate")
// .then(()=>{
//     console.log("database connected");
// })
// .catch(()=>{
//     console.log("failed to connect");
// })

// module.exports = a;


require('dotenv').config();
const mongoose = require('mongoose')
const connectDB = async ()=> {
try {
    const connectionInstance = await mongoose.connect(process.env.URI, {
        useNewUrlParser: true,
        autoIndex: true,
      });      
    console.log("\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}");
    } 
    catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1)
    }
}

module.exports = connectDB

connectDB();