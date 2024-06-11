const mon = require('mongoose')




const billschema = new mon.Schema({
    customername : {
        type : String,
        required : true
    },
    customernumber : {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    },
    vehicletype : {
        type : String,
        required : true
    },
    registernumber : {
        type : String,
        required : true,
        unique : true
    },
    bookeddate : {
        type : String,
        required : true
    },
    itemdesc : {
        type : String,
        required : true
    },
    mechanicnumber : {
        type : String,
        required : true
    },
    totalamount : {
        type : String,
        required : true
    },
    shopname : {
        type:String,
        required : true
    }
})

const bill = mon.model('bill',billschema);

module.exports = bill;