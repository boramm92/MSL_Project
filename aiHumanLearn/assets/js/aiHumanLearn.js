/* MINDsLab. NBR. 20210604 */
$(document).ready(function(){
    // 공통 layer popup 
	$('.btn_lyr_open').on('click',function(){	
        var btnLyrName = $(this).data('lyr-name'),
            popId = '#' + btnLyrName;
        
        // open
        $(popId).css('display', 'block');
        $(popId).prepend('<div class="lyr_bg"></div>');
        
        // close 
        $('.btn_lyr_close, .btn_confirm').on('click',function(){
            $(popId).css('display', 'none'); 
            $('.lyr_bg').remove(); 
        });	
    });	
});