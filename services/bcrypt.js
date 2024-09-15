const bcrypt = require('bcrypt')


const hashPassword = async(password)=>{

    const saltround = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(password,saltround);
    return hash_password
}

const checkPassword = async(enteredpassword,databasepassword)=>{
    return await bcrypt.compare(enteredpassword,databasepassword);
}

module.exports = {
    hashPassword,
    checkPassword,
}