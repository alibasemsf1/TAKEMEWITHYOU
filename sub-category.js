// require commonb folder files.
const commonModel=require('../../common/commonModel');
const commonController=require('../../common/commonController');
const tableJson=require('../../common/table.json');

// require current folder model.
const categoryModel=require('../models/category');

// require modules.
const moment=require('moment');
var dateTime = new Date();

exports.getSubCategory=async(req, res)=> {
    if(req.session.adminId){ 
        await categoryModel.selectData('id,title',tableJson.category,'where status=1 order by id desc').then(async allCategory=>{
            await categoryModel.selectData('count(id) as subCategoryLength',tableJson.subCategory,'').then(async subCategory=>{
                var seoJson = await commonController.basicSetting('seo_settings');
                if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
                var themeSettingJson = await commonController.themeSetting('theme_settings');
                
                res.render('admin/views/sub-category',{'subCategory':subCategory[0].subCategoryLength,'categoryData':allCategory,'seoJson':seoJson,'themeSettingJson':themeSettingJson,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole,'pathName':'Sub Category'});
            }).catch(err=>{
                res.json({status:false,message:'Sub Category not found'})
            });
        }).catch(err=>{
            res.json({status:false,message:'All Category not found'})
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.addSubCategory=async(req,res)=>{
    const subCategory = {
        title:req.body.title,
        category_id:req.body.category_id,
        createdAt:moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt:moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss')
    }
    await commonModel.insertData(tableJson.subCategory,subCategory).then(async addSubCategory=>{
        res.json({status:true,message:'Sub Category added successfully.'})
    }).catch(err=>{
        res.json({status:false,message:'Sub Category not added.'})
    });
}

exports.getAllCategory=async(req, res)=> {
    await commonModel.selectData('id,title',tableJson.category,'').then(async allCategory=>{
        res.json({status:true,categoryData:allCategory})
    }).catch(err=>{
        res.json({status:false,message:'All Category not found'})
    });
}

exports.editSubCategory=async(req,res)=>{
    await commonModel.selectData('id,title,category_id',tableJson.subCategory,{id:req.params.id}).then(async result=>{
        res.json({status:true,data:result})
    }).catch(err=>{
        res.json({status:false,message:'Category not deleted.'})
    });
}

exports.updateSubCategory=async(req,res)=>{
    var postData={
        title:req.body.title,
        category_id:req.body.category_id,
        updatedAt:moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
    }
    await commonModel.updateData(tableJson.subCategory,postData,{id:req.params.id}).then(async result=>{
        res.json({status:true,message:'Sub Category updated successfully.'})
    }).catch(err=>{
        res.json({status:false,message:'Sub Category not updated.'})
    });
}

exports.searchSubCategory=async(req, res)=>{
    if(req.session.adminId){
        let where ;
        if(req.query.search.value){
            where = `as sc LEFT JOIN ${tableJson.category} as c ON c.id=sc.category_id where sc.title LIKE '%${req.query.search.value}%' OR c.title LIKE '%${req.query.search.value}%' ORDER BY id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }else{
            where = `as sc LEFT JOIN ${tableJson.category} as c ON c.id=sc.category_id order by id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }
        
        await categoryModel.selectData('sc.id, sc.title, sc.status,c.title as categoryTitle',tableJson.subCategory,where).then(async subCategory=>{
            let allSubCategoryLength = await categoryModel.selectData('count(id) as subCategoryLength',tableJson.subCategory,'');
            let array=[], index= (req.query.start==0) ? 1 : parseInt(req.query.start)+1, recordsFiltered;
            for await (let sc of subCategory){
                let status = (sc.status==1) ? 'checked=""' : '';
                let action = `<span class="ad_edit hd_subcat_edit" scat-id="${sc.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path class="cls-1" d="M1427.81,414.5l-3.3-3.3a0.636,0.636,0,0,0-.9,0l-10.38,10.371a0.7,0.7,0,0,0-.17.3l-1.04,4.366a0.639,0.639,0,0,0,.62.787,0.7,0.7,0,0,0,.15-0.017l4.36-1.044a0.628,0.628,0,0,0,.3-0.17l10.36-10.393A0.637,0.637,0,0,0,1427.81,414.5Zm-13.26,7.555,7.07-7.065,0.75,0.75-7.06,7.072Zm-0.53,1.278,1.67,1.668-2.19.524Zm2.95,1.14-0.76-.758,7.07-7.072,0.74,0.751Zm7.96-7.984-2.4-2.4,1.53-1.534,2.4,2.4Z" transform="translate(-1412 -411.031)"></path></svg><div class="ad_tooltip_dv"><p>Edit</p></div></span>`
                array.push({
                    'index':index,
                    'name':sc.title,
                    'category':sc.categoryTitle,
                    'action':`<div class="ad_status_autoresponder" data-toggle="tooltip" title="Status"><label class="ad_status_toggle_label"><input type="checkbox" name="sub_category_status" sub-category-id="${sc.id}" ${status}><div class="ad_status_user_check"><span></span></div></label></div>` + action
                });
                index++;
            }
            if(array.length>0){
                recordsFiltered=allSubCategoryLength[0].subCategoryLength
            }else{
                recordsFiltered=array.length
            }
            res.json({status:true,'data':array, 'recordsTotal':allSubCategoryLength[0].subCategoryLength,'recordsFiltered':recordsFiltered});
        }).catch(err=>{
            res.json({status:false,'error':err,message:'Product not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.subCategoryStatusChange=async(req,res)=>{
    var statusChange = {
        'status':req.body.status,
        'updatedAt':moment(dateTime).format("YYYY-MM-DD HH:mm:ss")
    }
    var wh = {'id' : req.body.id}
    await commonModel.updateData(tableJson.subCategory,statusChange,wh).then(async catStatus=>{
        res.send({status:true, message:'Sub-category status changed successfully.'});
    }).catch(err=>{
        res.send({status:false, message:'Sub-category status not changed.'});
    });
}

async function title(id){
    var catTitle = await commonModel.selectData('title',tableJson.category,{id:id});
    return catTitle[0]
}