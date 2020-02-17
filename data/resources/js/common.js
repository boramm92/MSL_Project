// MINDsLab. UX/UI Team. 
$(window).load(function() {    
	$('.page_loading').addClass('pageldg_hide').delay(300).queue(function() { 
		$(this).remove(); 
	});
});

jQuery(function(){
	jQuery("a.btn_movLayer").movLayer();
});	
// layerpopup
(function ( $ ) { 
    $.fn.movLayer = function(options) {

        var movLayerOptions = $.extend({
                'autoplay': 1
        }, options );

        $(this).on('click', function (e) {

            var movLayerLink = $(this).attr("href");

            if( movLayerLink.match(/(youtube.com)/) ){
                var split_c = "v=";
                var split_n = 1;
            }

            if( movLayerLink.match(/(youtu.be)/) || movLayerLink.match(/(vimeo.com\/)+[0-9]/) ){
                var split_c = "/";
                var split_n = 3;
            }

            if( movLayerLink.match(/(vimeo.com\/)+[a-zA-Z]/) ){
                var split_c = "/";
                var split_n = 5;
            }

            var getYouTubeVideoID = movLayerLink.split(split_c)[split_n];

            var cleanVideoID = getYouTubeVideoID.replace(/(&)+(.*)/, "");

            if( movLayerLink.match(/(youtu.be)/) || movLayerLink.match(/(youtube.com)/) ){
                var videoEmbedLink = "https://www.youtube.com/embed/"+cleanVideoID+"?autoplay="+movLayerOptions.autoplay+"";
            }

            if( movLayerLink.match(/(vimeo.com\/)+[0-9]/) || movLayerLink.match(/(vimeo.com\/)+[a-zA-Z]/) ){
                var videoEmbedLink = "https://player.vimeo.com/video/"+cleanVideoID+"?autoplay="+movLayerOptions.autoplay+"";
            }

            $("body").append('<div class="layerpopup_wrap"><div class="layer_bg"></div><div class="layerBox"><a href="#none" class="layer_close"></a><iframe src="'+videoEmbedLink+'" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe></div></div>');
			
            $(".layer_bg, .layer_close").click(function(){
                $(".layerpopup_wrap").addClass("layerpopup_hide").delay(500).queue(function() { $(this).remove(); });
            });
						
			var winWidth = $(window).width();	
			var winHeight = $(window).height();
			var layerWidth = $('.lot_c').width();			
			var layerHeight = (9 / 16) * layerWidth;

			// =*= Pc Layout =*=	
			$('.layerpopup_wrap .layerBox').css({
				'width' : layerWidth,
				'height' : layerHeight,	
				'margin-top' : -layerHeight/2,	
				'margin-left' : -layerWidth/2,	
			});								

            e.preventDefault();
        });
    }; 
}( jQuery ));

