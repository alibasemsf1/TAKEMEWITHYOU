const con = require('../../config/connection');
const orderModel = {}

orderModel.adminGetOrderDetails=(condition)=>{
    return new Promise((resolve,reject)=>{
        con.query(`select o.id, o.order_id, o.status, o.createdAt, trans.amount, trans.currency, trans.payment_method, trans.paid,c.fname, c.lname from hd_orders as o left join hd_transactions as trans on trans.order_id = o.order_id left join hd_order_products as op on op.order_id = o.id left join hd_customers as c on c.id = o.customer_id ${condition}`,(err, result)=>{
            if(err) reject(err)
            resolve(result);
        });
    });
}

orderModel.customerOrderDetail=(condition)=>{
    return new Promise((resolve,reject)=>{
        con.query(`select op.id, op.order_id, t.tracking_id, os.json, c.fname, c.lname, c.phone from hd_order_products as op left join hd_orders as o ON o.id = op.order_id left join hd_tracking as t ON t.op_id = op.id left join hd_order_status as os ON os.op_id = op.id left join hd_customers as c ON c.id = o.customer_id where o.id = ${condition.id} `,(err, result)=>{
            if(err) reject(err)
            resolve(result);
        });
    });
}
module.exports=orderModel