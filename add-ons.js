const commonController = require('../../common/commonController');
const commonModel = require('../../common/commonModel');
const tableJson = require('../../common/table.json');
const categoryModel = require('../models/category');
const addOnJson = require('../config/add-on.json');
const settingJson = require('../../config/settings.json');

const moment = require('moment');

var date = new Date();

exports.getAddOnPage=async(req,res)=>{
    if(req.session.adminId){  
        await categoryModel.selectData('id,name,version,image,status',tableJson.addon,'order by id desc').then(async result=>{
            var seoJson = await commonController.basicSetting('seo_settings');
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
            let addonArray = [];
            for(let i in addOnJson){
                addonArray.push(addOnJson[i]);
                for(let j in result){
                    if(addOnJson[i].name == result[j].name){
                        addOnJson[i]['label'] = 'installed';
                        addOnJson[i]['id'] = result[j].id;
                        addOnJson[i]['status'] = result[j].status;
                    }
                } 
            }
            
            res.render('admin/views/add-ons',{'addOns': addonArray,'buy_now_link':settingJson.codecanyon_link,'seoJson':seoJson,'themeSettingJson':themeSettingJson,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole, 'pathName':'Add-On'});
        }).catch(err=>{
            res.json({status:false,'error':err,'message':'Add-on not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.addUpdtAddon=async(req,res)=>{
    let data = JSON.parse(req.body.resp);
    await commonModel.selectData('id',tableJson.addon,{'name':data.file}).then(async result=>{
        if(result.length>0){
            var newData = {
                'name':data.file,
                'version':data.version,
                'image':'',
                'status':1,
                'updatedAt':moment(date).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.updateData(tableJson.addon,newData,{'name':data.file}).then(async updateData=>{
                res.json({status:true,'message':'AddOn data added.'});
            }).catch(err1=>{
                res.json({status:false,'error1':err1,'message':'AddOn data not added.'});
            });
        }else{
            var newData = {
                'name':data.file,
                'version':data.version,
                'image':'',
                'status':1,
                'createdAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss'),
                'updatedAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.insertData(tableJson.addon,newData).then(async addData=>{
                res.json({status:true,'message':'AddOn data updated.'});
            }).catch(err1=>{
                res.json({status:false,'error1':err1,'message':'AddOn data not updated.'});
            });
        }
    }).catch(err=>{
        res.json({status:false,'error':err,'message':'Add-on not found.'});
    });
}

exports.addonStatusChange=async(req,res)=>{
    var statusChange = {
        'status':req.body.status,
        'updatedAt':moment(date).format("YYYY-MM-DD HH:mm:ss")
    }
    var wh = {'id' : req.body.id}
    await commonModel.updateData(tableJson.addon,statusChange,wh).then(async addOnStatus=>{
        res.send({status:true, message:'Add-on status changed successfully.'});
    }).catch(err=>{
        res.send({status:false, message:'Add-on status not changed.'});
    });
}