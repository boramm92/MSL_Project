/* MINDsLab. UX/UI Team. NBR. 20211104 */

$(document).ready(function(){
    // page top 이동 버튼 노출
    function topBtnShow(){
        var windowWidth = $(window).width(),
            scrollLocate = $(window).scrollTop();

		if(windowWidth > 599 && scrollLocate > 80){
			$('#btn_top').fadeIn(200);
		}
		if(windowWidth > 599 && scrollLocate < 80){
			$('#btn_top').fadeOut(200);
		}
        if(scrollLocate == $(document).height() - $(window).height()){
            $('#btn_top').addClass('move');
        }else{
            $('#btn_top').removeClass('move');
        }
    }

    // page top 이동 버튼 클릭 시
    $('#btn_top').on('click', function(){
        $('html').animate({scrollTop: 0,}, 400);
    });


    // 스크롤 시 이벤트
    $(window).scroll(function(){
		$('#header').css('left', 0 - $(this).scrollLeft());
        topBtnShow();
	});


    // 해상도 별 sub nav
    $('.gnb .nav > li > a').bind('mouseenter click', function(e){
        e.stopPropagation();
        var windowWidth = $(window).width(),
            thisSubNav = $(this).siblings('.sub');

        if(windowWidth > 768 && e.type == 'mouseenter'){            
            if(thisSubNav.length == 1){
                $('.gnb .nav').addClass('open');
            }else{
                $('.gnb .nav').removeClass('open');
                thisSubNav.removeClass('open');
            }
            $('.gnb .nav').on('mouseleave', function(){
                $('.gnb .nav').removeClass('open');
            });
        }else if(windowWidth <= 768 && e.type == 'click'){                        
            if(thisSubNav.length == 1){
                $(this).parent('li').toggleClass('on');
                thisSubNav.toggleClass('open');
            }
        }
    });


    // 모바일 메뉴 버튼
    var hamBtn = $('.btn_ham'),
        sta = $('.sta'),
        clicked = false;

    hamBtn.on('click', function(){
        if(!hamBtn.hasClass('active')){
            hamBtn.addClass('active');
            sta.addClass('active');
            $('body').css('overflow', 'hidden');       
            $('<div class="bg_dim"></div>').prependTo('#header');
            clicked = true;

            $('.bg_dim').on('click', function(){
                hamBtn.removeClass('active');
                sta.removeClass('active');
                $('body').css('overflow', '');
                $('.bg_dim').remove();
                clicked = false;
            });
        }else if(hamBtn.hasClass('active')){
            hamBtn.removeClass('active');
            sta.removeClass('active');
            $('body').css('overflow', '');
            $('.bg_dim').remove();
            clicked = false;
        }
    });
});