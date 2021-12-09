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

    $('#snb').on('click', function(){
        if(!$('#snb').is('.open')){
            $('#snb').addClass('open');
        }
    });

    // snb 대메뉴 클릭 시 하위 메뉴 보여주기
    $('#snb .nav li h2').on('click', function(){
        if($(this).siblings('.sub').length > 0){
            $(this).parent('li').toggleClass('active');
        }
    });

    $('#snb .nav li a').on('mouseenter', function(){
        $(this).parents('.third').siblings('a').addClass('hover');
        $(this).addClass('hover');
    });
    $('#snb .nav li a').on('mouseleave', function(){
        $('#snb .nav li a').removeClass('hover');
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

    // table checkbox 개별 / 전체 선택
    $('.allChk').on('click', function(){
        var thisTableBox = $(this).parents('.icld_chk'),
            allCheck = $(this).prop('checked'); 
        
        if(allCheck){
            thisTableBox.find('.eachChk').prop('checked', true); 
        }else{
            thisTableBox.find('.eachChk').prop('checked', false); 
        }
    });
    
    // 모든 체크박스를 클릭하면 버튼 활성화시키기
    $('.eachChk').on('click', function(e){
        e.stopPropagation();

        var thisTableBox = $(this).parents('.icld_chk'),
            eachCheck = $(this).prop('checked'); 
            
        // 자식 체크 전체 체크시, 부모 체크박스 체크 됨
        var checkBoxLength = thisTableBox.find('.eachChk').length,
            checkedLength = thisTableBox.find('.eachChk:checked').length;
               
        // 체크박스가 모두 선택되었을 때 상위 체크박스 선택되도록 설정
        if(checkBoxLength == checkedLength){
            thisTableBox.find('.allChk').prop('checked', true); 
        }else{
            thisTableBox.find('.allChk').prop('checked', false);
        }       
    });
});