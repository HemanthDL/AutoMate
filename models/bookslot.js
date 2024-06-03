const mon = require('mongoose')

const slotschema = new mon.Schema({

})

const book = mon.model('bookslot',slotschema)

module.exports = book