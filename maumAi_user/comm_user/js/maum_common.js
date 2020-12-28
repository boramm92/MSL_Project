// MINDsLab UX/UI팀. YMJ. 20200910

$(document).ready(function (){    
    //etc layer open
	$('.maum_etc .nav>li>a').on('click',function(){  
        $(this).parent().toggleClass('active');
		return false; 
	});
	
	//etc layer close
	$(document).mouseup(function (e){
		var container = $('.maum_etc .nav>li.active');		
		if( container.has(e.target).length === 0){		
			container.removeClass('active');
		}	
	});

    //Layer popup open 
	$('.btn_lyr_open').on('click',function(){	
        var winHeight = $(window).height()*0.7,
            hrefId = $(this).attr('href');
        
        $('body').css('overflow','hidden'); 
        $('body').find(hrefId).wrap('<div class="lyrWrap"></div>');
        $('body').find(hrefId).before('<div class="lyr_bg"></div>');
        
        //대화 UI
        $('.lyrBox .lyr_mid').each(function(){
            $(this).css('max-height', Math.floor(winHeight) +'px'); 
        }); 
        
        //Layer popup close 
        $('.btn_lyr_close, .lyr_bg').on('click',function(){
            $('body').css('overflow','');  
            $('body').find(hrefId).unwrap();
            $('.lyr_bg').remove(); 
        });	
    });	
	
    //문의하기(전화번호 하이픈)
    $('.phone_numHyphen').each(function(){ 
        $(this).text( $(this).text().replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/,"$1-$2-$3").replace("--", "-") );
    });

    //문의하기(전화번호 숫자만 입력)
    $('.phone_numOnly').on('keyup', function() {
        $(this).val($(this).val().replace(/[^0-9]/g,''));
    });
	
	//문의하기(인풋 라벨)
	var contactLabel = $('#lyr_contact_model input,#lyr_contact_model textarea,#lyr_contact_myModel textarea');
	
	contactLabel.on('focus', function () {
		$(this).siblings('label').hide();
	});
	
	contactLabel.on('focusout', function () {
		if ($(this).val() === '') {
			$(this).siblings('label').show();
		}
	});
	
    // 특수문자 정규식 변수(공백 미포함)
    var replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>0-9\/.\`:\"\\,\[\]?|{}]/gi; 
    // 완성형 아닌 한글 정규식
    var replaceNotFullKorean = /[ㄱ-ㅎㅏ-ㅣ]/gi;
	
	$('.textTypeCheck').on('focusout', function() {
		var x = $(this).val();
		if (x.length > 0) {
			if (x.match(replaceChar) || x.match(replaceNotFullKorean)) {
				x = x.replace(replaceChar, "").replace(replaceNotFullKorean, "");
			}
			$(this).val(x);
		}
		}).on('keyup', function() {
			$(this).val($(this).val().replace(replaceChar, ""));

   });
}); 