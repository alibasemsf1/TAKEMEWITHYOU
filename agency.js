const con = require('../../config/connection');
const agencyModel = {}

agencyModel.selectData=(condition)=>{
    return new Promise((resolve,reject)=>{
        con.query(`SELECT a.id, a.name, sum(mi.total_purchase_amount) as total_purchase_amount, sum(mi.due_amount) as due_amount FROM hd_agency as a left join hd_manuf_invoice as mi ON mi.agency_id = a.id ${condition}`,(err, result)=>{
            if(err) reject(err)
            resolve(result);
        });
    });
}

module.exports=agencyModel