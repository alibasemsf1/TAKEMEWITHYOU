// require common folder files.
const commonModel=require('../../common/commonModel');
const commonController=require('../../common/commonController');
const tableJson=require('../../common/table.json');
const settings = require('../../config/settings.json');

// require current folder models.
const categoryModel=require('../models/category');

// require modules.
const md5=require('md5');
const moment=require('moment');

var dateTime = new Date(),sendMail;

exports.getUsers=async(req, res)=> {
    if(req.session.adminId){
        await commonModel.selectData('id,name','hd_user_roles','').then(async allRoles=>{
            let allUserLength = await categoryModel.selectData('count(id) as userLength',tableJson.users,'where access_level=0');
            var seoJson = await commonController.basicSetting('seo_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            
            res.render('admin/views/users',{'users':allUserLength[0].userLength,'roles':allRoles,'seoJson':seoJson,'themeSettingJson':themeSettingJson,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole,'pathName':'User Management'});
        }).catch(err=>{
            res.json({status:false,'error':err,'message':'Roles not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.addUsers=async(req, res)=>{
    await commonModel.selectData('id,email',tableJson.users,{email:req.body.email}).then(async findUser=>{
        if(findUser.length==0){
            let findRoleName=await commonModel.selectData('id,name',tableJson.userRole,{id:req.body.role});
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            let mailSettings ;
            // check SMTP API is exists or not.
            let smtpExists = await commonController.checkFolderExistance('./smtp');
            if(smtpExists==1){
                let statusCheckAddOn = await commonModel.selectData('status',tableJson.addon,{'name':'smtp'});
                if(statusCheckAddOn.length>0){
                    if(statusCheckAddOn[0].status==1){
                        mailSettings = await commonModel.selectData('jsonData',tableJson.settings,{'type':'smtp_settings'});
                        sendMail = require('../../smtp/mailapi');
                        if(mailSettings.length>0){
                            mailSettings[0].jsonData = JSON.parse(mailSettings[0].jsonData);
                            mailSettings[0].jsonData.subject= 'Welcome to '+themeSettingJson.theme_name+'.';
                            let m =  await sendMail(req.body.email, req.body.password,findRoleName[0].name,themeSettingJson, mailSettings[0].jsonData,settings.admin_basic_URL,'');
                            if(m.messageId){
                                const userData = {
                                    'fname':req.body.fname,
                                    'lname':req.body.lname,
                                    'email':req.body.email,
                                    'password':md5(req.body.password),
                                    'access_level':0,
                                    'role':findRoleName[0].name,
                                    'createdAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss'),
                                    'updatedAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss')
                                }
                                await commonModel.insertData(tableJson.users,userData).then(async addUser=>{
                                    res.json({status:true,message:'User added successfully.'});
                                }).catch(err=>{
                                    res.json({status:false,message:'User not added.'});
                                });
                            }else{
                                res.json({status:false, message:'We are not able to send email now, please try after sometime!'});
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
            res.json({status:false, message:'User is already exists...Try another.'});
        }
    }).catch(err=>{
        res.json({status:false,'error':err, message:'Users not found.'});
    });
}

exports.editUser=async(req,res)=>{
    await commonModel.selectData('id,fname,lname,email,status,role',tableJson.users,{id:req.params.id}).then(async result=>{
        var userArray=[];
        for await(let u of result){
            userArray.push({
                ...u,
                role_id:await getRoleId(u.role)
            })
        }
        res.json({status:true,data:userArray})
    }).catch(err=>{
        res.json({status:false,message:'User not found.'})
    });
}

exports.updateUser=async(req,res)=>{
    let findRoleName=await commonModel.selectData('id,name',tableJson.userRole,{id:req.body.role});
    var themeSettingJson = await commonController.themeSetting('theme_settings');
    var postData;
    if(req.body.password!=''){
        postData={
            'fname':req.body.fname,
            'lname':req.body.lname,
            'email':req.body.email,
            'password':md5(req.body.password),
            'role':findRoleName[0].name,
            'updatedAt':moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
        }
    }else{
        postData={
            'fname':req.body.fname,
            'lname':req.body.lname,
            'email':req.body.email,
            'role':findRoleName[0].name,
            'updatedAt':moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
        }
    }
    let mailSettings ;
    // check SMTP API is exists or not.
    let smtpExists = await commonController.checkFolderExistance('./smtp');
    if(smtpExists==1){
        let statusCheckAddOn = await commonModel.selectData('status',tableJson.addon,{'name':'smtp'});
        if(statusCheckAddOn.length>0){
            if(statusCheckAddOn[0].status==1){
                mailSettings = await commonModel.selectData('jsonData',tableJson.settings,{'type':'smtp_settings'});
                sendMail = require('../../smtp/mailapi');
                if(mailSettings.length>0){
                    mailSettings[0].jsonData = JSON.parse(mailSettings[0].jsonData);
                    mailSettings[0].jsonData.subject= 'Your '+themeSettingJson.theme_name+' Password updated successfully.';
                    let m =  await sendMail(req.body.email, req.body.password,findRoleName[0].name,themeSettingJson, mailSettings[0].jsonData,settings.admin_basic_URL,'');
                    console.log(m);
                    if(m.messageId){
                        await commonModel.updateData(tableJson.users,postData,{id:req.params.id}).then(async result=>{
                            res.json({status:true,message:'User updated successfully.'});
                        }).catch(err=>{
                            res.json({status:false,message:'User not updated.'});
                        });
                    }else{
                        res.json({status:false, message:'We are not able to send email now, please try after sometime!'});
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
}

async function getRoleId(name){
    var roleId = await commonModel.selectData('id',tableJson.userRole,{name:name});
    return roleId[0].id;
}

exports.searchUser=async(req, res)=>{
    if(req.session.adminId){
        let where ;
        if(req.query.search.value){
            where = `where access_level = 0 AND (fname LIKE '%${req.query.search.value}%' OR lname LIKE '%${req.query.search.value}%' OR email LIKE '%${req.query.search.value}%' OR role LIKE '%${req.query.search.value}%') order by id DESC LIMIT 10 OFFSET ${req.query.start}`;
        }else{
            where = `where access_level = 0 order by id DESC LIMIT 10 OFFSET ${req.query.start}`;
        }
        
        await categoryModel.selectData('id,fname,lname,email,password,status,role',tableJson.users,where).then(async allUsers=>{
            let allUserLength = await categoryModel.selectData('count(id) as userLength',tableJson.users,'where access_level=0');
            let array=[], index= (req.query.start==0) ? 1 : parseInt(req.query.start)+1, recordsFiltered;
            for await (let au of allUsers){
                let status = (au.status==0 || au.status==1) ? 'checked=""' : '';
                let action = `<span class="ad_edit hd_edit_user" user-id="${au.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="cls-1" d="M1427.81,414.5l-3.3-3.3a0.636,0.636,0,0,0-.9,0l-10.38,10.371a0.7,0.7,0,0,0-.17.3l-1.04,4.366a0.639,0.639,0,0,0,.62.787,0.7,0.7,0,0,0,.15-0.017l4.36-1.044a0.628,0.628,0,0,0,.3-0.17l10.36-10.393A0.637,0.637,0,0,0,1427.81,414.5Zm-13.26,7.555,7.07-7.065,0.75,0.75-7.06,7.072Zm-0.53,1.278,1.67,1.668-2.19.524Zm2.95,1.14-0.76-.758,7.07-7.072,0.74,0.751Zm7.96-7.984-2.4-2.4,1.53-1.534,2.4,2.4Z" transform="translate(-1412 -411.031)"></path></svg><div class="ad_tooltip_dv"><p>Edit</p></div></span>`
                
                array.push({
                    'index':index,
                    'name':au.fname +' '+au.lname,
                    'email':au.email,
                    'role':au.role,
                    'action':`<div class="ad_status_autoresponder" data-toggle="tooltip" title="Status"><label class="ad_status_toggle_label"><input type="checkbox" name="check_user_status" user-id="${au.id}" ${status}><div class="ad_status_user_check"><span></span></div></label></div>`+ action,
                });
                index++;
            }
            if(array.length>0){
                recordsFiltered=allUserLength[0].userLength
            }else{
                recordsFiltered=array.length
            }

            res.json({status:true,'data':array, 'recordsTotal':allUserLength[0].userLength,'recordsFiltered':recordsFiltered});
        }).catch(err=>{
            res.json({status:false,'error':err,message:'Product not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.userStatusChange=async(req,res)=>{
    var customerData = {
        'status':req.body.status,
        'updatedAt':moment(dateTime).format("YYYY-MM-DD HH:mm:ss")
    }
    var wh = {'id' : req.body.id}
    await commonModel.updateData(tableJson.users,customerData,wh).then(async addUser=>{
        res.send({status:true, message:'User status changed successfully.'});
    }).catch(err=>{
        res.send({status:false, message:'User status not changed.'});
    });
}