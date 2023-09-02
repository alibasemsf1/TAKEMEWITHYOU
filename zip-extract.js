const extract = require('extract-zip')
const fs = require('fs');
const StreamZip = require('node-stream-zip');
const Diff = require('diff');
const path = require('path');

const commonController = require('../../common/commonController');

var filePath, fileName, version;
var basicPath = path.join(__dirname,'../../')

exports.zipUploadTesting=async(req,res)=>{
    if(req.session.adminId){
        var seoJson = await commonController.basicSetting('seo_settings');
        if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
        var themeSettingJson = await commonController.themeSetting('theme_settings');
        res.render('admin/views/extract-zip',{'seoJson':seoJson,'themeSettingJson':themeSettingJson,'pathName':'Add-Ons zip upload'});
    }else{
        res.redirect('/admin/');
    }
}

exports.zipExtractHere=async(req,res)=>{
    fileName = req.file.originalname.split(')')[0];
    version = fileName.split('(')[1];
    fileName = fileName.split('(')[0];
    filePath = req.file.path;
    console.log(req.file);
    try {
        let searchPath = "./"+fileName;
        if (fs.existsSync(searchPath)) {
            fs.readdir('./'+fileName, async function (err, data) {
                if(err) console.log(err)
                let changes = 0;
                for(let i in data){
                    fs.readdir('./'+fileName+'/'+data[i], function (err1,data1) {
                        if (err1) console.log(err)
                        if(data[i]=='assets'||data[i]=='routes'||data[i]=='controllers'||data[i]=='models'||data[i]=='views'){
                            if(data[i]=='assets'){
                                for(let j in data1){
                                    fs.readdir('./'+fileName+'/'+data[i]+'/'+data1[j], function (err2,data2) {
                                        if (err2) res.json({status:false,'error2':err2});
                                        for(let k in data2){
                                            let path = './'+fileName+'/'+data[i]+'/'+data1[j]+'/'+data2[k];
                                            fs.readFile(path, 'utf8', function (error,readData) {
                                                if (error) res.json({status:false,'error':error});
                                                let path1 = basicPath+req.file.path;
                                                const zip = new StreamZip({ file: path1,storeEntries: true });
                                                zip.on('ready', async() => {
                                                    for (const entry of Object.values(zip.entries())) {
                                                        if(!entry.isDirectory){
                                                            let checkPath = fileName+'/'+data[i]+'/'+data1[j]+'/'+data2[k];
                                                            if(checkPath == entry.name){
                                                                let entryPath = entry.name
                                                                let zipDotTxtContents = zip.entryDataSync(entryPath).toString('utf8');
                                                                fs.writeFile(path, zipDotTxtContents, (err)=>{
                                                                    if(err) res.json({status:false,'error':err});
                                                                });
                                                            }
                                                        }
                                                    }
                                                    zip.close();
                                                });
                                            });
                                        }
                                    })
                                }
                            }else{
                                console.log('iii');
                                for(let x in data1){
                                    let path = './'+fileName+'/'+data[i]+'/'+data1[x];
                                    fs.readFile(path, 'utf8', function (err3,data3) {
                                        if (err3) console.log(err3);
                                        let path1 = basicPath+req.file.path;
                                        const zip = new StreamZip({ file: path1,storeEntries: true });
                                        zip.on('ready', async() => {
                                            for (const entry of Object.values(zip.entries())) {
                                                if(!entry.isDirectory){
                                                    let checkPath = fileName+'/'+data[i]+'/'+data1[x];
                                                    if(checkPath == entry.name){
                                                        let entryPath = entry.name
                                                        let zipDotTxtContents = zip.entryDataSync(entryPath).toString('utf8');
                                                        fs.writeFile(path, zipDotTxtContents, (err)=>{
                                                            if(err) console.log(err);
                                                        });
                                                    }
                                                } 
                                            }
                                            zip.close();
                                        });
                                    });
                                }
                            }
                        }else{
                            if(data1==undefined){
                                let path = './'+fileName+'/'+data[i];
                                fs.readFile(path, 'utf8', function (err3,data3) {
                                    if (err3) console.log(err3);
                                    let path1 = basicPath+req.file.path;
                                    const zip = new StreamZip({ file: path1,storeEntries: true });
                                    zip.on('ready', async() => {
                                        for (const entry of Object.values(zip.entries())) {
                                            if(!entry.isDirectory){
                                                let checkPath = fileName+'/'+data[i];
                                                if(checkPath == entry.name){
                                                    let entryPath = entry.name
                                                    let zipDotTxtContents = zip.entryDataSync(entryPath).toString('utf8');
                                                    fs.writeFile(path, zipDotTxtContents, (err)=>{
                                                        if(err) console.log(err);
                                                    });
                                                }
                                            }    
                                        }
                                        zip.close();
                                    });
                                });
                            }
                        }
                    });
                    if((data.length-1) == i){
                        changes = 1;
                    }
                }
                if(changes==1){
                    res.json({status:true,'message':'Zip extracted successfully.'});
                }else{
                    res.json({status:false,'message':'Zip not extracted.'});
                }
            });
        }else{
            let checkFolderExists = 0;
            let target = basicPath;
            const zip = new StreamZip({ file: target+req.file.path,storeEntries: true });
            zip.on('ready', async() => {
                for (const entry of Object.values(zip.entries())) {
                    let name = entry.name;
                    if(entry.isDirectory){
                        if(name==fileName+'/assets/'||name==fileName+'/routes/'||name==fileName+'/controllers/'||name==fileName+'/models/'||name==fileName+'/views/'){
                            checkFolderExists = 1;
                        }
                    }else{
                        if(fileName=='smsApi' || fileName=='smtp'){
                            checkFolderExists = 1;
                        }
                    }
                }
                if(checkFolderExists == 1){
                    await extract(target+req.file.path, { dir: target});
                    res.json({status:true,'message':'Zip extracted successfully.'});
                }else{
                    res.json({status:false,'message':'Zip not extracted.'});
                }
                zip.close();
            });
        }
    } catch (err) {
        res.json({status:false,'error':err,'message':'Zip not extracted.'});
    }
}

