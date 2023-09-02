const commonController = require('../../common/commonController');
const commonModel = require('../../common/commonModel');
const tableJson = require('../../common/table.json');

const moment = require('moment');
var date = new Date();

exports.getPaymentMethodPage=async(req,res)=>{
    if(req.session.adminId){
        await commonModel.selectData('json',tableJson.paymentMethod,{'type':'paypal_credential'}).then(async getPaypalCred=>{
            var seoJson = await commonController.basicSetting('seo_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            var getStripeCred = await commonModel.selectData('json',tableJson.paymentMethod,{'type':'stripe_credential'});

            getPaypalCred = (getPaypalCred.length>0) ? JSON.parse(getPaypalCred[0].json) : '' ;
            getStripeCred = (getStripeCred.length>0) ? JSON.parse(getStripeCred[0].json) : '' ;

            let stripe = '',paypal = '';
            let stripeExist = await commonController.checkFolderExistance("./stripe");
            if(stripeExist==1){ 
                let statusCheckAddOn = await commonModel.selectData('status',tableJson.addon,{'name':'stripe'});
                if(statusCheckAddOn[0].status==1){
                    stripe = 'exists';
                }
            }
    
            let paypalExist = await commonController.checkFolderExistance("./paypal");
            if(paypalExist==1){ 
                let statusCheckAddOn = await commonModel.selectData('status',tableJson.addon,{'name':'paypal'});
                if(statusCheckAddOn[0].status==1){
                    paypal = 'exists';
                }
            }

            res.render('admin/views/payment-method',{'paypalCredential':getPaypalCred,'stripeCredential':getStripeCred,'stripe':stripe,'paypal':paypal,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole,'seoJson':seoJson,'themeSettingJson':themeSettingJson, 'pathName':'Payment Method'});
        }).catch(err=>{
            res.json({status:false,'message':'Paypal Credentials not found.'});
        })
    }else{
        res.redirect('/admin/');
    }
}

exports.savePaypalCredentials=async(req,res)=>{
    let reqData = req.body.data
    await commonModel.selectData('id,json',tableJson.paymentMethod,{'type':'paypal_credential'}).then(async getCredential=>{
        if(getCredential.length==0){
            let postData ={
                'type':'paypal_credential',
                'json':reqData,
                'createdAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss'),
                'updatedAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.insertData(tableJson.paymentMethod,postData).then(async result=>{
                res.json({status:true,'message':'Paypal Credentials added.'});
            }).catch(err1=>{
                res.json({status:false,'error':err1,'message':'Paypal Credentials not added.'});
            });
        }else{
            let credential = JSON.parse(getCredential[0].json)
            reqData = JSON.parse(reqData);
            credential.client_id = reqData.client_id
            credential.client_secret = reqData.client_secret
            credential.sanbox_allow = reqData.sanbox_allow
            
            let dd = {
                'json':JSON.stringify(credential),
                'updatedAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.updateData(tableJson.paymentMethod,dd,{'type':'paypal_credential'}).then(async updtsetting=>{
                res.json({status:true,'message':'Paypal Credentials updated.'});
            }).catch(err2=>{
                res.json({status:false,'error':err2,'message':'Paypal Credentials not updated.'});
            });
        }
    }).catch(err=>{
        res.json({status:false,'error':err,'message':'Paypal Credentials not found.'});
    });
}

exports.saveStripeCredentials=async(req,res)=>{
    let reqData = req.body.data
    await commonModel.selectData('id,json',tableJson.paymentMethod,{'type':'stripe_credential'}).then(async getCredential=>{
        if(getCredential.length==0){
            let postData ={
                'type':'stripe_credential',
                'json':reqData,
                'createdAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss'),
                'updatedAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.insertData(tableJson.paymentMethod,postData).then(async result=>{
                res.json({status:true,'message':'Stripe Credentials added.'});
            }).catch(err1=>{
                res.json({status:false,'error':err1,'message':'Stripe Credentials not added.'});
            });
        }else{
            let credential = JSON.parse(getCredential[0].json)
            reqData = JSON.parse(reqData);
            credential.stripe_key = reqData.stripe_key
            credential.stripe_secret = reqData.stripe_secret
            
            let dd = {
                'json':JSON.stringify(credential),
                'updatedAt':moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.updateData(tableJson.paymentMethod,dd,{'type':'stripe_credential'}).then(async updtsetting=>{
                res.json({status:true,'message':'Stripe Credentials updated.'});
            }).catch(err2=>{
                res.json({status:false,'error':err2,'message':'Stripe Credentials not updated.'});
            });
        }
    }).catch(err=>{
        res.json({status:false,'error':err,'message':'Stripe Credentials not found.'});
    });
}