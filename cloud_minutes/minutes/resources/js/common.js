// MINDsLab. YMJ. 20190830

$(document).ready(function (){
    //Layer popup open 
	$('.btn_lyr_open').on('click',function(){	
        $('.lyrWrap').show();    
    });	  
    //Layer popup close 
    $('.btn_lyr_close, .lyr_bg').on('click',function(){
        $('.lyrWrap').hide(); 
        $('.lyrBox').hide(); 
    });	
	
    //snb
	$('#gnb ul.nav li a').on('click',function(){	
		$('#gnb ul.nav li').removeClass('active'); 
        $(this).parent().addClass('active');    
    });	
	
	
	// UX/UI NBR 2020.02.14 추가
	//record btn 
	$('.record_btn').on('click',function(){
		$('.standby_txt, .record_btn').css('display','none');
		$('.recording_txt, .stop_btn').css('display','block')
	})
	//stop btn
	$('.stop_btn').on('click',function(){
		$('.standby_txt, .record_btn').css('display','block');
		$('.recording_txt, .stop_btn').css('display','none')
	})	
});	
