const orderModel = require("../models/order")
const agencyModel = require("../models/agency");
const categoryModel = require("../models/category");
const productModel = require("../models/product");

const moment = require("moment");
var date = new Date();

exports.getAllOrderData=async(req,res)=>{
    let query 
    if(req.body.type=='today'){
        query = `where o.createdAt between '${moment(date).format('YYYY-MM-DD 00:00:00')}' AND '${moment(date).format('YYYY-MM-DD 23:59:59')}' AND trans.status != 0 group by o.id order by o.id DESC`;
    }else if(req.body.type=='all_order'){
        query = `where trans.status != 0 group by o.id order by o.id DESC`;
    }else{
        query = `where op.status=4 AND trans.status != 0 group by o.id order by o.id DESC`;
    }

    await orderModel.adminGetOrderDetails(query).then(async result=>{
        let index=1;
        let tableData = `<table><tr><th>#</th><th>Order Number</th><th>Order Date</th><th>Customer Name</th><th>Amount</th>
        <th>Payment Type</th><th>Status</th></tr>`
        for await(let r of result){
            let st ;
            if(r.status==1){
                st = 'Ordered'
            }else if(r.status==2){
                st = 'Shipped'
            }else if(r.status==3){
                st = 'Dispatched'
            }else{
                st = 'Delivered'
            }
            tableData += `<tr><td>${index}</td><td>${r.order_id}</td><td>${moment(r.createdAt).format('DD-MM-YYYY')}</td><td>${r.fname+' '+r.lname}</td><td>${r.amount+' '+r.currency.toUpperCase()}</td><td>${r.payment_method}</td><td>${st}</td></tr>`;
            index++;
        }
        tableData += '</table>';
        res.json({status:true,'data':tableData})
    }).catch(err=>{
        res.json({status:false,'message':'Data not found'})
    });
}

exports.getAllAgencyData=async(req,res)=>{
    await agencyModel.selectData('group by a.id order by a.id DESC').then(async result=>{
        let index=1;
        let tableData = `<table><tr><th>#</th><th>Agency Name</th><th>Total Purchase Amount</th><th>Total Paid Amount</th><th>Due Amount</th></tr>`
        for await(let r of result){
            let paidAmount = await categoryModel.selectData('sum(total_paid_amount) as total_paid_amount','hd_ledger_details','where agency_id ='+r.id);

            let tpa = (r.total_purchase_amount!=null) ? r.total_purchase_amount : 0;
            let tpaid = (paidAmount[0].total_paid_amount!=null) ? paidAmount[0].total_paid_amount : 0;
            let da = (r.due_amount) ? r.due_amount : 0;
            tableData += `<tr><td>${index}</td><td>${r.name}</td><td>${tpa}</td><td>${tpaid}</td><td>${da-tpaid}</td></tr>`;
            index++;
        }
        tableData += '</table>';
        res.json({status:true,'data':tableData})
    }).catch(err=>{
        res.json({status:false,'message':'Data not found'})
    });
}


exports.getAllStockData=async(req,res)=>{
    await productModel.productStockSearch('order by pm.id DESC').then(async allProducts=>{
        let index=1;
        let tableData = `<table><tr><th>#</th><th>Purchase Date</th><th>Product Name</th><th>Product Variation</th>
        <th>Purchasing Price</th><th>Purchase Quantity</th><th>Total Purchase Amount</th><th>In Stock</th>
        <th>Low Product Quantity</th></tr>`
        for await(let ap of allProducts){
            tableData += `<tr><td>${index}</td><td>${moment(ap.createdAt).format('DD-MM-YYYY')}</td><td>${commonController.entities(ap.product_name)}</td><td>${ap.variation+' '+ap.unit}</td><td>${ap.purchasing_price}</td><td>${ap.quantity}</td><td>${ap.purchasing_price*ap.quantity}</td><td>${ap.in_stock}</td><td>${ap.low_quantity}</td></tr>`;
            index++;
        }
        tableData += '</table>';
        res.json({status:true,'data':tableData})
    }).catch(err=>{
        res.json({status:false,'message':'Data not found'})
    });
}
