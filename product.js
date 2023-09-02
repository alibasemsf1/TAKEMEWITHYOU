const con = require('../../config/connection');
const productModel = {}


productModel.selectData=(where)=>{ 
    return new Promise((resolve,reject)=>{
        con.query(`select pm.product_name as name, p.id as product_id, c.title as title, pv.id as variation_id, pv.primary_image as image, pv.selling_price, pv.offers, pv.offer_price, pv.in_stock, pv.activity, u.name as unit, mv.variation, o.id as order_id from hd_product_manufacturer as pm LEFT JOIN hd_category as c ON c.id = pm.category LEFT JOIN hd_products as p ON p.manuf_id = pm.id LEFT JOIN hd_product_variation as pv ON pv.product_id = p.id LEFT JOIN hd_manuf_variation as mv ON mv.id = pv.mv_id LEFT JOIN hd_units as u ON u.id = mv.unit LEFT JOIN hd_sub_category as sc ON sc.id = pm.sub_category LEFT JOIN hd_order_products as o ON o.product_id = p.id ${where}`,(err, result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
}


productModel.adminGetProduct=(condition)=>{ 
    return new Promise((resolve,reject)=>{
        con.query(`select p.id, p.manuf_id, p.description, p.shipping_policy, p.status, pm.product_name, c.title as category, sc.title as sub_category from hd_products as p left join hd_product_manufacturer as pm on pm.id = p.manuf_id left join hd_category as c on c.id = pm.category left join hd_sub_category as sc on sc.id = pm.sub_category ${condition}`,(err, result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
}

productModel.productManufacturerSearch=(condition)=>{ 
    return new Promise((resolve,reject)=>{
        con.query(`select pm.id, ag.name as agency_name, pm.product_name, pm.createdAt, mv.id as mv_id, mv.variation, mv.purchasing_price, mv.quantity, c.title as categoryName, sc.title as subCatName, u.name as unit from hd_product_manufacturer as pm left join hd_agency as ag ON ag.id = pm.agency_id left join hd_category as c ON c.id = pm.category left join hd_manuf_variation as mv ON mv.manuf_id = pm.id left Join hd_product_variation as pv ON pv.mv_id = mv.id left join hd_sub_category as sc ON sc.id = pm.sub_category left join hd_units as u ON u.id = mv.unit ${condition}`,(err, result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
}

productModel.productStockSearch=(condition)=>{ 
    return new Promise((resolve,reject)=>{
        con.query(`select pm.id, ag.name as agency_name, pm.product_name, mv.low_quantity, mv.updatedAt, mv.id as mv_id, mv.variation, mv.purchasing_price, mv.quantity, c.title as categoryName, sc.title as subCatName, u.name as unit, pv.in_stock, pv.sales from hd_product_manufacturer as pm left join hd_agency as ag ON ag.id = pm.agency_id left join hd_category as c ON c.id = pm.category left join hd_manuf_variation as mv ON mv.manuf_id = pm.id left Join hd_product_variation as pv ON pv.mv_id = mv.id left join hd_sub_category as sc ON sc.id = pm.sub_category left join hd_units as u ON u.id = mv.unit ${condition}`,(err, result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
}

productModel.manufProductFind=(condition)=>{ 
    return new Promise((resolve,reject)=>{
        con.query(`select pm.id, pm.agency_id, pm.product_name, pm.category, pm.sub_category, mv.id as mv_id ,mv.variation, mv.purchasing_price, mv.quantity, mv.unit, mv.low_quantity, mi.invoice_number from hd_product_manufacturer as pm left join hd_manuf_variation as mv ON mv.manuf_id = pm.id left join hd_manuf_invoice as mi ON mi.manuf_id = pm.id ${condition}`,(err, result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
}

productModel.findVariationWithProduct=(condition)=>{ 
    return new Promise((resolve,reject)=>{
        con.query(`select p.id as product_id, mv.id as mv_id, mv.variation, mv.unit, mv.purchasing_price, mv.quantity, mv.manuf_id, pv.primary_image, pv.id as variation_id, pv.image, pv.selling_price, pv.total_quantity, pv.offers, pv.offer_price, pv.expire_offers, pv.activity, pm.category, tax.tax_percentage from hd_products as p left join hd_manuf_variation as mv on mv.manuf_id = p.manuf_id left join hd_product_variation as pv on pv.mv_id = mv.id left join hd_product_manufacturer as pm on pm.id = p.manuf_id left join hd_tax as tax on tax.category_id = pm.category ${condition}`,(err, result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
}

productModel.getProductRatingWithDetails=(condition)=>{
    return new Promise((resolve, reject)=>{
        con.query(`SELECT r.id, r.rating, r.status, c.fname, c.lname, c.email, pm.product_name, a.name FROM hd_product_rating AS r LEFT JOIN hd_customers AS c ON c.id = r.customer_id LEFT JOIN hd_products AS p ON p.id = r.product_id 
        LEFT JOIN hd_product_manufacturer AS pm ON pm.id = p.manuf_id LEFT JOIN hd_agency AS a ON a.id = pm.agency_id ${condition}`,(err,result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
}

module.exports=productModel
