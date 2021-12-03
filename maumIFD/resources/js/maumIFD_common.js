/* MINDsLab. NBR. 20211201 */

$(document).ready(function(){
    // 공통 layer popup 
	$('.btn_lyr_open').on('click',function(){	
        var btnLyrName = $(this).data('lyr-name'),
            popId = '#' + btnLyrName;
        
        // open
        $(popId).css('display', 'block');
        $(popId).prepend('<div class="lyr_bg"></div>');
        
        // close 
        $('.btn_lyr_close').on('click',function(){
            $(popId).css('display', 'none'); 
            $('.lyr_bg').remove(); 
        });	
    });	

    // snb 열기 / 닫기
    $('.btn_ham').on('click', function(e){
        e.stopPropagation();
        $('#snb').toggleClass('open');
    });
    
    // snb 외 영역 클릭 시에도 닫기
    $('html').on('click', function(e){
        e.stopPropagation();
        if($(e.target).is('#snb')){
            $('#snb').removeClass('open');
        }
    });

    // snb 대메뉴 클릭 시 하위 메뉴 보여주기
    $('#snb .nav li h2').on('click', function(){
        if($(this).siblings('.sub').length > 0){
            $(this).parent('li').toggleClass('active');
        }
    });

    // user 메뉴 클릭 시 하위 메뉴 보여주기
    $('.user_menu').on('click', function(){
        $('.user_menu ul').toggleClass('open');
    });

    // 로그인 페이지 계정 입력 시 input 활성화 효과
    var accountInput = $('.loginBox .formBox .ipt_txt');

    accountInput.on('keyup', function(){
        if(!$(this).val() == ''){
            $(this).parent().addClass('active');
        }else{
            $(this).parent().removeClass('active');
        }
    });
});