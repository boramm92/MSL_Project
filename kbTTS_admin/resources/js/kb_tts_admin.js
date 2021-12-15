/* MINDsLab. NBR. 20211214 */
$(document).ready(function(){
    // -------------------- 공통 -------------------- //
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

    // etc 메뉴
    $('.etc > ul > li').on('click', function(){
        $(this).addClass('open');
    });

    // etc 외 영역 클릭 시에도 닫기
    $(document).mouseup(function(e){
		var openEtcNav = $('.etc > ul > li.open');
		if(openEtcNav.has(e.target).length === 0){
			openEtcNav.removeClass('open');
		}
	});

    // contenteditable div에 텍스트 붙여넣기 시 태그 제외한 순수 텍스트만 넣기
    window.addEventListener('paste', function(e) {
        e.preventDefault();
        var pastedData = event.clipboardData ||  window.clipboardData;
        var textData = pastedData.getData('text/plain');
        window.document.execCommand('insertHTML', false, textData);
    });

    // table checkbox 개별 / 전체 선택
    $('.allChk').on('click', function(){
        var thisTableBox = $(this).parents('.icld_chk'),
            allCheck = $(this).prop('checked'); 
        
        if(allCheck){
            thisTableBox.find('.eachChk').prop('checked', true); 
            $('.btn_list_remove').prop('disabled', false);
        }else{
            thisTableBox.find('.eachChk').prop('checked', false); 
            $('.btn_list_remove').prop('disabled', true); 
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
        
        // 선택한 체크박스 값이 true 이거나 체크박스 1개 이상 체크시 버튼 활성화시키기
        if(eachCheck == true || checkedLength > 0){
            $('.btn_list_remove').prop('disabled', false);
        }else{
            $('.btn_list_remove').prop('disabled', true); 
        }
               
        // 체크박스가 모두 선택되었을 때 상위 체크박스 선택되도록 설정
        if(checkBoxLength == checkedLength){
            thisTableBox.find('.allChk').prop('checked', true); 
        }else{
            thisTableBox.find('.allChk').prop('checked', false);
        }       
    });
});