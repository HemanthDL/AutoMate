const a = require("./connection");
const mon = require("mongoose");


const conschema = mon.Schema({
    username : {
        type : String,
        require : true
    },
    email : {
        type : String,
        unique : true,
        require : true
    },
    password  : {
        type : String,
        unique : true,
        require : true
    },
    mobile : {
        type : String,
        require : true
    }
});

const p = new mon.model('consumers',conschema);

module.exports = p;