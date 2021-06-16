// MINDsLab. YMJ. 20190830

$(document).ready(function (){
	//pnb
	var pnbClicked = false;

	$('.btn_potal_ham').click(function(){
		if (!pnbClicked) {
			$(this).addClass('active');
            $('#wrap').addClass('nav_show');
			pnbClicked=true;
		} else {
			$(this).removeClass('active');
            $(this).closest('#wrap').removeClass('nav_show');	
			pnbClicked=false;
		}
	});     
    
    //Layer popup open 
	$('.btn_lyr_open').on('click',function(){	
        $('.lyrWrap').show();    
    });	  
    //Layer popup close 
    $('.btn_lyr_close, .lyr_bg').on('click',function(){
        $('.lyrWrap').hide();
        $('.lyrBox').hide();
    });	
    
    //�ъ슜�� �꾨줈��
	$('.ico_profile.btn_lyr_open').on('click',function(){	
        $('.lyr_profile').show();    
    });	 
    
    // select
    $('.selectbox select').on('change',function(){
        var select_name = $(this).children('option:selected').text();
        $(this).siblings('label').text(select_name);
    });
    
    //Table all checkBox
	$('.ipt_tbl_allCheck').on('click',function(){	
        var iptTblAllCheck = $(this).is(":checked");
        if ( iptTblAllCheck ) {
            $(this).prop('checked', true); 
            $(this).parents('table').find('tbody td input:checkbox').prop('checked', true); 
        } else {
            $(this).prop('checked', false); 
            $(this).parents('table').find('tbody td input:checkbox').prop('checked', false); 
        }         
	});
    
    //checkBox checking
	$('.ipt_check').on('click',function(){	
        var iptChecking = $(this).is(":checked");
        if ( iptChecking ) {
            $(this).parents('.checking').find('.checkBox input:checkbox').prop('checked', false);
            $(this).prop('checked', true);  
        }
	});
    
    //Table scroll
    $('table').each(function(){
        var winHeight = $(window).height(),
            tbodyHeight = $(this).children('tbody').height()+220;
        
        if ( tbodyHeight > winHeight ) {
            $(this).addClass('scroll');
            $(this).children('tbody').css({
				'max-height' : winHeight-305,
            });
            
            // Change the selector if needed
            var $table = $('table.scroll'),
                $bodyCells = $table.find('tbody tr:first').children(),
                colWidth;

            // Adjust the width of thead cells when window resizes
            $(window).resize(function() {
                // Get the tbody columns width array
                colWidth = $bodyCells.map(function() {
                    return $(this).width();
                }).get();

                // Set the width of thead columns
                $table.find('thead tr').children().each(function(i, v) {
                    $(v).width(colWidth[i]);
                });    
            }).resize(); // Trigger resize handler
        }
    }); 
});	