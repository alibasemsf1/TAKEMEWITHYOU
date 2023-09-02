const con = require('../../config/connection');
const customerModel = {}

customerModel.selectData=(condition)=>{
    return new Promise((resolve,reject)=>{
        con.query(`select c.id, c.fname, c.lname, c.email, c.phone, ca.house_no, ca.street_address, ca.city, ca.state, ca.country, ca.pincode from hd_customers as c LEFT JOIN hd_customer_address as ca ON ca.customer_id = c.id ${condition}`,(err, result)=>{
            if(err) reject(err)
            resolve(result);
        });
    });
}

customerModel.getQueryData=(condition)=>{
    return new Promise((resolve,reject)=>{
        con.query(`select id, fname, lname, email, phone, message, replied, createdAt from hd_customer_query ${condition}`,(err, result)=>{
            if(err) reject(err)
            resolve(result);
        });
    });
}

module.exports=customerModel