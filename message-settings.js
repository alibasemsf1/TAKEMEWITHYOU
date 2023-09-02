const commonController = require('../../common/commonController');
const commonModel = require('../../common/commonModel');
const tableJson = require('../../common/table.json');

const moment = require('moment');
var date = new Date();

exports.getMessageSettingPage=async(req,res)=>{
    if(req.session.adminId){
        var seoJson = await commonController.basicSetting('seo_settings');
        if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
        var themeSettingJson = await commonController.themeSetting('theme_settings');
        res.render('admin/views/message-settings',{'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole,'seoJson':seoJson,'themeSettingJson':themeSettingJson, 'pathName':'Message Settings'});
    }else{
        res.redirect('/admin/')
    }
}


exports.getMessage=async(req,res)=>{
    let status = req.body.status
    await commonModel.selectData('jsonData',tableJson.settings,{'user_id':1,'type':'msg_settings_'+status}).then(async msgSettings=>{   
        res.json({status:true,'data':msgSettings});
    }).catch(err=>{
        res.json({status:false,'error':err,'message':status+' not found.'});
    });
}

exports.saveSmsSettings=async(req,res)=>{
    let msg_status = req.body.msg_status ;
    let text = req.body.text.trim(); 
    let getSetting = await commonModel.selectData('id',tableJson.settings,{'user_id':1,'type':'msg_settings_'+msg_status});
    if(getSetting.length==0){
        let postData ={
            'user_id':1,
            'type':'msg_settings_'+msg_status,
            'jsonData':text.replace(/\n/g, '<br>'),
            'createdAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss'),
            'updatedAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
        }
        let result = await commonModel.insertData(tableJson.settings,postData)
        if(result){
            res.json({status:true,'message':'Message added.'});
        }else{
            res.json({status:false,'message':'Message not added.'});
        }
    }else{
        let dd = {
            'jsonData':text.replace(/\n/g, '<br>'),
            'updatedAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
        }
        let updtsetting =await commonModel.updateData(tableJson.settings,dd,{'user_id':1,'type':'msg_settings_'+msg_status})
        if(updtsetting){
            res.json({status:true,'message':'Message changed successfully.'});
        }else{
            res.json({status:false,'message':'Message not changed.'});
        }
    }
    
}
