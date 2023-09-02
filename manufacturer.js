// require common folder files.
const commonModel = require('../../common/commonModel');
const commonController = require('../../common/commonController');
const tableJson = require('../../common/table.json');

// require current folder Models.
const categoryModel = require('../models/category');
const productModel = require('../models/product');

// require modules.
const moment = require('moment');
const { async } = require('node-stream-zip');

var dateTime = new Date();

exports.getMainPage=async(req,res)=>{
    if(req.session.adminId){
        await categoryModel.selectData('id,title',tableJson.category,'where status=1 order by id desc').then(async getCategory=>{
            let manufProduct = await categoryModel.selectData('count(id) as totalProduct',tableJson.manufVariation,'');
            let unit = await categoryModel.selectData('id,name',tableJson.units,'order by id desc');
            let agency = await categoryModel.selectData('id,name',tableJson.agency,'order by id desc');
            var seoJson = await commonController.basicSetting('seo_settings');
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);

            res.render('admin/views/manufacturer',{'manufProduct':manufProduct[0].totalProduct,'unit':unit,'agency':agency,'category':getCategory,'seoJson':seoJson,'themeSettingJson':themeSettingJson,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole, 'pathName':'Add Products'});
        }).catch(err=>{
            res.json({status:false,message:'Roles not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.searchProductManuf=async(req,res)=>{
    if(req.session.adminId){
        let where ;
        if(req.query.search.value){
            let data = req.query.search.value.split('|');
            let dataFilter = '';
            if(data.length==2){ 
                dataFilter =  `pm.createdAt BETWEEN '${moment(data[0]).format('YYYY-MM-DD 00:00:00')}' AND '${moment(data[1]).format('YYYY-MM-DD 23:59:59')}'`;
            }else if(data.length==3){
                dataFilter =  `pm.agency_id like ${data[data.length-1]}`;
            }else{
                dataFilter = `pm.product_name like '%${data[0]}%' OR u.name like '%${data[0]}%' OR mv.variation like '%${data[0]}%' OR mv.purchasing_price like '%${data[0]}%' OR mv.quantity like '%${data[0]}%'`;
            }
            where = `where ${dataFilter} group by mv.id order by pm.id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }else{
            where = `group by mv.id order by pm.id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }
        
        await productModel.productManufacturerSearch(where).then(async allProducts=>{
            let totalProduct = await categoryModel.selectData('count(id) as totalProduct',tableJson.manufVariation,'');
            let array=[], index= (req.query.start==0) ? 1 : parseInt(req.query.start)+1,recordsFiltered;
            for await (let ap of allProducts){
                let edit = `<span class="ad_edit hd_edit_prodM" prodm-id="${ap.id}" mv-id=${ap.mv_id}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="cls-1" d="M1427.81,414.5l-3.3-3.3a0.636,0.636,0,0,0-.9,0l-10.38,10.371a0.7,0.7,0,0,0-.17.3l-1.04,4.366a0.639,0.639,0,0,0,.62.787,0.7,0.7,0,0,0,.15-0.017l4.36-1.044a0.628,0.628,0,0,0,.3-0.17l10.36-10.393A0.637,0.637,0,0,0,1427.81,414.5Zm-13.26,7.555,7.07-7.065,0.75,0.75-7.06,7.072Zm-0.53,1.278,1.67,1.668-2.19.524Zm2.95,1.14-0.76-.758,7.07-7.072,0.74,0.751Zm7.96-7.984-2.4-2.4,1.53-1.534,2.4,2.4Z" transform="translate(-1412 -411.031)"></path></svg><div class="ad_tooltip_dv"><p>Edit</p></div></span>`
                let deleteData = `<span class="ad_actions ad_delete ad_delete_order delete_productm_var" prodm-id="${ap.id}" mv-id=${ap.mv_id}><svg viewBox="-40 0 427 427.00131" xmlns="http://www.w3.org/2000/svg"><path d="m232.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path><path d="m114.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path><path d="m28.398438 127.121094v246.378906c0 14.5625 5.339843 28.238281 14.667968 38.050781 9.285156 9.839844 22.207032 15.425781 35.730469 15.449219h189.203125c13.527344-.023438 26.449219-5.609375 35.730469-15.449219 9.328125-9.8125 14.667969-23.488281 14.667969-38.050781v-246.378906c18.542968-4.921875 30.558593-22.835938 28.078124-41.863282-2.484374-19.023437-18.691406-33.253906-37.878906-33.257812h-51.199218v-12.5c.058593-10.511719-4.097657-20.605469-11.539063-28.03125-7.441406-7.421875-17.550781-11.5546875-28.0625-11.46875h-88.796875c-10.511719-.0859375-20.621094 4.046875-28.0625 11.46875-7.441406 7.425781-11.597656 17.519531-11.539062 28.03125v12.5h-51.199219c-19.1875.003906-35.394531 14.234375-37.878907 33.257812-2.480468 19.027344 9.535157 36.941407 28.078126 41.863282zm239.601562 279.878906h-189.203125c-17.097656 0-30.398437-14.6875-30.398437-33.5v-245.5h250v245.5c0 18.8125-13.300782 33.5-30.398438 33.5zm-158.601562-367.5c-.066407-5.207031 1.980468-10.21875 5.675781-13.894531 3.691406-3.675781 8.714843-5.695313 13.925781-5.605469h88.796875c5.210937-.089844 10.234375 1.929688 13.925781 5.605469 3.695313 3.671875 5.742188 8.6875 5.675782 13.894531v12.5h-128zm-71.199219 32.5h270.398437c9.941406 0 18 8.058594 18 18s-8.058594 18-18 18h-270.398437c-9.941407 0-18-8.058594-18-18s8.058593-18 18-18zm0 0"></path><path d="m173.398438 154.703125c-5.523438 0-10 4.476563-10 10v189c0 5.519531 4.476562 10 10 10 5.523437 0 10-4.480469 10-10v-189c0-5.523437-4.476563-10-10-10zm0 0"></path></svg><div class="ad_tooltip_dv"><p>Delete</p></div></span>`;
                
                array.push({
                    'index':index,
                    'purchase_date':moment(ap.createdAt).format('DD-MM-YYYY'),
                    'product_name':commonController.entities(ap.product_name),
                    'variation':ap.variation+' '+ap.unit,
                    'purchasing_price':(ap.purchasing_price).toFixed(2),
                    'quantity':ap.quantity,
                    'total_purchase_amount':(ap.purchasing_price*ap.quantity).toFixed(2),
                    'action': edit + deleteData
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

// save Manufacturer data.
exports.saveManufacturer=async(req,res)=>{
    let productData = JSON.parse(req.body.product);
    let variationData = JSON.parse(req.body.data); 
    productData.product_name = commonController.htmlEntities(productData.product_name)
    
    await commonModel.selectData('id',tableJson.manufacturer,{'agency_id':productData.agency_id,'product_name':productData.product_name}).then(async findData=>{
        if(findData.length==0){
            let inv_no = await commonModel.selectData('id',tableJson.invoice,{'agency_id':productData.agency_id,'invoice_number':req.body.invoice_number});
            productData['status']=1;
            productData['createdAt']=moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss');
            productData['updatedAt']=moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss');
            await commonModel.insertData(tableJson.manufacturer,productData).then(async addProducts=>{
                if(addProducts){
                    let dd = {
                        'manuf_id':addProducts.insertId,
                        'status':0,
                        'createdAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss'),
                        'updatedAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss')
                    }
                    let product = await commonModel.insertData(tableJson.products,dd);
                    
                    for await(let vd of variationData){
                        vd['manuf_id']=addProducts.insertId;
                        vd['status']=1;
                        vd['createdAt']=moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss');
                        vd['updatedAt']=moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss');
                        let addVariation = await commonModel.insertData(tableJson.manufVariation,vd);
                        let invdataUpdt = await addUpdateInvoice(req.body.invoice_number,addProducts.insertId,productData,vd);
                    } 
                    res.json({status:true,'message':'Manufacturer product added successfully.'});
                }
            }).catch(err1=>{
                res.json({status:false,'error':err1,'message':'Manufacturer product not added.'});
            });
        }else{
            let complete = 0, stock = 0;
            for(let i in variationData){
                var getVariation = await commonModel.selectData('id,quantity',tableJson.manufVariation,{'manuf_id':findData[0].id, 'variation': variationData[i].variation});
                if(getVariation.length>0){
                    variationData[i]['quantity']=getVariation[0].quantity+parseInt(variationData[i].quantity);
                    variationData[i]['updatedAt']=moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss');
                    var updateManufVariation = await commonModel.updateData(tableJson.manufVariation,variationData[i],{'id':getVariation[0].id});
                    var checkStock = await commonModel.selectData('id,total_quantity,in_stock,sales',tableJson.variation,{'mv_id':getVariation[0].id});
                    
                    if(checkStock[0].in_stock==0){
                        let postData = {
                            'in_stock':parseInt(checkStock[0].in_stock)+parseInt(variationData[i].quantity),
                            'total_quantity':parseInt(checkStock[0].total_quantity)+parseInt(variationData[i].quantity),
                            'updatedAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss')
                        }
                    
                        var updtVariation = await commonModel.updateData(tableJson.variation,postData,{'id':checkStock[0].id});
                        let invdataUpdt = await addUpdateInvoice(req.body.invoice_number,findData[0].id,productData,variationData[i]);
                    }else{
                        stock=1;
                    }    
                }else{
                    variationData[i]['manuf_id']=findData[0].id;
                    variationData[i]['createdAt']=moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss');
                    variationData[i]['updatedAt']=moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss');
                    let addVariation = await commonModel.insertData(tableJson.manufVariation,variationData[i]);
                    let invdataUpdt = await addUpdateInvoice(req.body.invoice_number,findData[0].id,productData,variationData[i]);
                }
                if(i == (variationData.length-1)){
                    complete=1;
                }
            }
            if(complete==1 && stock==0){
                res.json({status:true, 'message':'Manufacturer product added successfully.'});
            }else if(stock==1){
                res.json({status:false, 'message':'This product is already exists...Try another.'});
            }
        }
    }).catch(err=>{
        res.json({status:false,'error':err, 'message':'Manufacturer product data not found.'});
    });
}

// get edit data 
exports.getManuf=async(req, res)=>{
    await productModel.manufProductFind(`where mv.id=${req.params.id}`).then(async findData=>{
        res.json({status:true,'data':findData[0]});
    }).catch(err=>{
        res.json({status:false,'error':err, 'message':'Manufacturer product data not found.'});
    });
}

// update manufacturer.
exports.updateManuf=async(req, res)=>{
    await commonModel.selectData('id,manuf_id,quantity,purchasing_price',tableJson.manufVariation,{'id':req.body.mv_id}).then(async getQuan=>{
        if(getQuan.length>0){
            let price = getQuan[0].quantity * getQuan[0].purchasing_price;
            let findInvoice = await commonModel.selectData('id,total_purchase_amount',tableJson.invoice,{'manuf_id':getQuan[0].manuf_id});
            if(findInvoice.length>0){
                let lessAmount = findInvoice[0].total_purchase_amount - price;
                let postData = {
                    'total_purchase_amount':lessAmount + (req.body.purchasing_price*req.body.quantity),
                    'due_amount':lessAmount + (req.body.purchasing_price*req.body.quantity),
                    'updatedAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss')
                }
                let updtInvoice =  await commonModel.updateData(tableJson.invoice,postData,{'id':findInvoice[0].id});  
                var updtData={
                    'purchasing_price':req.body.purchasing_price,
                    'quantity':req.body.quantity,
                    'low_quantity':req.body.low_quantity,
                    'updatedAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss')
                }
                
                await commonModel.updateData(tableJson.manufVariation,updtData,{'id':req.body.mv_id}).then(async result=>{
                    res.json({status:true,'message':'Manufacturer product data updated.'});
                }).catch(err1=>{
                    res.json({status:false,'error1':err1,'message':'Manufacturer product data not updated.'});
                });                       
            }
        }else{
            res.json({status:false,'message':'Manufacturer product data not found.'});
        }
    }).catch(err=>{
        res.json({status:false,'error':err,'message':'Manufacturer product data not found.'});
    });
}

exports.deleteManufProduct=async(req,res)=>{
    await commonModel.selectData('id,quantity,purchasing_price,manuf_id',tableJson.manufVariation,{'manuf_id':req.body.manuf_id}).then(async getQuan=>{
        let matchId = 0;
        if(getQuan.length>1){
            for await(let product of getQuan){
                let data = await deletePurchasingProductVariation(product.id, req.params.id);
                if(data==true){
                    matchId = 1 ;
                }
            }
            if(matchId==1){
                res.json({status:true,'message':'Product deleted.'});
            }else{
                res.json({status:false,'message':'Product not deleted.'});
            }
        }else{
            let result = await commonModel.deleteData(tableJson.manufVariation, {'id':req.params.id});
            if(result){
                await commonModel.selectData('id,agency_id',tableJson.manufacturer,{'id':req.body.manuf_id}).then(async getAgencyId=>{
                    if(getAgencyId.length>0){
                        let delData = await commonModel.deleteData(tableJson.manufacturer, {'id':getQuan[0].manuf_id});
                        let findProduct = await commonModel.selectData('id',tableJson.products,{'manuf_id':getQuan[0].manuf_id});
                        if(findProduct){
                            let productDelete = await commonModel.deleteData(tableJson.products,{'manuf_id':getQuan[0].manuf_id});
                            let ratingDel = await commonModel.deleteData(tableJson.rating,{'product_id':findProduct[0].id});
                            (delData && productDelete && ratingDel) ? res.json({status:true,'message':'Product deleted.'}) : res.json({status:false,'message':'Product not deleted.'});
                        }
                    }
                }).catch(err1=>{
                    res.json({status:false,'error':err1,'message':'Product not deleted.'});
                });
            }
        }
    }).catch(err=>{
        res.json({status:false,'error':err,'message':'Manufacturer product data not found.'});
    });
}

async function deletePurchasingProductVariation(mv_id, reqParamId){
    if(mv_id==reqParamId){
        let result = await commonModel.deleteData(tableJson.manufVariation,{'id':mv_id});
        return true;
    }else{
        return false
    }
}

async function addUpdateInvoice(invoice_number,manuf_id,productData,vd){
    let findInvoice = await commonModel.selectData('id,total_purchase_amount',tableJson.invoice,{'invoice_number':invoice_number});
    if(findInvoice.length>0){
        let postData = {
            'total_purchase_amount':findInvoice[0].total_purchase_amount+(vd.purchasing_price*vd.quantity),
            'due_amount':findInvoice[0].total_purchase_amount+(vd.purchasing_price*vd.quantity),
            'updatedAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss')
        }
        let updtInvoice =  await commonModel.updateData(tableJson.invoice,postData,{'id':findInvoice[0].id});   
        return true;                      
    }else{
        let postData = {
            'manuf_id':manuf_id,
            'agency_id':productData.agency_id,
            'invoice_number':invoice_number,
            'total_purchase_amount':vd.purchasing_price*vd.quantity,
            'due_amount':vd.purchasing_price*vd.quantity,
            'createdAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss'),
            'updatedAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss')
        }
        let addInvoice =  await commonModel.insertData(tableJson.invoice,postData);
        return true;
    }
}
