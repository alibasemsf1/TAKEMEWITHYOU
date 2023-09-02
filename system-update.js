const commonController = require('../../common/commonController');
const commonModel = require('../../common/commonModel');
const tableJSon = require('../../common/table.json');
const categoryModel = require('../models/category');

const moment = require('moment');
var AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

var filePath, fileName, version;
var date = new Date();

exports.getSystemUpdatePage=async(req,res)=>{
    if(req.session.adminId){
        var seoJson = await commonController.basicSetting('seo_settings');
        if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
        var themeSettingJson = await commonController.themeSetting('theme_settings');
        
        var getSystemVersion = await categoryModel.selectData('version', tableJSon.systemInfo, 'order by id DESC LIMIT 1');
        
        res.render('admin/views/system-update',{'seoJson':seoJson,'themeSettingJson':themeSettingJson,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole,'pathName':'System Update', 'version' : getSystemVersion[0].version});
    }else{
        res.redirect('/admin/');
    }
}

exports.uploadZip=async(req,res)=>{
    let getVersion = req.file.originalname.split(')')[0];
    version = getVersion.split('(')[1];
    fileName = req.file.filename;
    filePath = req.file.path;
    await commonModel.selectData('id',tableJSon.systemInfo,{'version':version}).then(async result=>{
        if(result.length>0){
            let data = {
                'version':version,
                'name':fileName,
                'status':1,
                'updatedAt': moment(date).format('YYYY-MM-DD HH:mm:ss')
            }
            let updtSystemInfo = await commonModel.updateData(tableJSon.systemInfo,data,{'version':version});
            if(updtSystemInfo){
                res.json({status:true,'message':'Zip uploaded successfully.'});
            }else{
                res.json({status:false,'message':'Zip not uploaded.'});
            }
        }else{
            let newData = {
                'version':version,
                'name':fileName,
                'status':1,
                'createdAt': moment.utc(date).format('YYYY-MM-DD HH:mm:ss'),
                'updatedAt': moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
            }
            let addSystemInfo = await commonModel.insertData(tableJSon.systemInfo,newData);
            if(addSystemInfo){
                res.json({status:true,'message':'Zip uploaded successfully.'});
            }else{
                res.json({status:false,'message':'Zip not uploaded.'});
            }
        } 
    }).catch(err1=>{
        res.json({status:false,'error':err1,'message':'System Information not found'});
    });   
}

exports.updateNewVersion=async(req,res)=>{
    try {
        var zip = new AdmZip(filePath);
        var zipEntries = zip.getEntries();

        zipEntries.forEach(function(zipEntry) {
            console.log(zipEntry.data);
            if (zipEntry.entryName == "my_file.txt") {
                console.log(zipEntry.getData().toString('utf8')); 
            }
        });

        console.log("Extracting zip files...");
        zip.extractAllTo(path.join(__dirname,'../../'), true);
    } catch(err) {
        res.json({status:false,'error':err,'message':'System not updated.'});
    }  
}
