const commonController = require('../../common/commonController');
const tableJson = require('../../common/table.json');
const commonModel = require('../../common/commonModel');

const categoryModel = require('../models/category');
const customerModel = require('../models/customer');

const moment = require('moment');
var sendMail

exports.customerQueryPage = async(req,res)=>{
    if(req.session.adminId){
        await categoryModel.selectData('count(id) as queryCount',tableJson.customerQuery,'').then(async result=>{
            var seoJson = await commonController.basicSetting('seo_settings');
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
        
            res.render('admin/views/customer-query',{'queries':result[0].queryCount,'seoJson':seoJson,'themeSettingJson':themeSettingJson,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole, 'pathName':'Customer Query'});
        }).catch(err=>{
            res.json({status:false, 'error':err});
        })
    }else{
        res.redirect('/admin/');
    }
}

exports.searchCustomerQuery=async(req,res)=>{
    if(req.session.adminId){
        let where ;
        if(req.query.search.value){
            where = `WHERE fname like '%${req.query.search.value}%' OR lname like '%${req.query.search.value}%' OR email like '%${req.query.search.value}%' OR phone like '%${req.query.search.value}%' OR message like '%${req.query.search.value}%' OR createdAt like '%${req.query.search.value}%' order by id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }else{
            where = `order by id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }
        
        await customerModel.getQueryData(where).then(async queries=>{ 
            let totalQuery = await categoryModel.selectData('count(id) as queryCount',tableJson.customerQuery,'');
            
            let array=[], index= (req.query.start==0) ? 1 : parseInt(req.query.start)+1,recordsFiltered;
            let queryReplied='',dd='not replied';
            for await (let q of queries){
                if(q.replied==1){
                    dd = 'replied';
                    queryReplied = ''
                }  
                let msg = (q.message) ? ( (q.message.length > 80) ? commonController.entities(q.message.substr(0,80)+' <a class="ad_link_text show_more_msg" href="javascript:;" query-id="'+q.id+'">show more</a>') : commonController.entities(q.message)): '-';
                array.push({
                    'index':index,
                    'date':moment(q.createdAt).format('YYYY-MM-DD'),
                    'sender':q.fname +' '+ q.lname,
                    'email':q.email,
                    'phone': q.phone,
                    'message':msg,
                    'status': dd,
                    'action':`<span class="ad_edit reply_query" query-id="${q.id}" ${queryReplied}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="cls-1" d="M1427.81,414.5l-3.3-3.3a0.636,0.636,0,0,0-.9,0l-10.38,10.371a0.7,0.7,0,0,0-.17.3l-1.04,4.366a0.639,0.639,0,0,0,.62.787,0.7,0.7,0,0,0,.15-0.017l4.36-1.044a0.628,0.628,0,0,0,.3-0.17l10.36-10.393A0.637,0.637,0,0,0,1427.81,414.5Zm-13.26,7.555,7.07-7.065,0.75,0.75-7.06,7.072Zm-0.53,1.278,1.67,1.668-2.19.524Zm2.95,1.14-0.76-.758,7.07-7.072,0.74,0.751Zm7.96-7.984-2.4-2.4,1.53-1.534,2.4,2.4Z" transform="translate(-1412 -411.031)"></path></svg><div class="ad_tooltip_dv"><p>send mail</p></div></span>`
                });
                index++; 
            }
            
            if(array.length>0){
                recordsFiltered=totalQuery[0].queryCount
            }else{
                recordsFiltered=array.length
            }
            res.json({status:true,'data':array, 'recordsTotal':totalQuery[0].queryCount,'recordsFiltered':recordsFiltered});
        }).catch(err=>{
            res.json({status:false,'error':err,'message':'Tax not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.CustomerDetail=async(req,res)=>{
    await commonModel.selectData('id,fname,lname,email',tableJson.customerQuery,{'id':req.params.id}).then(async result=>{
        res.json({status:true,'data':result[0]})
    }).catch(err=>{
        res.json({status:false,'error':err,'message':'Customer not found.'})
    })
}

exports.sendMailToCustomer=async(req,res)=>{
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
                    mailSettings[0].jsonData.subject= 'Responding to Your Enquiry about '+themeSettingJson.theme_name+'.';
                    let message = req.body.message.replace(/\n/g, '<br>');
                    let m =  await sendMail(req.body.email, '','',themeSettingJson, mailSettings[0].jsonData,'',message);
                    if(m.messageId){
                        await commonModel.updateData(tableJson.customerQuery,{'replied':1},{'id':req.params.id}).then(async result=>{
                            res.json({status:true,message:'Email has been sent successfully.'});
                        }).catch(err=>{
                            res.json({status:false,message:'Email has not been sent successfully.'});
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

exports.showMoreMsgData=async(req,res)=>{
    await commonModel.selectData('id,message',tableJson.customerQuery,{'id':req.body.id}).then(async msgData=>{
        if(msgData[0].message) msgData[0].message = commonController.entities(msgData[0].message);
        res.send({status:true, 'data':msgData[0]});
    }).catch(err=>{
        res.send({status:false, message:'Product not found.'});
    });
}