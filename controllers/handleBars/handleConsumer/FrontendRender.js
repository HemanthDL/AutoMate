const book = require('../../../models/bookslot')
const shop = require('../../../models/shop')


const consumerDashboardRender = async(req,res)=>{
    const a = await shop.find()
           let data = Array.from(a)
           let d = new Date()
           d = d.getDay()
           let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
           let day = days[d]
           console.log("Today is : ",day);
           console.log(data[0]['timings'].get(day)['from']);
           let arr = ['Shop List','Pending','Bill'];

           //for board 2
           const b = await book.find({customeremail:req.body.custemail,iscompleted : false});
           let second = Array.from(b);

           const c = await book.find({customeremail:req.body.custemail,isaccepted : true})
           let third = Array.from(c);
           console.log(third);

           res.render('Frontend/Dashboard',{
               data:data ,
               day : day , 
               name : req.body.name,
               dashboardname : "Customer",
               phno :req.body.phno,
               conmail:req.body.custemail, 
               arr:arr,
               second : second,
               third : third
           });
}

module.exports = {
    consumerDashboardRender,
}