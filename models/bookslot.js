const mon = require('mongoose')


const slotschema = new mon.Schema({
    shopname : {
        type : String,
        required : true
    },
    ownername : {
        type : String,
        required : true
    },
    shopaddress:{
        type : String,
        required : true
    },
    mechanicemail : {
        type : String,
        required : true,
    },
    customername : {
        type : String,
        required : true
    },
    mobile: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    },
    customeremail : {
        type : String,
        required : true
    },
    vehicletype : [{
        type : String,
        enum : ['Bike','Car']
    }],
    registernumber : {
        type : String,
        required : true
    },
    complaint : {
        type : String,
        required : true
    },
    bookeddate : {
        type : String,
        required : true
    },
    bookedtime : {
        type : String,
        required : true
    },
    isaccepted : {
        type : Boolean,
        required : true
    },
    iscompleted : {
        type : Boolean,
        required : true
    }
});


slotschema.index({ customeremail: 1, mechanicemail: 1 }, { unique: true });

const book = mon.model('bookslot', slotschema);

module.exports = book;
