const commonController = require('../../common/commonController');
const commonModel = require('../../common/commonModel');
const tableJson = require('../../common/table.json');

const moment = require('moment');
var date = new Date();

exports.getBannerPage=async(req,res)=>{
    if(req.session.adminId){
        await commonModel.selectData('id,jsonData',tableJson.settings,{'type':'banner_settings'}).then(async result=>{
            var seoJson = await commonController.basicSetting('seo_settings');
            var themeSettingJson = await commonModel.selectData('jsonData',tableJson.settings,{'user_id':1,'type':'theme_settings'});
            themeSettingJson = (themeSettingJson.length>0) ? JSON.parse(themeSettingJson[0].jsonData) : '';
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
            if(result.length>0){
                result = result[0]
                result.jsonData = JSON.parse(result.jsonData);
                result.jsonData.content = result.jsonData.content.replace(/<br> /g, ''); 
            }else{
                result = ''
            }
            res.render('admin/views/banner-settings',{'bannerData':result,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole,'seoJson':seoJson,'themeSettingJson':themeSettingJson, 'pathName':'Banner Settings'});
        }).catch(err=>{
            res.json({status:false,'error':err,'message':'Banner settings data not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.saveBannerData=async(req,res)=>{ 
    let reqData = req.body
    if(req.file){
        reqData['banner_image']=req.file.filename
    }
    
    await commonModel.selectData('id,jsonData',tableJson.settings,{'user_id':1,'type':'banner_settings'}).then(async getSetting=>{
        if(getSetting.length==0){
            let postData ={
                'user_id':1,
                'type':'banner_settings',
                'jsonData':JSON.stringify(reqData),
                'createdAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss'),
                'updatedAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.insertData(tableJson.settings,postData).then(async result=>{
                res.json({status:true,'message':'Banner settings data added.'});
            }).catch(err1=>{
                res.json({status:false,'error':err1,'message':'Banner settings data not added.'});
            });
        }else{
            let settingData = JSON.parse(getSetting[0].jsonData)
            settingData.title = reqData.title, settingData.content = reqData.content
            settingData.button_text = reqData.button_text, settingData.title_color = reqData.title_color 
            settingData.content_color = reqData.content_color;
            if(reqData.banner_image) settingData.banner_image = reqData.banner_image
            
            let dd = {
                'jsonData':JSON.stringify(settingData),
                'updatedAt':moment(date).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.updateData(tableJson.settings,dd,{'user_id':1,'type':'banner_settings'}).then(async updtsetting=>{
                res.json({status:true,'message':'Banner settings data changed successfully.'});
            }).catch(err2=>{
                res.json({status:false,'error':err2,'message':'Banner settings data not changed.'});
            });
        }
    }).catch(err=>{
        res.json({status:false,'error':err,'message':'Banner settings data not found.'});
    });
}

