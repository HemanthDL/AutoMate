const mon = require('mongoose')



const shopschema = new mon.Schema({
    shopname : {
        type : String,
        required : true
    },
    ownername : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    desc: {
        type: String
    },
    serviceAvailable: [{
        type: String,
        enum: ['Bike', 'Car']
    }],
    address: {
        type: String
    },
    timings: {
        type: Map,
        of: {
            from: String,
            to: String,
            notavailable: Boolean
        }
    },
    phnum: {
        type: String,
        required: true
    }
},{timestamps:true})

const mp = mon.model('shop',shopschema)

module.exports = mp