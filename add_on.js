$(document).on('click','.addOn_status_change',function(){
    let id = $(this).attr('add-on-id');
    if($(this).attr('checked')){
        $(this).removeAttr('checked');
        $(this).attr('data-status', 0);
    }else{
        $(this).attr('checked','');
        $(this).attr('data-status', 1);
    }
    $.post('/admin/addon-status-change',{'id':id,'status':$(this).attr('data-status')},function(response){
        if(response.status==true){
            toastr('success',response.message);
        }else{
            toastr('error',response.message);
        }
    });
})