const con = require('../../config/connection');
const moment = require('moment');
const dashboardModel = {}

dashboardModel.countData=(fieldname, tableName, where)=>{
    return new Promise((resolve,reject)=>{
        con.query(`SELECT ${fieldname} FROM ${tableName} ${where}`,(err, result)=>{
            if(err) reject(err)
            resolve(result);
        });
    });
}

dashboardModel.dateWiseData=(fieldName,tableName,date)=>{
    return new Promise((resolve,reject)=>{ 
        var sql = `SELECT ${fieldName} FROM ${tableName} WHERE status != 0 AND createdAt BETWEEN '${moment(date[0]).format('YYYY-MM-DD 00:00:00')}' AND '${moment(date[1]).format('YYYY-MM-DD 23:59:59')}' GROUP BY date`
        con.query(sql,(err, result)=>{
            if(err) reject(err)
            resolve(result);
        });
    });
}

dashboardModel.monthWiseData=(fieldName,tableName,date)=>{
    return new Promise((resolve,reject)=>{ 
        var sql = `SELECT ${fieldName} FROM ${tableName} WHERE status != 0 AND createdAt BETWEEN '${moment(date[0]).format('YYYY-MM-DD 00:00:00')}' AND '${moment(date[1]).format('YYYY-MM-DD 23:59:59')}' GROUP BY month`
        con.query(sql,(err, result)=>{
            if(err) reject(err)
            resolve(result);
        });
    });
}

dashboardModel.getOrders=(condition)=>{
    return new Promise((resolve,reject)=>{ 
        var sql = `select o.id, o.order_id, o.createdAt, trans.amount, trans.currency, c.fname, c.lname from hd_orders as o 
        left join hd_transactions as trans on trans.order_id = o.order_id left join hd_order_products as op on op.order_id = o.id 
        left join hd_customers as c on c.id = o.customer_id ${condition}`
        con.query(sql,(err, result)=>{
            if(err) reject(err)
            resolve(result);
        });
    });
}

module.exports=dashboardModel