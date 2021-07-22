/* MINDsLab. NBR. 20210716 */
$(document).ready(function(){
    // snb 열기 / 닫기
    $('#snb').on('click', function(){
        $(this).toggleClass('open');
    });

    
    // snb 메뉴 active 
    $('#snb .nav li a').on('click', function(e){
        e.stopPropagation();

        var listNum = $('#snb .nav li').length;
        var thisListIndex = $(this).parent('li').index(),
            thisListIndex = thisListIndex + 1;

        if(listNum !== thisListIndex){
            $('#snb .nav li').removeClass('active');
        }
        
        $(this).parent('li:not(:last-child)').addClass('active');
    });


    // table tap 
    $('.tbl_tap_wrap .tapBtn li').on('click', function(){
        $('.tbl_tap_wrap .tapBtn li').removeClass('active');
        $(this).addClass('active');
    }); 


    // table 목록 선택 / 미리보기 aside 열기 / 닫기
    $('.tblBox table tbody tr').on('click', function(){
        var tableName = $(this).parents('table').data('tbl-name'),
            asideId = '#' + tableName;

        $('.tblBox table tbody tr').removeClass('selected');
        $(this).addClass('selected');

        // open
        $('body').css('overflow', 'hidden');
        $(asideId).css('display', 'block');
        $(asideId).prepend('<div class="aside_bg"></div>');
        
        // close 
        $('.btn_aside_close').on('click',function(){
            $('body').css('overflow', '');
            $(asideId).css('display', 'none'); 
            $('.aside_bg').remove(); 
            $('.tblBox table tbody tr').removeClass('selected');
        });
    });


    // table checkbox 개별 / 전체 선택
    $('.allChk').on('click', function(){
        var allCheck = $('.allChk').prop('checked'); 
        
        if(allCheck){
            $('.eachChk').prop('checked', true); 
            $('.btn_list_remove').addClass('on').prop('disabled', false);
        }else{
            $('.eachChk').prop('checked', false); 
            $('.btn_list_remove').removeClass('on').prop('disabled', true); 
        }
    });
    
    // 모든 체크박스를 클릭하면 버튼 활성화시키기
    $('.eachChk').on('click', function(e){
        e.stopPropagation();

        var eachCheck = $(this).prop('checked'); 
        // 자식 체크 전체 체크시, 부모 체크박스 체크 됨
        var checkBoxLength = $('.eachChk').length,
            checkedLength = $('.eachChk:checked').length;
        
        // 선택한 체크박스 값이 true 이거나 체크박스 1개 이상 체크시 버튼 활성화시키기
        if(eachCheck == true || checkedLength > 0){
            $('.btn_list_remove').addClass('on').prop('disabled', false);
        }else{
            $('.btn_list_remove').removeClass('on').prop('disabled', true); 
        }
               
        // 체크박스가 모두 선택되었을 때 상위 체크박스 선택되도록 설정
        if(checkBoxLength == checkedLength){
            $('.allChk').prop('checked', true); 
        }else{
            $('.allChk').prop('checked', false);
        }       
    });


    // input - 금액 입력 시 천단위 콤마 넣기
    var priceInput = $('.ipt_txt.price');

    priceInput.on('keyup', function(e){
        var selection = window.getSelection().toString();

        if(selection !== ''){
            return;
        }
        if($.inArray(e.keyCode, [38,40,37,39]) !== -1){
            return;
        }
        
        var $this = $(this);
        var priceInput = $this.val();
        var priceInput = priceInput.replace(/[\D\s\._\-]+/g, '');
    
        priceInput = priceInput ? parseInt(priceInput, 10) : 0;
    
        $this.val(function(){
            return(priceInput === 0) ? '' : priceInput.toLocaleString('en-US');
        });    
    } );
});
