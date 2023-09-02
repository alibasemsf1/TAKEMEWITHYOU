$(window).on('load',function(){
  $('.ad_loader').hide();
});

$(document).ready(function(){
  $('.ad_mail_setting .msg_btn').on('click', function(){
    if($(this).hasClass('active_msg')){
  
    }else{
      $('.ad_mail_setting .msg_btn').removeClass('active_msg');
      $(this).addClass('active_msg');
    }
  });

    // tooltip
    $('[data-toggle="tooltip"]').tooltip();

    // select2
    if($('.ad_select').length){
      $('.ad_select').select2({
          placeholder: $(this).attr('placeholder'),
          allowClear: true
      });
    }

    // profile dorpdown
    $(document).on('click','.ad_profile_wrapper',function(){
      $(this).find('.ad_profileDropdown').slideToggle()
    });

    // notification dorpdown
    $(document).on('click','.ad_notification .ad_notifiClick',function(){
      $(this).closest('.ad_notification').find('.ad_notificationDropdown').slideToggle()
    });

     // toggle menu
    $(document).on('click','.ad_toggle', function(){
      $(this).closest('.admin_main_wrapper').toggleClass('ad_mainMenuOpen')
      $(this).closest('.admin_main_wrapper').removeClass('ad_submenuOpen')
    });

    $(document).on('click','.ad_main_menu>ul>li>a[href="#"]', function(){
      if($(window).width() < 768) {
        if($(this).attr('class')=='hd_pm') {
          $('.user_management').css('display','none');
          $('.product_master').css('display','block');
        }else{
          $('.product_master').css('display','none');
          $('.user_management').css('display','block');
        }
      }
    });
    
    //colorpicker
    if( $(".ad_colorPicker").length){
      $(".ad_colorPicker").spectrum({
          preferredFormat: "hex",
          //color: "#f00",
          showInput: true,
          showAlpha: true
      });
    }
    if($('.datepicker-here').length){
      if(!$('.datepicker-here').attr('readonly')){
        var minDate = new Date();
        minDate.setDate(minDate.getDate() + 1);
        $('.datepicker-here').datepicker({
          format: 'yyyy/mm/dd',
          minDate:minDate,
          opens: 'center',
          container: '.datepicker_holder'
        });
      }
    }

    // body click
    $(document).on('click', function(e){
        if(!$(e.target).closest('.ad_profile_wrapper').length){
           $('.ad_profileDropdown').slideUp()
        }
        if(!$(e.target).closest('.ad_notification').length){
           $('.ad_notificationDropdown').slideUp()
        }
    });

})


/*************** Logo Setting ***********************/
function previewLogoFile(input){
  var file = $("#choose_logo").get(0).files[0];
  if(file){
      var reader = new FileReader();
      reader.onload = function(){
          $("#previewImg").attr("src", reader.result);
      }
      reader.readAsDataURL(file);
  }
}
function previewFooterLogoFile(input){
  var file = $("#chooseFooter_logo").get(0).files[0];
  if(file){
      var reader = new FileReader();
      reader.onload = function(){
          $("#previewFooterImg").attr("src", reader.result);
      }
      reader.readAsDataURL(file);
  }
}
function previewFavicon(input){
  var favicon = $("#choose_favicon").get(0).files[0];
  if(favicon){
      var reader = new FileReader();
      reader.onload = function(){
          $("#previewImgfavicon").attr("src", reader.result);
      }
      reader.readAsDataURL(favicon);
  }
}
/*************** End Logo Setting ***********************/

/** Add Product Preview Image(table) **/
$(document).on("click", ".browse_", function() {
  var file = $(this).parents().find(".hd_product_image");
  file.trigger("click");
});

$(".product_master").hide();
$(".order_submenu").hide();
 
$(".hd_menuArrow").click(function(){
  if($(this).parent('li').hasClass("dropdown-active")){
    $(this).parent('li').removeClass("dropdown-active");
    $(this).parent('li').find("ul").stop().slideUp("slow");
  }else{
    $(".hd_menuArrow").parent('li').removeClass("dropdown-active");
    $(".hd_menuArrow").parent('li').find("ul").stop().slideUp(500);
    $(this).parent('li').addClass("dropdown-active");
    $(this).parent('li').find("ul").stop().slideDown("slow");
  }
});
$(function () {
  $('[data-toggle="tooltip"]').tooltip();
})