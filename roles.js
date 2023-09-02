// require common folder files.
const commonModel=require('../../common/commonModel');
const tableJson=require('../../common/table.json');

exports.getRoles=async(req, res)=> {
    if(req.session.adminId){
        await commonModel.selectData('id,description',tableJson.userRole,{'id':req.params.id}).then(getRoleData=>{
            res.json({status:true,'data':getRoleData[0]});
        }).catch(err=>{
            res.json({status:false,message:'Roles not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}