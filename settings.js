setTimeout(function(){
    $('select[name="country"]').trigger('change');
    $('select[name="merchant_country"]').trigger('change');
    if(window.location.search){
        let search = window.location.href.split('?');
        $('.setting_tab').removeClass('active');
        $('.tab-content > div').removeClass('active');
        $('.'+search[search.length-1]).addClass('active');
        $('#'+search[search.length-1]).addClass('active show');
        setTimeout(function(){
            $('#'+search[search.length-1]).trigger('click');
        },100);
    }
},500);

// get states on country change.
$(document).on('change','select[name="country"]',function(){
    var country = $(this).select2().val();
    $('.setting_state > option').not(':eq(0)').remove();
    let state = ($('.setting_state').attr('state-name')) ? $('.setting_state').attr('state-name') : '';
    if(country!=''){
        $.post('/admin/get-state',{country:country},function(response){
            if(response.status==true){
                let allState = '';
                for(let i=0;i<response.state.length;i++){
                    allState += `<option value="${response.state[i].name}" ${(state!='') ? ((state==response.state[i].name) ? 'selected':''):''}>${response.state[i].name}</option>`
                }

                $('.setting_state option').after(allState);
                $('.country_code').html('+'+response.country_phoneCode);
                $('input[name="currency_name"]').val(response.currency);
                $('input[name="currency"]').val(response.symbol);
                $('.setting_state').select2();
                if(response.country_phoneCode!=""){
                    $('input[name="country_code"]').val('+'+response.country_phoneCode);
                }
            }else{
                toastr('error',response.message);
            }
        });
    }
});

// save basic setting data.
$(document).on('click','.basic_setting_save',function(){
    if(commonValidationFunction('home')==true){
        $('.ad_loader').show();
        $.post('/admin/save-footer-settings',$('.basic_setting_data').serializeArray(),function(response){
            if(response.status == true){
                toastr('success',response.message);
                setTimeout(function(){
                    $('.ad_loader').hide();
                },1000);
            }else{
                $('.ad_loader').hide();
                toastr('error',response.message);
            }  
        });
    }
});

// save theme setting data.
$(document).on('click','.save_theme_setting',function(){
    var data = new FormData();
    let theme_name = $('input[name="theme_name"]').val(), theme_tagline = $('input[name="theme_tagline"]').val(), font=$('select[name="font"]').val(), theme_color=$('input[name="theme_color"]').val(), hover_color=$('input[name="hover_color"]').val();
    $.each($('#choose_logo')[0].files, function(i, file) {
        data.append('image', file);
        let logo = $('#choose_logo').val();
        logo = logo.split('\\');
        data.append('logo',logo[logo.length-1]);
    });
    $.each($('#choose_favicon')[0].files, function(i, file) {
        data.append('image', file);
        let favicon = $('#choose_favicon').val();
        favicon = favicon.split('\\');
        data.append('favicon',favicon[favicon.length-1]);
    });
    $.each($('#chooseFooter_logo')[0].files, function(i, file) {
        data.append('image', file);
        let footer_logo = $('#chooseFooter_logo').val();
        footer_logo = footer_logo.split('\\');
        data.append('footer_logo',footer_logo[footer_logo.length-1]);
    });
    data.append('theme_name', theme_name);
    data.append('theme_tagline', theme_tagline);
    data.append('font', font);
    data.append('theme_color', theme_color);
    data.append('hover_color', hover_color);
    
    if(commonValidationFunction('appearence_data')==true){
        $('.ad_loader').show();
        $.ajax({
            url: '/admin/save-appearance',
            data:data,
            cache: false,
            contentType: false,
            processData: false,
            method: 'POST',
            type: 'POST', // For jQuery < 1.9
            success: function(response){  
                if(response.status == true){
                    toastr('success',response.message);
                    setTimeout(function(){
                        location.reload();
                    },1000);
                }else{
                    $('.ad_loader').hide();
                    toastr('error',response.message);
                }  
            }
        });
    }
});

// save seo setting data.
$(document).on('click','.save_seo_setting',function(){
    if(commonValidationFunction('seo_validation')==true){
        $('.ad_loader').show();
        $.post('/admin/save-seo-settings',$('.seo_setting_data').serializeArray(),function(response){
            if(response.status == true){
                toastr('success',response.message);
                setTimeout(function(){
                    $('.ad_loader').hide();
                },1000);
            }else{
                $('.ad_loader').hide();
                toastr('error',response.message);
            }  
        });
    }
});

// save mail setting data.
$(document).on('click','.save_mail_settings',function(){
    if(commonValidationFunction('smtp_validation')==true){
        $('.ad_loader').show();
        $.post('/admin/save-mail-settings',$('.ad_mail_setting').serializeArray(),function(response){
            if(response.status == true){
                toastr('success',response.message);
                setTimeout(function(){
                    $('.ad_loader').hide();
                },1000);
            }else{
                $('.ad_loader').hide();
                toastr('error',response.message);
            }  
        });
    }
});

