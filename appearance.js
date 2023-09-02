const commonController = require('../../common/commonController');
const commonModel = require('../../common/commonModel');
const tableJson = require('../../common/table.json');

const moment = require('moment');
var date = new Date();

exports.getAppearancePage=async(req,res)=>{
    if(req.session.adminId){
        var seoJson = await commonController.basicSetting('seo_settings');
        var themeSettingJson = await commonModel.selectData('jsonData',tableJson.settings,{'user_id':1,'type':'theme_settings'});
        themeSettingJson = (themeSettingJson.length>0) ? JSON.parse(themeSettingJson[0].jsonData) : '';
        if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
    
        res.render('admin/views/appearance',{'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole,'seoJson':seoJson,'themeSettingJson':themeSettingJson, 'pathName':'Appearance'});
    }else{
        res.redirect('/admin/');
    }
}

exports.saveAppearanceData=async(req,res)=>{ 
    let reqData = req.body
    if(req.files.length>0){
        for(let i in req.files){
            if(req.body.logo){
                if(req.files[i].originalname == req.body.logo){
                    reqData['logo']= req.files[i].filename
                }
            }
            if(req.body.favicon){
                if(req.files[i].originalname == req.body.favicon){
                    reqData['favicon']= req.files[i].filename
                }
            }
            if(req.body.footer_logo){
                if(req.files[i].originalname == req.body.footer_logo){
                    reqData['footer_logo']= req.files[i].filename
                }
            }
        }
    }

    await commonModel.selectData('id,jsonData',tableJson.settings,{'user_id':1,'type':'theme_settings'}).then(async getSetting=>{
        if(getSetting.length==0){
            let postData ={
                'user_id':1,
                'type':'theme_settings',
                'jsonData':JSON.stringify(reqData),
                'createdAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss'),
                'updatedAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.insertData(tableJson.settings,postData).then(async result=>{
                res.json({status:true,'message':'Appearance added.'});
            }).catch(err1=>{
                res.json({status:false,'error':err1,'message':'Appearance not added.'});
            });
        }else{
            let settingData = JSON.parse(getSetting[0].jsonData)
            settingData.theme_name = reqData.theme_name, settingData.theme_tagline = reqData.theme_tagline
            settingData.font = reqData.font, settingData.theme_color = reqData.theme_color 
            settingData.hover_color = reqData.hover_color;
            if(reqData.footer_logo) settingData.footer_logo = reqData.footer_logo
            if(reqData.logo) settingData.logo = reqData.logo
            if(reqData.favicon) settingData.favicon = reqData.favicon
            let dd = {
                'jsonData':JSON.stringify(settingData),
                'updatedAt':moment(date).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.updateData(tableJson.settings,dd,{'user_id':1,'type':'theme_settings'}).then(async updtsetting=>{
                res.json({status:true,'message':'Appearance changed successfully.'});
            }).catch(err2=>{
                res.json({status:false,'error':err2,'message':'Appearance not changed.'});
            });
        }
    }).catch(err=>{
        res.json({status:false,'error':err,'message':'Appearance not found.'});
    });
}

// {"theme_name":"Home Delivey","theme_tagline":"","font":"Lato","theme_color":"#00d4bb","hover_color":"#fbe636","logo":"1608282956878.png","favicon":"1608282956880.png","footer_logo":"1610107589154.png"}