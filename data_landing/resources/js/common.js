$(document).ready(function(){
    // 인풋 라벨  
 $('.ipt_box input').on('focus', function(){
      $(this).siblings('label').hide();
      $(this).siblings('span').css('opacity','1');
  });

  $('.ipt_box input').on('focusout', function(){
      if($(this).val() === ''){
          $(this).siblings('label').show();
          $(this).siblings('span').css('opacity','0.5');
      }
  });
  
  
  // 탭메뉴
  var tabBtn = $('.tab_btn > li');
  var tabCont = $('.tab_cont > ul');
  
  tabCont.hide().eq(0).show();
  
  tabBtn.on('click',function(e){
      e.preventDefault();
      var target = $(this);
      var index = target.index();
      tabBtn.removeClass('active');
      target.addClass('active');
      tabCont.css('display', 'none');
      tabCont.eq(index).css('display', 'block');
  });
});
