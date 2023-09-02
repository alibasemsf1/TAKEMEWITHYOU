// require common folder files. 
const commonModel = require('../../common/commonModel');
const commonController = require('../../common/commonController');
const tableJson=require('../../common/table.json');
const settings = require('../../config/settings.json');

// require modules.
const md5 = require('md5');
const moment = require('moment');
const crypto = require('crypto');

var dateTime = new Date(), sendMail;

exports.getLogin= async(req, res) =>{
    if(req.session.adminId){
        res.redirect('/admin/dashboard');
    }else{
        var cJson = {};
        var seoJson = await commonController.basicSetting('seo_settings');
        if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
        var themeSettingJson = await commonController.themeSetting('theme_settings');
        if(req.headers.cookie){
            var c=req.headers.cookie.split(';')
            for (var i = 0; i < c.length; i++) {
                var t = c[i].split("=");
                if (t.length && t.length >= 2) {
                    var k = t[0].trim(),
                    v = t[1].trim();
                    cJson[k]=v
                }
            }
        }
        if(cJson.admin_email && cJson.admin_password){
            cJson.admin_email=decodeURIComponent(cJson.admin_email)
            cJson.admin_password= decrypt(cJson.admin_password)
            res.render('admin/views/login',{'email':cJson.admin_email,'password':cJson.admin_password,'seoJson':seoJson,'themeSettingJson':themeSettingJson, 'pathName':'Login'})
        }else{
            res.render('admin/views/login',{'email':'','password':'','seoJson':seoJson,'themeSettingJson':themeSettingJson, 'pathName':'Login'})
        }
    }
}

exports.postLogin= async(req, res) =>{
    var email = req.body.email
    var password =req.body.password
    await commonModel.selectData('id,fname,lname,email,password,profile,status,access_level,role',tableJson.users,{'email':email}).then(async findCustomer=>{
        if(findCustomer.length>0){
            if(findCustomer[0].status!=2){
                if(findCustomer[0].password== md5(password)){
                    if(req.body.remember_me!='null'){
                        res.cookie('admin_email',email);
                        res.cookie('admin_password',encrypt(password));
                    }
                    var customerData = {
                        status:1,
                        'updatedAt':moment(dateTime).format("YYYY-MM-DD HH:mm:ss")
                    }
                    var wh = {id : findCustomer[0].id}
                    await commonModel.updateData(tableJson.users,customerData,wh).then(addUser=>{
                        req.session.loggedIn=true;
                        req.session.adminal = findCustomer[0].access_level;
                        req.session.adminrole = findCustomer[0].role;
                        req.session.adminId=findCustomer[0].id;
                        if(findCustomer[0].profile!='') req.session.adminprofile=findCustomer[0].profile;
    
                        req.session.adminname=req.session.adminname=findCustomer[0].fname;
                        
                        res.send({status:true, message:'Login successfully.'});
                    }).catch(err1=>{
                        res.send({status:false, message:'Login failed.'});
                    });
                }else{
                    res.json({status:false,message:'Password not matched.'});
                }
            }else{
                res.json({status:false,message:'You are not authorized to login please contact to admin.'});
            }
        }else{
            res.json({status:false,message:'Your email address is not found.'})
        }
    }).catch(err=>{
        res.json({status:false,message:'User not found.'})
    });
}

exports.logout=async(req, res)=> {
    var customerData = {
        status:0,
        'updatedAt':moment(dateTime).format("YYYY-MM-DD HH:mm:ss")
    }
    var wh = {'id' : req.session.Id}
    await commonModel.updateData(tableJson.users,customerData,wh).then(addUser=>{
        req.session.destroy();
        res.redirect('/admin/');
    }).catch(err1=>{
        res.send({status:false, message:'Login failed.'});
    });
}

exports.getForgotPage= async(req, res) =>{
    var themeSettingJson = await commonController.themeSetting('theme_settings');
    var seoJson = await commonController.basicSetting('seo_settings');
    if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
    res.render('admin/views/forgot-password',{'themeSettingJson':themeSettingJson,'seoJson':seoJson, 'pathName':'Forgot Password'});
}

exports.postForgotPassword= async(req, res) =>{
    var email =  req.body.email;
    var newPassword = req.body.newPassword;
    await commonModel.selectData('id,email',tableJson.users,{'email':email}).then(async result=>{
        var themeSettingJson = await commonController.themeSetting('theme_settings');
        if(result.length>0){
            // check SMTP API is exists or not.
            let smtpExists = await commonController.checkFolderExistance('./smtp');
            if(smtpExists==1){
                let statusCheckAddOn = await commonModel.selectData('status',tableJson.addon,{'name':'smtp'});
                if(statusCheckAddOn.length>0){
                    if(statusCheckAddOn[0].status==1){
                        sendMail = require('../../smtp/mailapi');
                        let mailSettings = await commonModel.selectData('jsonData',tableJson.settings,{'type':'smtp_settings'});
                        if(mailSettings.length>0){
                            mailSettings[0].jsonData = JSON.parse(mailSettings[0].jsonData);
                            mailSettings[0].jsonData.subject= 'Your '+themeSettingJson.theme_name+' password has been changed.';
                            
                            let m = await sendMail(email, newPassword,'', themeSettingJson, mailSettings[0].jsonData, settings.admin_basic_URL,'');
                            if(m.messageId){
                                var postData = {
                                    'password':md5(newPassword),
                                    'updatedAt':moment(dateTime).format("YYYY-MM-DD HH:mm:ss")
                                }
                                await commonModel.updateData(tableJson.users,postData,{'id':result[0].id}).then(async updateData=>{
                                    res.json({status:true,'message':'Email has sent, Please check your email.'})
                                }).catch(err1=>{
                                    res.json({status:false,'message':'Password not updated','error':err1})
                                });
                            }else{
                                res.json({status:false,'message':'We are not able to send email now, please try after sometime!'})
                            }
                        }else{
                            res.json({status:false,'message':'SMTP details not found!'});
                        }
                    }else{
                        res.json({status:false,'message':'SMTP addon is disabled'});
                    }
                }else{
                    res.json({status:false,'message':'SMTP addon is disabled'});
                }
            }else{
                res.json({status:false,'message':'SMTP API not available.'});
            }
        }else{
            res.json({status:false,'message':'This email is not registered with us.'})
        }
    }).catch(err=>{
        res.json({status:false,'message':'Email not exists!!','error':err});
    });
}

function encrypt(password){
    var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq');
    var crypted = cipher.update(password,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(password){
    var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq');
    var dec = decipher.update(password,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

