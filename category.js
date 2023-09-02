const con = require('../../config/connection');
const categoryModel = {}

categoryModel.selectData=(fieldname, tableName, where)=>{
    return new Promise((resolve,reject)=>{
        console.log(`SELECT ${fieldname} FROM ${tableName} ${where}`);
        con.query(`SELECT ${fieldname} FROM ${tableName} ${where}`,(err, result)=>{
            if(err) reject(err)
            resolve(result);
        });
    });
}

categoryModel.getTaxDataBySearch=(where)=>{
    return new Promise((resolve,reject)=>{
        con.query(`select t.id, t.tax_percentage, t.status, c.title from hd_tax as t left join hd_category as c ON c.id = t.category_id ${where}`,(err, result)=>{
            if(err) reject(err)
            resolve(result);
        });
    });
}

categoryModel.getProductData=(where)=>{
    return new Promise((resolve,reject)=>{
        con.query(`select pm.product_name, pm.category, pm.sub_category, p.id, p.description, p.shipping_policy , p.expected_delivery_in_days from hd_products as p left join hd_product_manufacturer as pm on pm.id = p.manuf_id ${where}`,(err, result)=>{
            if(err) reject(err)
            resolve(result);
        });
    });
}

module.exports=categoryModel