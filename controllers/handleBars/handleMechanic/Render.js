const book = require('../../../models/bookslot')


const MechanicDashboardRender = async(req,res,consumer)=>{
    let arr = ['Requests', 'Pending', 'Completed'];
        let a = await book.find({ mechanicemail: consumer.email, isaccepted: false });
        console.log("a");
        let data = Array.from(a);
        console.log("data : ",data);

        let b = await book.find({ mechanicemail: consumer.email, iscompleted: false, isaccepted: true });
        let second = Array.from(b);
        console.log("second : ",second);

        let c = await book.find({ mechanicemail: consumer.email, iscompleted: true });
        let third = Array.from(c);
        console.log("third : ",third);

        res.render('./Frontend/mechanic_dashboard', {
            data: data,
            second: second,
            third: third,
            name: consumer.username,
            dashboardname: "Mechanic",
            phno: consumer.mobile,
            conmail: consumer.email,
            mechanicnumber: consumer.mobile,
            arr: arr,
            complaint:null
        });
}

module.exports = {
    MechanicDashboardRender
}