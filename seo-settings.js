const commonController = require('../../common/commonController');

exports.getSeoSettingPage=async(req,res)=>{
    if(req.session.adminId){
        var seoJson = await commonController.basicSetting('seo_settings');
        var themeSettingJson = await commonController.themeSetting('theme_settings');
        if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
    
        res.render('admin/views/seo-settings',{'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole,'seoJson':seoJson,'themeSettingJson':themeSettingJson, 'pathName':'Seo Settings'});
    }else{
        res.redirect('/admin/')
    }
}

exports.saveSeoSettings=async(req,res)=>{
    req.body.description=commonController.htmlEntities(req.body.description);
    let settData =await commonController.settingData(req.body,req.session.adminId,'seo_settings');
    if(settData!=''){
        if(settData.insertId==0){
            res.json({status:true,'message':'SEO settings are saved.'});
        }else if(settData.message.warning==0){
            res.json({status:false,'message':'SEO settings are not saved.'});
        }else{
            res.json({status:true,'message':'SEO settings are saved.'});
        }
    }else{
        res.json({status:false,'message':'SEO settings are not saved.'});
    }
}

