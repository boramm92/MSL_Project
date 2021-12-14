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
        $(this).toggleClass('open');
    });

    // contenteditable div에 텍스트 붙여넣기 시 태그 제외한 순수 텍스트만 넣기
    window.addEventListener('paste', function(e) {
        e.preventDefault();
        var pastedData = event.clipboardData ||  window.clipboardData;
        var textData = pastedData.getData('text/plain');
        window.document.execCommand('insertHTML', false, textData);
    });
});