exports.addAdditionalData=async(req,res)=>{
    if(filePath!=undefined){
        fs.unlinkSync(filePath);
    }
    let path = './config/route.js';
    let routeRepD, useRepD, loopComplete = 0;
    if(fileName != 'smsApi' && fileName != 'smtp'){
        fs.readFile(path, 'utf8', function (error,readData) {
            if(error) console.log('error1 : ',error);
            let arr = readData.split('}');
            arr.forEach((line, idx)=> {
                if(!line.includes(fileName+" : require('../"+fileName+"/routes/"+fileName+"')")){
                    if(line.includes("const route = {")){
                        routeRepD = line;
                        line += ',\n';
                        line += fileName+" : require('../"+fileName+"/routes/"+fileName+"')\n";
                        readData = readData.replace(routeRepD, line);
                    }
                }
                if(!line.includes("'/"+fileName+"' : route."+fileName)){
                    if(line.includes("const appUse = {")){
                        useRepD = line;
                        line += ',\n';
                        line += "'/"+fileName+"' : route."+fileName+"\n";
                        readData = readData.replace(useRepD, line);
                    }
                }
                if((arr.length-1) == idx){
                    loopComplete = 1;
                }
            });
            if(loopComplete==1){
                fs.writeFile(path, readData, (err)=>{
                    if(err) res.json({status:false,'error':err});
                    res.json({status:true,'message':'zip deleted.','file':fileName,'version':version});
                });
            }else{
                res.json({status:false,'message':'zip not deleted.'});
            }
        });
    }else{
        res.json({status:true,'message':'zip deleted.','file':fileName,'version':version});
    }
}
  