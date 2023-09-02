const commonController = require('../../common/commonController');
const commonModel = require('../../common/commonModel');
const tableJson = require('../../common/table.json');

const CSC = require('city-state-country');
const ICC = require('iso-country-currency');

exports.getFooterSettingPage=async(req,res)=>{
    if(req.session.adminId){
        await commonModel.selectData('jsonData',tableJson.settings,{'user_id':1,'type':'footer_settings'}).then(async getSetting=>{
            var seoJson = await commonController.basicSetting('seo_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            getSetting = (getSetting.length>0) ? JSON.parse(getSetting[0].jsonData) : '';

            res.render('admin/views/footer-settings',{'footerSetting':getSetting,'country':CSC.getAllCountries(),'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole,'seoJson':seoJson,'themeSettingJson':themeSettingJson, 'pathName':'Footer Settings'});
        }).catch(err=>{
            res.json({status:false,'error':err,'message':'Basic Setting not found.'});
        });
    }else{
        res.redirect('/admin/');
    }

}

exports.getState=async(req,res)=>{
    var state = CSC.getAllStatesFromCountry(req.body.country), currency, symbol;
    var country=''
    if(req.body.country != ''){
        country = CSC.searchCountry(req.body.country);
        country = country[0].phoneCode;
        currency = ICC.getParamByParam('countryName', req.body.country, 'currency', 'symbol');
        symbol = ICC.getParamByParam('countryName', req.body.country, 'symbol');
    }
    res.json({status:true,'state':state,'country_phoneCode':country, 'currency':currency, 'symbol':symbol});
}

exports.saveFooterSetting=async(req,res)=>{
    let settData =await commonController.settingData(req.body,req.session.adminId,'footer_settings')
    if(settData!=''){
        if(settData.insertId==0){
            res.json({status:true,'message':'Basic setting changed successfully.'});
        }else if(settData.message.warning==0){
            res.json({status:false,'message':'Basic setting not changed.'});
        }else{
            res.json({status:true,'message':'Basic setting added.'});
        }
    }else{
        res.json({status:false,'message':'Basic setting not added.'});
    }
}
