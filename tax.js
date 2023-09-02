// require common folder files.
const commonModel=require('../../common/commonModel');
const tableJson=require('../../common/table.json');
const commonController=require('../../common/commonController');

// require current folder models.
const categoryModel=require('../models/category');

// require modules.
const moment=require('moment');

var dateTime = new Date();
exports.getTaxPage=async(req, res)=> {
    if(req.session.adminId){
        await categoryModel.selectData('id,title',tableJson.category,'order by id desc').then(async getCategory=>{
            let allTax = await categoryModel.selectData('count(id) as taxLength',tableJson.tax,'');
            var seoJson = await commonController.basicSetting('seo_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            
            res.render('admin/views/tax',{'tax':allTax[0].taxLength,'category':getCategory,'seoJson':seoJson,'themeSettingJson':themeSettingJson,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole,'pathName':'Tax Manager'});
        }).catch(err=>{
            res.json({status:false,message:'Roles not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.taxSearch=async(req,res)=>{
    if(req.session.adminId){
        let where ;
        if(req.query.search.value){
            where = `where c.title LIKE '%${req.query.search.value}%' OR t.tax_percentage LIKE '%${req.query.search.value}%' order by id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }else{
            where = `order by id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }
        
        await categoryModel.getTaxDataBySearch(where).then(async allTaxes=>{
            let allTaxesLength = await categoryModel.selectData('count(id) as taxLength',tableJson.tax,'');
            let array=[], index= (req.query.start==0) ? 1 : parseInt(req.query.start)+1,recordsFiltered;
            for await (let at of allTaxes){
                let status = (at.status==1) ? 'checked=""' : '';
                let action = `<span class="ad_edit hd_edit_tax" tax-id="${at.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="cls-1" d="M1427.81,414.5l-3.3-3.3a0.636,0.636,0,0,0-.9,0l-10.38,10.371a0.7,0.7,0,0,0-.17.3l-1.04,4.366a0.639,0.639,0,0,0,.62.787,0.7,0.7,0,0,0,.15-0.017l4.36-1.044a0.628,0.628,0,0,0,.3-0.17l10.36-10.393A0.637,0.637,0,0,0,1427.81,414.5Zm-13.26,7.555,7.07-7.065,0.75,0.75-7.06,7.072Zm-0.53,1.278,1.67,1.668-2.19.524Zm2.95,1.14-0.76-.758,7.07-7.072,0.74,0.751Zm7.96-7.984-2.4-2.4,1.53-1.534,2.4,2.4Z" transform="translate(-1412 -411.031)"></path></svg><div class="ad_tooltip_dv"><p>Edit</p></div></span>`
                array.push({
                    'index':index,
                    'category':at.title,
                    'tax_percentage':at.tax_percentage,
                    'action':`<div class="ad_status_autoresponder" data-toggle="tooltip" title="Status"><label class="ad_status_toggle_label"><input type="checkbox" name="tax_status" tax-id="${at.id}" ${status}><div class="ad_status_user_check"><span></span></div></label></div>` + action
                });
                index++;
            }
            if(array.length>0){
                recordsFiltered=allTaxesLength[0].taxLength
            }else{
                recordsFiltered=array.length
            }
            res.json({status:true,'data':array, 'recordsTotal':allTaxesLength[0].taxLength,'recordsFiltered':recordsFiltered});
        }).catch(err=>{
            res.json({status:false,'error':err,'message':'Tax not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.addTaxData=async(req,res)=>{
    await commonModel.selectData('id',tableJson.tax,{'category_id':req.body.category_id}).then(async findTaxData=>{
        if(findTaxData.length==0){
            let taxData = {
                'category_id' : req.body.category_id,
                'tax_percentage' : req.body.tax,
                'status':1,
                'createdAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss'),
                'updatedAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.insertData(tableJson.tax,taxData).then(async addTax=>{
                res.json({status:true,'message':'Tax added successfully.'});
            }).catch(err=>{
                res.json({status:false,'message':'Tax not added.'});
            });
        }else{
            res.json({status:false, 'message':'Category id is already exists...Try another.'});
        }
    }).catch(err=>{
        res.json({status:false,'error':err, 'message':'Tax data not found.'});
    });
}

exports.getTaxById=async(req,res)=>{
    await commonModel.selectData('category_id,tax_percentage',tableJson.tax,{'id':req.body.id}).then(async getTax=>{
        res.json({status:true,'data':getTax[0]});
    }).catch(err=>{
        res.json({status:false,'error':err, 'message':'Tax data not found.'});
    });
}

exports.updateTax=async(req,res)=>{
    var postData={
        'tax_percentage':req.body.tax_percentage,
        'updatedAt':moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
    }
    await commonModel.updateData(tableJson.tax,postData,{'id':req.body.id}).then(result=>{
        res.json({status:true,'message':'Tax data updated.'});
    }).catch(err=>{
        res.json({status:false,'error':err, 'message':'Tax data not updated.'});
    });
}

exports.statusChange=async(req,res)=>{
    var statusChange = {
        'status':req.body.status,
        'updatedAt':moment(dateTime).format("YYYY-MM-DD HH:mm:ss")
    }
    var wh = {'id' : req.body.id}
    await commonModel.updateData(tableJson.tax,statusChange,wh).then(async taxStatus=>{
        res.send({status:true, message:'Tax status changed successfully.'});
    }).catch(err=>{
        res.send({status:false, message:'Tax status not changed.'});
    });
}