// get message through onclick event.
$(document).on('click','.order_msg, .shipped_msg, .dispatched_msg, .delivered_msg, .cancel_msg', function(){
    let st = $(this).attr('btn-status');
    if($('.msg_editor_parent').css('display')=='none'){
        $('.msg_editor_parent').css('display','block');
    }
    $('.save_msg_settings').attr('msg-status',st);
    $('.ad_loader').show();
    $.post('/admin/get-message',{'status':st},function(response){
        if(response.status==true){
            if(response.data.length>0){
                setTimeout(function(){
                    $('.ad_loader').hide();
                    $('#editor1').html(response.data[0].jsonData.replace(/<br>/g, '\n'));
                },100);
            }else{
                setTimeout(function(){
                    $('.ad_loader').hide();
                    $('#editor1').val('');
                },100);
            }
        }else{
            $('.ad_loader').hide();
            toastr('error',response.message);
        }
    });
});

// save message setting data.
$(document).on('click','.save_msg_settings',function(e){
    e.preventDefault();
    let text = $('#editor1').val();
    let msg_status = $(this).attr('msg-status');
    $('.ad_loader').show();
    $.post('/admin/save-sms-settings',{'text':text,'msg_status':msg_status},function(response){
        if(response.status == true){
            toastr('success',response.message);
            setTimeout(function(){
                $('.ad_loader').hide();
            },1000);
        }else{
            $('.ad_loader').hide();
            toastr('error',response.message);
        }  
    });
});

// get state name onchange of merchant country.
$(document).on('change','select[name="merchant_country"]',function(){
    var country = $(this).select2().val();
    $.post('/admin/get-state',{country:country},function(response){
        if(response.status==true){
            let allState = '';
            for(let i=0;i<response.state.length;i++){
                allState += `<option value="${response.state[i].name}">${response.state[i].name}</option>`
            }
            $('.merchant_state option').after(allState);
            $('.merchant_state').select2();
        }else{
            toastr('error',response.message);
        }
    });
});

// save merchant signature file.
$(document).on('change', '#merchant_signfile',function(){
    var file = this.files[0];
    var _URL = window.URL || window.webkitURL;
    img = new Image();
    var imgwidth = 0;
    var imgheight = 0;
    var maxwidth = 286;
    var maxheight = 149;
  
    img.src = _URL.createObjectURL(file);
    img.onload = function() {
      imgwidth = this.width;
      imgheight = this.height;
      if(imgwidth <= maxwidth && imgheight <= maxheight){
        if( file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg') {
            var reader = new FileReader();
            reader.onloadend = function () {
                $('#preview_image_setting').css('background-image', 'url("' + reader.result + '")');
            }
            if (file) {
                reader.readAsDataURL(file);
            }
        }else{
            $('#preview_image_setting').attr("style","background-image: url('/images/img4.png');");
            toastr('error','Sorry, we could not upload this file. Try saving it in a png, jpeg and jpg format and upload again');
        }
      }else{
        toastr('error','Image size should be 286x149.');
        $('.ad_upload_merchantLogo > span').html('Choose file');
        $('#merchant_signfile').val('');
      }
    }
});

// save merchant details.
$(document).on('click','.save_merchant_details',function(){
    var data = new FormData();
    let gst_number = $('input[name="gst_number"]').val(), pan_number = $('input[name="pan_number"]').val(), 
    shop_name=$('input[name="shop_name"]').val(), pin_code=$('input[name="pin_code"]').val(), 
    merchant_address=$('textarea[name="merchant_address"]').val(),
    declaration=$('textarea[name="declaration"]').val(), terms_condition=$('textarea[name="terms_condition"]').val();
    let shipping_charges_in=$('[name="shipping_charges_in"]').val(), shipping_charges_out=$('[name="shipping_charges_out"]').val();
    let id = $('.save_merchant_details').parents('form').attr('id');

    $.each($('#merchant_signfile')[0].files, function(i, file) {
        data.append('image', file);
    });

    data.append('gst_number', gst_number);
    data.append('pan_number', pan_number);
    data.append('shop_name', shop_name);
    data.append('pin_code', pin_code);
    data.append('merchant_address', merchant_address);
    data.append('declaration', declaration);
    data.append('terms_condition', terms_condition);
    data.append('shipping_charges_in', shipping_charges_in);
    data.append('shipping_charges_out', shipping_charges_out);
    
    if(commonValidationFunction(id)==true){
        if(id=='merchant_details' && $('#merchant_signfile').val()!='' || $('#merchant_signfile').val()==''){
            $('.ad_loader').show();
            $.ajax({
                url: '/admin/save-merchant-details',
                data:data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                type: 'POST', // For jQuery < 1.9
                success: function(response){  
                    toastr('success',response.message);
                    if(response.status == true){
                        setTimeout(function(){
                            $('.ad_loader').hide();
                        },300);
                    }else{
                        $('.ad_loader').hide();
                        toastr('error',response.message);
                    }
                }
            });
        }else{
            toastr('error','Please upload image.');
        }
    }
});

// save message API data.
$(document).on('click','.save_MSG_API',function(){
    if(commonValidationFunction('msg_api')==true){
        $('.ad_loader').show();
        $.post('/admin/msg-api-data',$('#msg_api').serializeArray(),function(response){
            if(response.status == true){
                toastr('success',response.message);
                setTimeout(function(){
                    $('.ad_loader').hide();
                },1000);
            }else{
                $('.ad_loader').hide();
                toastr('error',response.message);
            }  
        });
    }
});

