$(document).ready(function(){
    if(window.location.pathname=='/admin/users'){
        let columns = [
            { "data" : "index" },
            { "data" : "name" },
            { "data" : "email" },
            { "data" : "role" },
            { "data" : "action" }
          ], 
          url = '/admin/user-search', method = 'GET' ;
        dataTable(url, method, columns);
    }else if(window.location.pathname=='/admin/unit'){
        let columns = [
            { "data" : "index" },
            { "data" : "name" },
            { "data" : "action" }
          ], 
          url = '/admin/unit-search', method = 'GET' ;
        dataTable(url, method, columns);
    }else if(window.location.pathname=='/admin/customer'){
        let columns = [
            { "data" : "index" },
            { "data" : "name" },
            { "data" : "email" },
            { "data" : "phone" },
            { "data" : "house_no" },
            { "data" : "street_address" },
            { "data" : "city" },
            { "data" : "state" },
            { "data" : "country" },
            { "data" : "pincode" }
            
          ], 
          url = '/admin/customer-search', method = 'GET' ;
        dataTable(url, method, columns);
    }
    
    /* change roles. */
    $(document).on('change','.hd_role_data',function(){
        let id = $(this).val();
        $.get('/admin/roles/'+id,function(response){
            if(response.status==true){
                let description = response.data.description
                $('.role_desc').html('<b>Note : </b><span>'+description+'</span>');
            }else{
                toastr('error',response.message);
            }
        });
    });

    /* add users. */
    $(document).on('click','.save_users',function(){
        let fname = $('#hd_fname').val();
        let lname = $('#hd_lname').val();
        let email = $('#hd_email').val();
        let password = $('#hd_password').val();
        let role_id = $('.hd_role_data').val();
        if(commonValidationFunction('hd_add_user_data')==true){
            $('.ad_loader').show();
            $('.close_users').click();
            $.post('/admin/add-user',{'fname':fname,'lname':lname,'email':email,'password':password,'role':role_id},function(response){
                if(response.status==true){
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

    /* edit user */
    $(document).on('click','.hd_edit_user',function(){
        let id = $(this).attr('user-id');
        $('#editUser').modal('show');
        $.get('/admin/edit-user/'+id,function(response){
            if(response.status==true){
                $('#hd_edit_fname').val(response.data[0].fname);
                $('#hd_edit_lname').val(response.data[0].lname);
                $('#hd_edit_email').val(response.data[0].email);
                $('#hd_select_roles').val(response.data[0].role_id).select2();
                $('.update_users').attr('user-id',response.data[0].id);
            }
        });
    });

    /* update user */ 
    $(document).on('click','.update_users',function(){
        let id = $(this).attr('user-id');
        let fname = $('#hd_edit_fname').val();
        let lname = $('#hd_edit_lname').val();
        let email = $('#hd_edit_email').val();
        let password = $('#hd_edit_password').val();
        let role = $('.hd_edit_role_data').val();
        if(commonValidationFunction('hd_edit_user_data')==true){
            $('.ad_loader').show();
            $('.edit_users_close').click();
            $.post('/admin/update-user/'+id,{'fname':fname,'lname':lname,'email':email,'password':password,'role':role},function(response){
                if(response.status==true){
                    toastr('success',response.message);
                    setTimeout(function(){
                        $('.ad_loader').hide();
                        reloadDataTable();
                    },1000);
                }else{
                    $('.ad_loader').hide();
                    $('.edit_users_close').click();
                    toastr('error',response.message);
                }
            });
        }
    });

    /*  clear data after onclick event */
    $(document).on('click','.edit_users_close',function(){
        $('input').val('');
    });

    /* change user status. */
    $(document).on('click','input[name="check_user_status"]',function(){
        let id = $(this).attr('user-id'), status;
        if($(this).attr('checked')){
            $(this).removeAttr('checked');
            status = 2
        }else{
            $(this).attr('checked','');
            status = 0
        }
        $.post('/admin/user-status-change',{'id':id,'status':status},function(response){
            if(response.status==true){
                toastr('success',response.message);
            }else{
                toastr('error',response.message);
            }
        });
    });

    /* close users popup */
    $(document).on('click','.close_users, .close > span',function(){
        $('#hd_fname').val('');
        $('#hd_lname').val('');
        $('#hd_email').val('');
        $('#hd_password').val('');
        $('.hd_role_data').val('').select2();
        $('.role_desc').html('');
    });

    /* add unit */
    $(document).on('click','.save_unit',function(){
        var name = $('#hd_unit_name').val();
        
        if(commonValidationFunction('hd_add_unit_valid')==true){
            $('.ad_loader').show();
            $.post('/admin/add-unit',{name:name},function(response){
                if(response.status==true){
                    toastr('success',response.message);
                    $('.close_unit').click();
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

    /* edit unit popup */
    $(document).on('click','.hd_edit_unit', function(){
        $('#editUnit').modal('show');
        var id=$(this).attr('unit-id');
        $.get('/admin/edit-unit',{id:id},function(response){
            if(response.status==true){
                $('#hd_edit_unit_name').val(response.unitData.name);
                $('.update_unit').attr('unit-id',response.unitData.id);
            }else{
                toastr('error',response.message);
            }
        });
    });

    /* update unit popup */
    $(document).on('click','.update_unit',function(){
        var id = $(this).attr('unit-id');
        var name =$('#hd_edit_unit_name').val();
        if(commonValidationFunction('hd_edit_unit_valid')==true){
            $('.ad_loader').show();
            $.post('/admin/update-unit/'+id,{name:name},function(response){
                if(response.status==true){
                    toastr('success',response.message);
                    $('.close_edit_unit').click();
                    setTimeout(function(){
                        reloadDataTable();
                        $('.ad_loader').hide();
                    },1500);
                }else{
                    $('.ad_loader').hide();
                    toastr('error',response.message);
                    $('.close_edit_unit').click();
                }
            });
        }
    });

    $(document).on('click','.close_unit, .close_popup',function(){
        $('#hd_unit_name').val('');
    });

});