$(document).ready(function() {
	//aside menu
	var clicked = false;	
	var asideWidth = $(window).width() - 50;
	$('.aside').show();

	$('a.btn_header_ham').click(function(){
		if (!clicked) {
			$(this).addClass('active');
			$('.aside').animate({
				width : asideWidth,
			},{duration:200,queue:false});
			$('.btn_goTop').hide();
			
			$('.bg_aside').animate({
				  opacity : 0.7,
			},{duration:200,queue:false});
			$('.bg_aside').css({
				  display : 'block',
			});
			$('body').css({
				  overflow : 'hidden',
			});

			clicked=true;
		} else {
			$(this).removeClass('active');
			$('.aside').animate({
				width: '0',
			},{duration:200,queue:false});
			$('.btn_goTop').show();

			$('.bg_aside').animate({
				  opacity : 0,
			},{duration:150,queue:false});
			$('.bg_aside').css({
				  display : 'none',
			});
			$('body').css({
				  overflow : '',
			});

			clicked=false;
		}
	});
	
	$('.bg_aside').on('click',function(){
		$('a.btn_header_ham').removeClass('active');
		$('.aside').animate({
			width: '0',
		},{duration:200,queue:false});
		$('.btn_goTop').show();

		$('.bg_aside').animate({
			  opacity : 0,
		},{duration:150,queue:false});
		$('.bg_aside').css({
			  display : 'none',
		});
		$('body').css({
			  overflow : '',
		});
		clicked=false;
	});

	// language (pc)
	$('.header_box .sta .etcMenu ul li.lang').each(function(){
		$(this).on('click',function(){
			$(this).toggleClass('active');
		});
		$('.header_box .sta .etcMenu ul li.lang ul.lst li a').on('click',function(){
			$(this).removeClass('active');
		});
		$('#container').on('click',function(){
			$('.header_box .sta .etcMenu ul li.lang').removeClass('active');
		});
	});

	// language (mobile)
	$('ul.m_etcMenu li.lang').each(function(){
		$(this).on('click',function(){
			$(this).toggleClass('active'); 
		});	
		$('ul.m_etcMenu li.lang ul.lst li a').on('click',function(){
			$(this).removeClass('active'); 
		});	
	});
	// aside nav
	$('.aside .aside_mid .m_nav li h2 a').on('click', function () {
	    if($(this).hasClass('slideChk')){
	        $('.aside .aside_mid ul.m_lst').slideUp();
		    $('.aside .aside_mid ul.m_lst_sub').slideUp();
		    $('.aside .aside_mid .m_nav li h2 a').removeClass('slideChk');
		    return;
	    }
		$('.aside .aside_mid ul.m_lst').slideUp();
		$('.aside .aside_mid ul.m_lst_sub').slideUp();
		$(this).parent().parent().children('.m_lst').slideDown();
		$('.aside .aside_mid .m_nav li h2 a').removeClass('slideChk');
		$(this).addClass('slideChk');
	});
	$('.aside .aside_mid .m_nav li h3 a').on('click', function () {
	    if($(this).hasClass('active')){
	        $('.aside .aside_mid ul.m_lst_sub').slideUp();
	        $('.aside .aside_mid ul.m_lst li h3 a').removeClass('active');
	        return;
	    }
		$('.aside .aside_mid ul.m_lst_sub').slideUp();
		$(this).parent().parent().children('.m_lst_sub').slideDown();
		$('.aside .aside_mid ul.m_lst li h3 a').removeClass('active');
		$(this).addClass('active');	
	});	
	
	// layer popup
	$('.btn_audio_play').on('click',function(){
		$('.audioBox').fadeIn(300);
		
		$('.audioBox audio').each(function(){
			var audio = document.getElementById('myAudio');
			audio.play();
		});	
	});	
	$('.btn_lyr_close, .btn_lyr_cancel, .lyr_bg').on('click',function(){
		$('.lyrWrap').fadeOut(300);
		$('.audioBox').fadeOut();
		$('.audioBox audio').each(function(){
			var audio = document.getElementById('myAudio');
			audio.pause();
			audio.currentTime = 0;
		});
	});
	
	// select design 
	var selectTarget = $('.select_box select'); 
	
	selectTarget.change(function(){ 
	
	var select_name = $(this).children('option:selected').text(); 
	$(this).siblings('label').text(select_name); 
	}); 
	
	// header user
	$('#header .etcmenu .userBox dl dd > a').on('click',function(){
		$(this).parent().parent().addClass('active');
	});	
	$('.contents').on('click',function(){
		$('#header .etcmenu .userBox dl').removeClass('active');
	});
	// snb
	$('.snb ul.nav li a').on('click',function(){
		$('.snb ul.nav li').removeClass('active');
		
		$(this).parents().addClass('active');
	});
	$('.snb ul.sub_nav > li > a').on('click',function(){
		$('.snb ul.sub_nav li').removeClass('active');
		
		$(this).parent().addClass('active');
		$(this).parents().parents().parents().addClass('active');	
	});	
	$('.snb ul.third_nav > li > a').on('click',function(){
		$('.snb ul.third_nav > li').removeClass('active');
		
		$(this).parent().addClass('active');
		$(this).parents().parents().parents().addClass('active');	
	});
	
	// select	
	$('.selectbox select').on('focus',function(){
		$(this).parent().addClass('active');
	});
	$('.selectbox select').on('focusout',function(){
		$(this).parent().removeClass('active');
	});	
	
	// text count
	$('.txtareaBox .textArea').on('input keyup paste', function() {
		var content = $(this).val();
		$(this).height(((content.split('\n').length + 1) * 1.5) + 'px');
		$('.txt_count').html(content.length + '/100');
		
		var txtValLth = $(this).val().length;
		
		if ( txtValLth > 0) {
			$('.btn_change').removeClass('disabled');	
			$('.btn_change').removeAttr('disabled');
		} else {
			$('.btn_change').addClass('disabled');	
			$('.btn_change').attr('disabled');
			$('.resultArea').fadeOut(300);
		}
	});
	$('.txtareaBox .textArea').keyup();
	
	// tree
	$('#tree a').on('click',function(){
		$('#tree a').removeClass('active');
		
		$(this).addClass('active');
	});
	// tab
	$('.tabUi').each(function(){
		$('.tab_contents').hide(); //Hide all content
		$('.tabUi .tab_nav ul li:first-child').addClass('active').show(); //Activate first tab
		$('.tab_contents:first-child').show(); //Show first tab content
	
		
	});	
	//TAB On Click Event
		$('.tabUi .tab_nav li a').on('click', function(){
	
			$(this).parent().parent().children('li').removeClass('active'); //Remove any 'active' class
			$(this).parent().addClass('active'); //Add 'active' class to selected tab
			$('.tabUi .tab_contents').fadeOut(200); //Hide all tab content			
		
			var activeTab = $(this).attr('href'); //Find the href attribute value to identify the active tab + content		
			$(activeTab).delay(200).fadeIn(); //Fade in the active ID content

			return false;
		});
	
	// chatbot open
	$('#btn_flt_cb').on('click', function() {
		var winWidth = $(window).width();	
		var winHeight = $(window).height();	
		if ( winWidth < 760) {
			$('#livechatWrap').fadeIn(300);	
			$('#wrap').css({
				'overflow': 'hidden',	
			});	
			$('#livechatWrap .chatbot_contents .chat_mid').css({
				'height':winHeight-130,	
			});	
			$('#livechatWrap .chatbot_contents .talkLst').css({
				'display':'block',
			});
				
		} else {
			$('#livechatWrap').fadeIn(300);		
			$('#maumWrap').css({
				'overflow': '',	
			});	
			$('#livechatWrap .chatbot_contents .talkLst').css({
				'display':'block',
			});
		}
	});
		
	
	// view top mov icon
//	$('a.btn_movLayer').each(function(){
//		$(this).parent().children().after('<strong class="ico_mov">동영상</strong>');
//	});	
});
$(function(){
	$('#container').css({'height':($(document).height())+'px'});
	$(window).resize(function(){
		$('#container').css({'height':($(document).height())+'px'});
	});
});