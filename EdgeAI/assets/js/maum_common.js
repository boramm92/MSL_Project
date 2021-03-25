// MINDsLab UX/UI팀. YMJ. 20200910

$(document).ready(function (){    
    //etc layer open
	$('.maum_etc .nav>li>a').on('click',function(){  
        $(this).parent().toggleClass('active');
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
            lyrHrefId = $(this).attr('href');
        
        $('body').css('overflow','hidden'); 
        $('body').find(lyrHrefId).wrap('<div class="lyrWrap"></div>');
        $('body').find(lyrHrefId).before('<div class="lyr_bg"></div>');
        
        //대화 UI
        $('.lyrBox .lyr_mid').each(function(){
            $(this).css('max-height', Math.floor(winHeight) +'px'); 
        }); 
        
        //Layer popup close 
        $('.btn_lyr_close, .lyr_bg').on('click',function(){
            $('body').css('overflow','');  
            $('body').find(lyrHrefId).unwrap();
            $('.lyr_bg').remove(); 
        });	
    });	
    
    //alert 
	$('.btn_alt_open').on('click',function(){	
        var altHrefId = $(this).attr('href');
        
        //show
        $('body').css('overflow','hidden'); 
        $('body').find(altHrefId).css('display','block');
        $('body').find(altHrefId).wrap('<div class="altWrap"></div>');
        
        //hide - [D/NBR] 수정 - 21.03.25 NBR 
        $('.btn_alt_close').on('click',function(){
            if($(this).parents().is('.alt_dual')){
                $('body').find(altHrefId).css('display','none'); 
                $('body').find(altHrefId).unwrap();
            }else {
                $('body').css('overflow','');
                $('body').find(altHrefId).css('display','none'); 
                $('body').find(altHrefId).unwrap();
            }            
        });	
    });	
	
    //문의하기(전화번호 하이픈)
    $('.phone_numHyphen').each(function(){ 
        $(this).text( $(this).text().replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/,"$1-$2-$3").replace("--", "-") );
    });

    //문의하기(전화번호 숫자만 입력)
    $('.phone_numOnly, .ipt_numOnly').on('keyup', function() {
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
    
    //table_filter(show)
    $('.tbl_filterBox .tbl_mid .tbl_lst> thead> tr> th> a').on('click',function(){
        //hide
        $('.tbl_filter').removeClass('active');
        //show
        $(this).next().addClass('active');
        $(this).next().find('input:first').focus(); 
        return false; 
    });

    //table_filter(hide)
    $(document).on('click', function (e) {
        var filterShow = $('.tbl_filter.active');		
        if( filterShow.has(e.target).length === 0){		
            filterShow.removeClass('active');
        }	
    });
    $('.tbl_filter .btnBox button').on('click',function(){        
        $('.tbl_filter').removeClass('active');//hide
    });
    $('.tbl_filter dd.srch .ipt_txt').keydown(function(key) {
        if (key.keyCode == 13) {
            $(this).val('');//val초기화
            $(this).parents('.tbl_filter').find('.btn_filter_close').trigger('click');//hide
        }
    });

    //table_filter(check선택)
    $('.ipt_check').on('click',function(){
        if ( $(this).is('.all') ) {
            if ($(this).prop('checked') ) {
                $(this).parents('ul').find('.ipt_check').prop('checked', true);
            } else {
                $(this).parents('ul').find('.ipt_check').prop('checked', false);
            }
        } else {
            $(this).parents('ul').find('.ipt_check.all').prop('checked', false);
        }
    });
    
    //table_filter(선택한 조건 삭제)
    $('.tbl_filterBox .btn_filter_delete').on('click',function() {
        var filterSelectLength = $('.lst_filterSelect li').length;
        
        $(this).parent().remove();   
        

        if ( 1 < filterSelectLength) {
            $('#btn_tblFilterReset').prop('disabled', false);
        } else {
            $('#btn_tblFilterReset').prop('disabled', true);
        }
    });    
    
    //input(file)
    $('.fileBox').each(function(){ 
        $('.fileBox .ipt_file_hidden').on('change', function(){
            if(window.FileReader){
                var fileName = $(this)[0].files[0].name;
            } else {
                var fileName = $(this).val().split('/').pop().split('\\').pop();
            }

            $(this).siblings('.ipt_file').val(fileName);
        });
    });
}); 