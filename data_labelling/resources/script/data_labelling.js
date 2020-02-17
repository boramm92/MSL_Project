$(document).ready(function() {
    // 인풋 라벨 
  var placeholderLabel = $('.inquiry_box input, .inquiry_box textarea');
  
  placeholderLabel.on('focus', function(){
      $(this).siblings('label').hide();
  });

  placeholderLabel.on('focusout', function(){
      if($(this).val() === ''){
          $(this).siblings('label').show();
      }
  });
  
  // 상단 작업 문의하기 버튼 스크롤 이동 
  $('.btn_inquiry').on('click', function(){
      $('html, body').animate({ scrollTop: $(document).height()},800);
  });
});
