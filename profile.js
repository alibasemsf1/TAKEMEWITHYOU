// require common folder files.
const tableJson=require('../../common/table.json');
const commonModel = require('../../common/commonModel');
const commonController = require('../../common/commonController');

// require modules.
const md5 = require('md5');

exports.getProfile=async(req, res)=> {
    if(req.session.adminId){
        await commonModel.selectData('id,fname,lname,email,profile,phone,role',tableJson.users,{'id':req.session.adminId}).then(async result=>{
            var seoJson = await commonController.basicSetting('seo_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            res.render('admin/views/profile',{'user':result[0],'seoJson':seoJson,'themeSettingJson':themeSettingJson,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole, 'pathName':'Profile'});
        }).catch(err=>{
            res.json({status:false,'error':err,'message':'User details not found.'})
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.profileImage=async(req,res)=>{
    let profileImage = {
        'profile':req.file.filename
    }
    
    req.session.adminprofile = req.file.filename
    await commonModel.updateData(tableJson.users,profileImage,{id:req.params.id}).then(async updtData=>{
        res.json({status:true,message:'Profile image updated.'});
    }).catch(err=>{
        res.json({status:false,message:'Profile image not updated.'});
    });
}

exports.updateProfile=async(req,res)=>{
    let userDetails
    if(req.body.password!=''){
        userDetails = {
            'fname':req.body.fname,
            'lname':req.body.lname,
            'email':req.body.email,
            'phone':req.body.phone,
            'password':md5(req.body.password)
        }
    }else{
        userDetails = {
            'fname':req.body.fname,
            'lname':req.body.lname,
            'email':req.body.email,
            'phone':req.body.phone
        }
    }
    req.session.adminname = req.body.fname+' '+req.body.lname;
    await commonModel.updateData(tableJson.users,userDetails,{id:req.params.id}).then(async updtData=>{
        res.json({status:true,message:'Profile updated.'})
    }).catch(err=>{
        res.json({status:false,message:'Profile not updated.'})
    });
}