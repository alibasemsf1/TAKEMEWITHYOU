$(document).ready(function(){
    let columns = [
        { "data" : "index" },
        { "data" : "name" },
        { "data" : "category" },
        { "data" : "action" }
      ], 
      url = '/admin/sub-category-search', method = 'GET' ;
    dataTable(url, method, columns); 

    // change sub-category on change of category.
    $(document).on('change','.hd_cat_data, .hd_edit_sub_data',function(){
        if($(this).val()){
            if($('.hd_subcat_title').attr('disabled')){
                $('.hd_subcat_title').removeAttr('disabled');
            }
        }else{
            $('.hd_subcat_title').attr('disabled','');
        }
    });

    //add sub Category
    $(document).on('click','.save_sub_category',function(){
        let title = $('.hd_subcat_title').val();
        let category_id = $('.hd_cat_data').val();
        if(commonValidationFunction('hd_add_sc_valid')==true){
            $('.ad_loader').show();
            $.post('/admin/add-subcategory',{title:title,category_id:category_id},function(response){
                if(response.status==true){
                    $('.close_sub_category').click();
                    toastr('success',response.message);
                    setTimeout(function(){
                        location.reload();
                        reloadDataTable();
                    },1500);
                }else{
                    $('.ad_loader').hide();
                    toastr('error',response.message);
                }  
            });
        }
    });

    //close sub category popup
    $(document).on('click','.close_sub_category, .close_sc_modal',function(){
        $('.hd_cat_data').val('').select2();
        $('.hd_subcat_title').val('');
        $('.hd_subcat_title').attr('disabled','');
    })

    //edit sub category
    $(document).on('click','.hd_subcat_edit',function(){
        let id = $(this).attr('scat-id');
        $('#editSubCategory').modal('show');
        $.get('/admin/edit-sub-category/'+id,function(response){
            if(response.status==true){
                $('.hd_edit_sub_title').val(response.data[0].title);
                $('.hd_edit_sub_data').val(response.data[0].category_id).select2();
                $('.update_sub_category').attr('scat-id',response.data[0].id);
            }
        });
    });

    //update sub category 
    $(document).on('click','.update_sub_category',function(){
        let id = $(this).attr('scat-id');
        let title = $('.hd_edit_sub_title').val();
        let category_id = $('.hd_edit_sub_data').val();
        if(commonValidationFunction('hd_edit_sc_valid')==true){
            $('.ad_loader').show();
            $.post('/admin/update-sub-category/'+id,{title:title,category_id:category_id},function(response){
                if(response.status==true){
                    $('.close_popup').click();
                    toastr('success',response.message)
                    setTimeout(function(){
                        reloadDataTable();
                        $('.ad_loader').hide();
                    },1500);
                }else{
                    $('.ad_loader').hide();
                    toastr('error',response.message);
                }
            });
        }
    });

    // change sub-category status.
    $(document).on('click','input[name="sub_category_status"]',function(){
        let id = $(this).attr('sub-category-id'), status;
        if($(this).attr('checked')){
            $(this).removeAttr('checked');
            $(this).attr('status', 0);
        }else{
            $(this).attr('checked','');
            $(this).attr('status', 1);
        }
        $.post('/admin/subcategory-status-change',{'id':id,'status':$(this).attr('status')},function(response){
            if(response.status==true){
                toastr('success',response.message);
            }else{
                toastr('error',response.message);
            }
        });
    });
});
