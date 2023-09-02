let data_table

$(document).ready(function(){
    $.get('/folder-exists?request=admin',function(response){
        if(response.status==true){
            if(response.coupon==1) $('.sidebar_coupon').show();
            if(response.smtp==1) $('.sidebar_smtp').show();
            if(response.sms==1) $('.sidebar_sms').show();
            if(response.rate==1) $('.sidebar_rate').show();
            if(response.paypal==1) $('.sidebar_payment').show();
            if(response.stripe==1) $('.sidebar_payment').show();
            if(response.paypal==1 && response.stripe==1) $('.sidebar_payment').show();
            if(response.smtp==0 && response.sms==0 && response.paypal==0 && response.stripe==0) $('.sidebar_setup').hide();
        }
    });
    setTimeout(function(){
        // get notifications.
        $.get('/notification-get',function(response){
            if(response.status==true){
                let data = response.data, apdata='';
                $('.notification_count').html(data.length);
                if(data.length>0){
                    for(let i=0;i<data.length;i++){
                        apdata += `<li class="order-notification" notify-id="${data[i].id}"><span class="ad_icon"><img src="/images/mail.svg" alt=""></span><div class="ad_detail"><h5>${data[i].type}</h5><p class="msg"><span>${data[i].count}</span> ${data[i].message}</p></div></li>`;
                    }
                    $('.notify_list').append(apdata);
                }else{
                    $('.notify_list').html('<p>There is no notification.</p>');
                }
            }
        });
    },1000);

    var socket = io.connect();
    // using socket for real time update.
    socket.on('order-notification',function(data){
        if($('.notify_list').html()!=''){
            let match = 0 , index = 0; 
            $('.notify_list > p').css('display','none');
            $('.notify_list > li').each(function(i,v){
                if($(v).find('h5').html()==data.type){
                    match = 1; 
                    index = i;
                    return
                }
            });
            if(match==0){
                let apd = `<li><span class="ad_icon"><img src="/images/mail.svg" alt=""></span>
                <div class="ad_detail order-notification" notify-id="${data.notify_id}"><h5>${data.type}</h5><p class="msg"><span>1</span> ${data.message}</p>
                </div></li>`;
                $('.notify_list').append(apd);
                $('.notification_count').html($('.notify_list > li').length);
            }else{
                let count = parseInt($('.notify_list > li:eq('+index+')').find('.msg > span:eq(0)').html());
                $('.notify_list > li:eq('+index+')').find('.msg > span:eq()').html(count+1); 
            }
            
        }else{
            let apd = `<li><span class="ad_icon"><img src="/images/mail.svg" alt=""></span>
            <div class="ad_detail order-notification" notify-id="${data.notify_id}"><h5>${data.type}</h5><p class="msg"><span>1</span> ${data.message}</p>
            </div></li>`;
            $('.notify_list').append(apd);
            $('.notification_count').html($('.notify_list > li').length);
        }
    });

    // validation for answer file type
    $(document).on('change','input[type="file"]',function(e){
        var fileData = e.target.files[0];
        if( fileData !== undefined ){
            if( fileData.type == 'image/svg+xml'|| fileData.type == 'image/jpeg' || fileData.type == 'image/jpg' || fileData.type == 'image/png') {
                $(this).next().text(fileData.name);
                $('#file_type_error').html('');
            }else{
                $('input[name="img"]').val('');
                $('#file_type_error').html('Sorry, we could not upload this file. Try saving it in a svg, jpeg and jpg format and upload again');
            }
        }
    });

    // update notification
    $(document).on('click','.order-notification',function(){
        let id = $(this).attr('notify-id');
        let type = $(this).find('h5').html();
        $.post('/notification-update/'+id,function(response){
            if(response.status==true){
                if(type=='delivered order'){
                    window.location.href='/admin/orders?order=delivered_order';
                }else{
                    window.location.href='/admin/orders?order=all_order';
                }
            }
        });
    });

    $(document).on('click','.alert_close',function(){
        $(this).parent().hide();
      });
});

function dataTable(url, method, columns){
    data_table = $('#example').DataTable({
        responsive: true,
        serverSide: true,
        paging: true,
        ajax: {
          'url': url,
          'type': method
        },
        "columns":  columns 
    });

    //datatable search
    $('.ad_datatableSearch').keyup(function(){
        data_table.search($(this).val()).draw();
    });

    $(document).on('click','.opensright > .ranges > ul > li',function(){
        if(window.location.pathname=="/admin/add-products" || window.location.pathname=="/admin/stock-management"){
            let date = $('#reportrange > span').html().split('-');
            date = date.join('|');
            data_table.search(date).draw();
        }
    });

    $(document).on('change','.serch_agency',function(){
        let data = 'agency | name | '+$(this).val();
        data_table.search(data).draw();
    });

    $(document).on('click','.search_low_quantity',function(){
        let data = 'search | low | quantity | product';
        data_table.search(data).draw();
    });
    
    $(document).on('click','.applyBtn', function(e){
        e.preventDefault();
        if(window.location.pathname=="/admin/add-products" || window.location.pathname=="/admin/stock-management"){
            let date = $('#reportrange > span').html().split('-');
            date = date.join('|');
            data_table.search(date).draw();
        }
    });

    $('#example_next').on( 'click', function () {
        data_table.page( 'next' ).draw( 'page' );
    });
   
    $('#example_previous').on( 'click', function () {
        data_table.page( 'previous' ).draw( 'page' );
    });
}

function reloadDataTable(){
    data_table.ajax.reload();
}

