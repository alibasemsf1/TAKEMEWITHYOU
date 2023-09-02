// require common folder files. 
const commonModel = require('../../common/commonModel');
const commonController = require('../../common/commonController');
const tableJson = require('../../common/table.json');

// require current folder Models.
const categoryModel = require('../models/category');
const agencyModel = require('../models/agency');

// require modules.
const moment = require('moment');

var dateTime = new Date();

exports.getAgencyPage=async(req,res)=>{
    if(req.session.adminId){
        await categoryModel.selectData('count(id) as agency',tableJson.agency,'').then(async agencyCount=>{
            var seoJson = await commonController.basicSetting('seo_settings');
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
            
            res.render('admin/views/agency-manager',{'agency':agencyCount[0].agency,'seoJson':seoJson,'themeSettingJson':themeSettingJson,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole, 'pathName':'Agency Manager'});
        }).catch(err=>{
            res.json({status:false,'error':err,'message':'Tax not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.searchAgencyManager=async(req,res)=>{
    if(req.session.adminId){
        let where ;
        if(req.query.search.value){
            where = `where a.name like '%${req.query.search.value}%' OR mi.total_purchase_amount like '%${req.query.search.value}%' OR mi.due_amount like '%${req.query.search.value}%' group by a.id order by a.id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }else{
            where = `group by a.id order by a.id DESC LIMIT ${req.query.length} OFFSET ${req.query.start}`;
        }
        
        await agencyModel.selectData(where).then(async agency=>{ 
            let totalAgency = await categoryModel.selectData('count(id) as agency',tableJson.agency,'');
            let array=[], index= (req.query.start==0) ? 1 : parseInt(req.query.start)+1,recordsFiltered;
            for await (let ap of agency){
                let paidAmount = await categoryModel.selectData('sum(total_paid_amount) as total_paid_amount',tableJson.ledger,'where agency_id ='+ap.id);

                let tpa = (ap.total_purchase_amount!=null) ? (ap.total_purchase_amount).toFixed(2) : 0;
                let tpaid = (paidAmount[0].total_paid_amount!=null) ? paidAmount[0].total_paid_amount : 0;
                let da = (ap.due_amount) ? ap.due_amount : 0;
                array.push({
                    'index':index,
                    'agency_name':ap.name,
                    'total_purchase_amount':tpa,
                    'total_paid_amount':tpaid,
                    'due_amount':parseFloat(da-tpaid).toFixed(2),
                    'view_ledger':`<a class="hd_btn view_ledger" href="/admin/get-view-ledger-data/${ap.id}" agency-id="${ap.id}">View Ledger</a>`,
                    'pay_amount':`<button class="hd_btn pay_amount" data-toggle="modal" agency-id="${ap.id}">Pay Amount</button>`
                });
                index++; 
            }

            if(array.length>0){
                recordsFiltered=totalAgency[0].agency
            }else{
                recordsFiltered=array.length
            }
            res.json({status:true,'data':array, 'recordsTotal':totalAgency[0].agency,'recordsFiltered':recordsFiltered});
        }).catch(err=>{
            res.json({status:false,'error':err,'message':'Tax not found.'});
        });
    }else{
        res.redirect('/admin/');
    }
}

exports.addAgencyData=async(req,res)=>{
    await commonModel.selectData('id',tableJson.agency,{'name':req.body.agencyName}).then(async findData=>{
        if(findData.length==0){
            let agencyData = {
                'name' : req.body.agencyName,
                'createdAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss'),
                'updatedAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss')
        
            }
            await commonModel.insertData(tableJson.agency,agencyData).then(async addAgency=>{
                res.json({status:true,'message':'Agency data added successfully.'});
            }).catch(err=>{
                res.json({status:false,'message':'Agency data not added.'});
            });
        }else{
            res.json({status:false, 'message':'This record is already exist.'});
        }
    }).catch(err=>{
        res.json({status:false,'error':err, 'message':'Agency data data not found.'});
    });
    
}

exports.getInvoiceNumber=async(req,res)=>{
    await commonModel.selectData('id,invoice_number,paid_amount',tableJson.invoice,{'agency_id':req.body.agency_id,'paid_amount':0}).then(async result=>{
        res.json({status:true,'data':result});
    }).catch(err=>{
        res.json({status:false,'error':err,'message':'Invoice not found.'});
    });
}

exports.priceThroughInvoice=async(req,res)=>{
    await commonModel.selectData('id,due_amount',tableJson.invoice,{'id':req.params.id}).then(async result=>{
        if(result.length>0){
            let checkDetails = await commonModel.selectData('sum(total_paid_amount) as total_paid_amount',tableJson.ledger,{'inv_id':result[0].id});
            if(checkDetails){
                result[0].due_amount = result[0].due_amount - checkDetails[0].total_paid_amount
                res.json({status:true,'data':result});
            }
        }
    }).catch(err=>{
        res.json({status:false,'error':err,'message':'Data not found.'});
    });
}
 
exports.addPayAmount=async(req,res)=>{
    await commonModel.selectData('id,agency_id,due_amount',tableJson.invoice,{'id':req.body.id}).then(async result=>{
        if(result){
            let postData = {
                'inv_id':req.body.id,
                'agency_id':result[0].agency_id,
                'total_paid_amount':parseInt(req.body.amount),
                'createdAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss'),
                'updatedAt':moment.utc(dateTime).format('YYYY-MM-DD HH:mm:ss')
            }
            await commonModel.insertData(tableJson.ledger,postData).then(async addLedgerData=>{
                let findDetails = await commonModel.selectData('sum(total_paid_amount) as total_paid_amount',tableJson.ledger,{'inv_id':req.body.id});
                
                if(findDetails[0].total_paid_amount >= result[0].due_amount){
                    let updt = await commonModel.updateData(tableJson.invoice,{'paid_amount': 1},{'id':req.body.id});
                }
                (addLedgerData) ? res.json({status:true,'message':'Payment successfull.'}) : res.json({status:true,'data':'Payment failed.'});
            }).catch(err1=>{
                res.json({status:false,'error':err1,'message':'Payment failed.'});
            });   
            
        }
    }).catch(err=>{
        res.json({status:false,'error':err,'message':'Invoice not found.'});
    }); 
}

exports.getViewLedgerData=async(req,res)=>{    
    if(req.session.adminId){
        let id = req.params.id, where = `where agency_id=${id} group by agency_id`;
        let fields = 'invoice_number, agency_id, createdAt, sum(total_purchase_amount) as total_purchase_amount, sum(due_amount) as due_amount';
        await categoryModel.selectData(fields,tableJson.invoice,where).then(async getLedgerData=>{
            var seoJson = await commonController.basicSetting('seo_settings');
            if(seoJson!='') seoJson.description=commonController.entities(seoJson.description);
            var themeSettingJson = await commonController.themeSetting('theme_settings');
            let ledgerArray = [];

            for await (let la of getLedgerData){
                let tpa = (la.total_purchase_amount!=null) ? la.total_purchase_amount : 0;
                let da = (la.due_amount!=null) ? la.due_amount : 0;
                
                la.total_purchase_amount = parseFloat(tpa).toFixed(2);
                la.due_amount = parseFloat(da).toFixed(2);
                la.createdAt = moment(la.createdAt).format('DD MMM YYYY');
                ledgerArray.push({
                    ...la,
                    'debitAmount' : await ledgerData(id, la.due_amount)
                });
            }
            
            res.render('admin/views/ledger',{'data':ledgerArray,'seoJson':seoJson,'themeSettingJson':themeSettingJson,'userName':req.session.adminname,'profile':req.session.adminprofile,'role':req.session.adminrole, 'pathName':'Ledger'});
        }).catch(err=>{
            res.json({status:false,'error':err,'message':'Tax not found.'});
        });    
    }else{
        res.redirect('/admin/');
    }
}

async function ledgerData(agency_id, due_amount){
    let amD = due_amount
    let ledgerDebitAmount = await categoryModel.selectData('total_paid_amount, updatedAt',tableJson.ledger,`where agency_id=${agency_id}`);
    let data = [];
    for await( let lda of ledgerDebitAmount ){
        amD = amD - lda.total_paid_amount
        lda['balance'] = parseFloat(amD).toFixed(2);
        lda.updatedAt = moment(lda.updatedAt).format('DD MMM YYYY');
        data.push({
            ...lda
        });
    }

    return data
}

