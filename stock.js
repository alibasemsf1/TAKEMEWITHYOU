// require common folder files.
const commonModel = require('../../common/commonModel');
const tableJson = require('../../common/table.json');
const commonController = require('../../common/commonController');

// require current folder models.
const categoryModel = require('../models/category');
const productModel = require('../models/product');

// require modules.
const moment = require('moment');

var dateTime = new Date();

exports.getStock=async(req,res)=>{
    if(req.session.adminId){
        await commonModel.selectData('id,title',tableJson.category,'').then(async getCategory=>{
            let manufProduct = await categoryModel.selectData('count(id) as totalProduct',tableJson.manufVariation,'');
            let unit = await commonModel.selectData('id,name',tableJson.units,'');
            let agency = await commonModel.selectData('id,name',tableJson.agency,'');
            var seoJson = await commonController.basicSetting('seo_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
            var themeSettingJson = await commonController.themeSetting('theme_settings');

            res.render('admin/views/stock-management',{'stock':manufProduct[0].totalProduct,'unit':unit,'agency':agency,'category':getCategory,'seoJson':seoJson,'themeSettingJson':themeSettingJson,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole,'pathName':'Stock Management'});
        }).catch(err=>{
            res.json({status:false,message:'Roles not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.searchStockData=async(req,res)=>{
    if(req.session.adminId){
        let where ;
        if(req.query.search.value){
            let data = req.query.search.value.split('|');
            let dataFilter = '';
            if(data.length==2){ 
                dataFilter =  `pm.createdAt BETWEEN '${moment(data[0]).format('YYYY-MM-DD 00:00:00')}' AND '${moment(data[1]).format('YYYY-MM-DD 23:59:59')}'`;
            }else if(data.length==3){
                dataFilter =  `pm.agency_id like ${data[data.length-1]}`;
            }else if(data.length==4){
                dataFilter =  `pv.in_stock = mv.low_quantity OR mv.low_quantity >= pv.in_stock`;
            }else{
                dataFilter = `pm.product_name like '%${data[0]}%' OR u.name like '%${data[0]}%' OR mv.variation like '%${data[0]}%' OR mv.purchasing_price like '%${data[0]}%' OR mv.quantity like '%${data[0]}%'`;
            }
            where = `where ${dataFilter} order by pm.id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }else{
            where = `order by pm.id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }
        
        await productModel.productStockSearch(where).then(async allProducts=>{
            let totalProduct = await categoryModel.selectData('count(id) as totalProduct',tableJson.manufVariation,'');
            let array=[], index= (req.query.start==0) ? 1 : parseInt(req.query.start)+1,recordsFiltered;
            for await (let ap of allProducts){
            
                array.push({
                    'index':index,
                    'purchase_date':moment(ap.createdAt).format('DD-MM-YYYY'),
                    'product_name':commonController.entities(ap.product_name),
                    'variation':ap.variation+' '+ap.unit,
                    'purchasing_price':(ap.purchasing_price).toFixed(2),
                    'quantity':ap.quantity,
                    'total_purchase_amount':(ap.purchasing_price*ap.quantity).toFixed(2),
                    'in_stock':ap.in_stock,
                    'low_product_quantity':ap.low_quantity
                });
                index++; 
            }
            if(array.length>0){
                recordsFiltered=totalProduct[0].totalProduct
            }else{
                recordsFiltered=array.length
            }
            res.json({status:true,'data':array, 'recordsTotal':totalProduct[0].totalProduct,'recordsFiltered':recordsFiltered});
        }).catch(err=>{
            res.json({status:false,'error':err,'message':'Tax not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}