function changeCategory(id,changeId){
    $.post('/admin/get-subcategory',{id:id},function(response){
        if(response.status==true){
            let sc=response.subcategory
            let appData ='';
            appData+='<option value=""></option>';
            for(let i=0; i<sc.length;i++){
                appData+='<option value="'+sc[i].id+'">'+sc[i].title+'</option>';
            }
            $(changeId).html(appData);
        }
    });
}

function toastr(typeAlert,  message) {
    if (typeAlert == "success") {
        $('.green_notification').addClass('show_notification');
        $('.toster_content > .blank_div > h3').html('Success');
        $('.toster_content > .blank_div > p').html(message);
        setTimeout(function () {
            $('.green_notification').removeClass('show_notification');
        }, 1500);       
    } else {
        $('.red_notification').addClass('show_notification');
        $('.toster_content > .blank_div > h3').html('Error');
        $('.toster_content > .blank_div > p').html(message);
        setTimeout(function () {
            $('.red_notification').removeClass('show_notification');
        }, 1500);
    }
}

function commonValidationFunction(id){
    let allAreFilled = true, message = 'Please fill all the mendatory fields.', cond;
    (id=='validate_card1' || id=='validate_card0') ? cond = document.getElementById(id).querySelectorAll(".edit_coupon_card") : cond = document.getElementById(id).querySelectorAll(".form-control");
    
    cond.forEach(function(i) { 
        if (!allAreFilled) return;
        if (!i.value) allAreFilled = false;
        if(i.type=='text'){
            var dd = /<(.|\n)*?>/g;
            var checktext = /"=[a-z]/g;
            var antext = /[a-z]="/g;
            if(dd.test(i.value)==true || checktext.test(i.value)==true || antext.test(i.value)==true){
                allAreFilled = false;
                message = 'Please fill text content.'               
            }else{
                if(i.name=='text_color1' || i.name=='text_color2' || i.name=='text_color3'){
                    if(i.value == ''){
                        allAreFilled = false;
                        message = 'Please select text color.';
                    }
                }
                if(i.name=='coupon_code'){
                    let cc  = /^[a-zA-Z0-9 ]+$/;
                    if(!cc.test(i.value)){
                        allAreFilled = false;
                        message = 'Coupon code should be numbers and characters both.';
                    }else{
                        if(i.value.length>8){
                            allAreFilled = false;
                            message = 'Coupon code length must be 8.';
                        }
                    }
                }
                if(i.name=="gst_number"){
                    if(i.value!=''){
                        var gstinformat = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;   
                        if (!gstinformat.test(i.value)) {    
                            allAreFilled = false;    
                            message = 'Please Enter Valid GSTIN Number.';
                        }
                    }
                }
                if(i.name=="pan_number"){
                    if(i.value!=''){
                        var regex = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;   
                        if (!regex.test(i.value)) {    
                            allAreFilled = false;    
                            message = 'Please Enter Valid PAN Number.';
                        }
                    }
                }
            }  
        } 
        if(i.type=='file'){
            if(i.value==''){
                allAreFilled = true;
            }
        }
        if(i.type=='email'){
            var email = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if(!email.test(i.value)){
                allAreFilled = false;
                message = 'Please fill valid email.'
            }
        }
        if(i.type=='password'){
            if(id=='hd_edit_user_data' || id=='admin_profile_validate'){
                if(i.value==''){
                    allAreFilled = true;
                }else{
                    if(i.value.length < 6) {
                        allAreFilled = false;
                        message = 'Password is too short.'
                    }
                }
            }else{
                if(i.value.length < 6) {
                    allAreFilled = false;
                    message = 'Password is too short.'
                }
            }
        }
        if(i.type=='number'){
            if(i.value < 0) {
                allAreFilled = false;
                message = 'Number cannot be negative.'
            }
        }

        if(i.name=='theme_tagline' || i.name=='admin_profile_lname' || i.name=='subject' || i.name==undefined || i.name=='play_store_link' || i.name=='app_store' || i.name=='author' || i.name=='phone_no2'){
            if(i.value=='' || i.value==undefined){
                allAreFilled = true;
            }
        }
        if (i.name=='admin_profile_phone') {
            if (i.value == '') {
                allAreFilled = false;
                message = 'Please fill Phone number.';
            } else {
                var phoneNum = /^(?:(\+))?(?:[0-9]{0,3}[\s.\/-]?)?(?:(?:\((?=\d{3}\)))?(\d{3})(?:(?!\(\d{3})\))?[\s.\/-]?)?(?:(?:\((?=\d{3}\)))?(\d{3})(?:(?!\(\d{3})\))?[\s.\/-]?)?(?:(?:\((?=\d{4}\)))?(\d{4})(?:(?!\(\d{4})\))?[\s.\/-]?)?$/g;
                var n = i.value;
                if (!n.match(phoneNum)) {
                    allAreFilled = false;
                    message = 'Phone number must be number and will be 10 or 12 digits are allowed.';
                } else {
                    if (JSON.stringify(n).length < 10 || JSON.stringify(n).length > 12) {
                        allAreFilled = false;
                        message = 'Phone number must be number and will be 10 or 12 digits are allowed.';
                    }
                }
            }
        }

        if (!allAreFilled) {
            i.focus();
            if(i.type=='email'){
				if(i.value==''){
                    toastr('error', message);
                }else{
                    toastr('error', message);
				}
            }else if(i.type=='password'){
				if(i.value==''){
                    toastr('error', message);
                }else{
                	toastr('error', message);
                }  
            }else{
                toastr('error', message);
            }
        }
    });
    return allAreFilled;
}
