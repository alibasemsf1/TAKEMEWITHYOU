const commonController = require('../../common/commonController');
const commonModel = require('../../common/commonModel');
const tableJson = require('../../common/table.json');

exports.getSmtpSettingPage=async(req,res)=>{
    if(req.session.adminId){
        await commonModel.selectData('jsonData',tableJson.settings,{'type':'smtp_settings'}).then(async result=>{
            var seoJson = await commonController.basicSetting('seo_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            result = (result.length>0) ? JSON.parse(result[0].jsonData) : '';

            res.render('admin/views/smtp-settings',{'smtpData':result,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole,'seoJson':seoJson,'themeSettingJson':themeSettingJson,'pathName':'SMTP Settings'});
        }).catch(err=>{
            res.json({status:false,'message':'SMTP Setting data not found.'})
        });
    }else{
        res.redirect('/admin/');
    }
}


exports.saveMailSettings=async(req,res)=>{
    let settData =await commonController.settingData(req.body,req.session.adminId,'smtp_settings')
    if(settData!=''){
        if(settData.insertId==0){
            res.json({status:true,'message':'SMTP details are saved.'});
        }else if(settData.message.warning==0){
            res.json({status:false,'message':'SMTP details are not saved.'});
        }else{
            res.json({status:true,'message':'SMTP details added.'});
        }
    }else{
        res.json({status:false,'message':'SMTP details not added.'});
    }
}

