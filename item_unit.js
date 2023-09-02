// require common folder files.
const commonModel=require('../../common/commonModel');
const commonController=require('../../common/commonController');
const tableJson=require('../../common/table.json');

// require current folder Models.
const categoryModel=require('../models/category');

// require modules.
const moment=require('moment');
var dateTime = new Date();

exports.getAllUnit=async(req, res)=>{
    if(req.session.adminId){
        await categoryModel.selectData('count(id) as unitLength',tableJson.units,'').then(async allUnit=>{
            var seoJson = await commonController.basicSetting('seo_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            res.render('admin/views/item_unit',{'unit':allUnit[0].unitLength,'seoJson':seoJson,'themeSettingJson':themeSettingJson,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole, 'pathName':'Item Units'})
        }).catch(err=>{
            res.json({status:false,'error':err,message:'Unit not found.'})
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.addUnit=async(req, res)=>{
    await commonModel.selectData('id',tableJson.units,{'name':req.body.name}).then(async result=>{
        if(result.length>0){
            res.json({status:false,message:'Unit name already exists... try another.'})
        }else{
            var unitData={
                'name':req.body.name,
                'createdAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.insertData(tableJson.units,unitData).then(async newUnit=>{
                res.json({status:true,message:'Unit added successfully.'})
            }).catch(err1=>{
                res.json({status:false,'error1':err1,message:'Unit not added.'})
            });
        }
    }).catch(err => {
        res.json({status:false,'error':err,message:'Unit not found.'})
    })
}

exports.editUnit=async(req, res)=>{
    await commonModel.selectData('id,name',tableJson.units,{id:req.query.id}).then(async unitData=>{
        res.json({status:true,unitData:unitData[0]})
    }).catch(err=>{
        res.json({status:false,message:'Unit not found.'})
    });
}

exports.updateUnit=async(req, res)=>{
    var dd = {
        name:req.body.name,
        updatedAt:moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
    }

    await commonModel.updateData(tableJson.units,dd,{id:req.params.id}).then(async updtData=>{
        res.json({status:true,message:'Unit updated successfully.'})
    }).catch(err=>{
        res.json({status:false,message:'Unit not updated.'})
    });
}

exports.searchUnit=async(req, res)=>{
    if(req.session.adminId){
        let where ;
        if(req.query.search.value){
            where = `where name LIKE '%${req.query.search.value}%' order by id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }else{
            where = `order by id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }
        
        await categoryModel.selectData('id,name',tableJson.units,where).then(async allUnit=>{
            let allUnitLength = await categoryModel.selectData('count(id) as unitLength',tableJson.units,'');
            let array=[], index= (req.query.start==0) ? 1 : parseInt(req.query.start)+1,recordsFiltered;
            for await (let au of allUnit){
                let action = `<span class="ad_edit hd_edit_unit" unit-id="${au.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="cls-1" d="M1427.81,414.5l-3.3-3.3a0.636,0.636,0,0,0-.9,0l-10.38,10.371a0.7,0.7,0,0,0-.17.3l-1.04,4.366a0.639,0.639,0,0,0,.62.787,0.7,0.7,0,0,0,.15-0.017l4.36-1.044a0.628,0.628,0,0,0,.3-0.17l10.36-10.393A0.637,0.637,0,0,0,1427.81,414.5Zm-13.26,7.555,7.07-7.065,0.75,0.75-7.06,7.072Zm-0.53,1.278,1.67,1.668-2.19.524Zm2.95,1.14-0.76-.758,7.07-7.072,0.74,0.751Zm7.96-7.984-2.4-2.4,1.53-1.534,2.4,2.4Z" transform="translate(-1412 -411.031)"></path></svg><div class="ad_tooltip_dv"><p>Edit</p></div></span>`
                array.push({
                    'index':index,
                    'name':au.name,
                    'action':action
                });
                index++;
            }
            if(array.length>0){
                recordsFiltered=allUnitLength[0].unitLength
            }else{
                recordsFiltered=array.length
            }

            res.json({status:true,'data':array, 'recordsTotal':allUnitLength[0].unitLength,'recordsFiltered':recordsFiltered});
        }).catch(err=>{
            res.json({status:false,'error':err,message:'Product not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}
