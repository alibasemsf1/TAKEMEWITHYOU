const commonController = require('../../common/commonController');
const commonModel = require('../../common/commonModel');
const tableJson = require('../../common/table.json');

const CSC = require('city-state-country');
const moment = require('moment');

var date = new Date();

exports.getMerchantSettingPage=async(req,res)=>{
    if(req.session.adminId){
        await commonModel.selectData('jsonData',tableJson.settings,{'user_id':1,'type':'merchant_details'}).then(async merchantDetails=>{
            let footerSettings = await commonController.basicSetting('footer_settings');
            var seoJson = await commonController.basicSetting('seo_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            if(merchantDetails.length>0) {
                merchantDetails=JSON.parse(merchantDetails[0].jsonData);
                merchantDetails.declaration=commonController.entities(merchantDetails.declaration);
                merchantDetails.terms_condition=commonController.entities(merchantDetails.terms_condition);
            }

            res.render('admin/views/merchant-settings',{'merchantDetails':merchantDetails,'footerSettings':footerSettings,'country':CSC.getAllCountries(),'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole,'seoJson':seoJson,'themeSettingJson':themeSettingJson, 'pathName':'Merchant Settings'});
        }).catch(err=>{
            res.json({status:false,'error':err,'message':'Basic Setting not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.saveMerchantDetails=async(req,res)=>{ 
    let reqData = req.body
    reqData.declaration = commonController.htmlEntities(reqData.declaration);
    reqData.terms_condition = commonController.htmlEntities(reqData.terms_condition);
    if(req.file){
        reqData['signature'] = req.file.filename
    }
    await commonModel.selectData('id,jsonData',tableJson.settings,{'user_id':1,'type':'merchant_details'}).then(async getSetting=>{
        if(getSetting.length==0){
            let postData ={
                'user_id':1,
                'type':'merchant_details',
                'jsonData':JSON.stringify(reqData),
                'createdAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss'),
                'updatedAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.insertData(tableJson.settings,postData).then(async result=>{
                res.json({status:true,'message':'Merchant Details added.'});
            }).catch(err1=>{
                res.json({status:false,'error':err1,'message':'Merchant Details not added.'});
            });
        }else{
            let settingData = JSON.parse(getSetting[0].jsonData)
            settingData['gst_number'] = reqData.gst_number, settingData['pan_number'] = reqData.pan_number;
            settingData['shop_name'] = reqData.shop_name, settingData['pin_code'] = reqData.pin_code ;
            settingData['merchant_country'] = reqData.merchant_country, settingData['merchant_state'] = reqData.merchant_state;
            settingData['merchant_city'] = reqData.merchant_city, settingData['merchant_address'] = reqData.merchant_address;
            settingData['declaration'] = reqData.declaration, settingData['terms_condition'] = reqData.terms_condition,
            settingData['shipping_charges_in'] = reqData.shipping_charges_in, settingData['shipping_charges_out'] = reqData.shipping_charges_out ;
            if(reqData.signature) settingData['signature']=reqData.signature;
            
            let dd = {
                'jsonData':JSON.stringify(settingData),
                'updatedAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.updateData(tableJson.settings,dd,{'user_id':1,'type':'merchant_details'}).then(async updtsetting=>{
                res.json({status:true,'message':'Merchant Details changed successfully.'});
            }).catch(err2=>{
                res.json({status:false,'error':err2,'message':'Merchant Details not changed.'});
            });
        }
    }).catch(err=>{
        res.json({status:false,'error':err,'message':'Merchant Details not found.'});
    });
}

