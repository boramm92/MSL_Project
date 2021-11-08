/* MINDsLab. UX/UI Team. NBR. 20211104 */

$(document).ready(function(){
    // visual 영역 swiper
    var visualSwiper = new Swiper('.visual.swiper-container', {
        slidesPerGroup: 1,
        slidesPerView: 1,
        loop: true, 
        observer: true,
		observeParents: true,
        touchRatio: 0,
		pagination: {
			el: '.swiper-pagination',
            type: 'fraction',
            formatFractionCurrent: function(number){
                return '0' + number;
            },
            formatFractionTotal: function(number){
                return '0' + number;
            }
		},
        navigation: {
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next'
        },
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        breakpoints: {
			768: {
				touchRatio: 1
			}
		}
	});


    // page top 이동 버튼 노출
    function topBtnShow(){
        var scrollLocate = $(window).scrollTop();
		if(scrollLocate > 80){
			$('#btn_top').fadeIn(200);
		}
		if(scrollLocate < 80){
			$('#btn_top').fadeOut(200);
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
        sectionFigureAni();
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


    // 각 영역 텍스트 등장 애니메이션
    var daekyoKidsVisible = false,
        sangsangAppVisible = false,
        steamBoxVisible = false,
        engHomeBoxVisible = false;

    function sectionFigureAni(){
        // 대교 상상 Kids 영역
        if(checkVisible($('.stn:nth-child(2)')) && !daekyoKidsVisible){
            $('.stn').removeClass('on');   
            $('.stn:nth-child(2)').addClass('on');         
            aiccVisible = true;
        }

        // 상상키즈 APP 영역
        if(checkVisible($('.stn:nth-child(3)')) && !sangsangAppVisible){
            $('.stn').removeClass('on');     
            $('.stn:nth-child(3)').addClass('on');         
            smartxVisible = true;
        }
        
        // 스팀박스 영역
        if(checkVisible($('.stn:nth-child(4)')) && !steamBoxVisible){ 
            $('.stn').removeClass('on');  
            $('.stn:nth-child(4)').addClass('on');               
            minutesVisible = true;
        }

        // 영어홈박스 영역
        if(checkVisible($('.stn:nth-child(5)')) && !engHomeBoxVisible){     
            $('.stn').removeClass('on'); 
            $('.stn:nth-child(5)').addClass('on');             
            cloudApiVisible = true;
        }
    }
    sectionFigureAni();

    // 스크롤 영역 감지
    function checkVisible(elm, eval) {
        eval = eval || 'object visible';
        var viewportHalfHeight = $(window).height() / 2,
            scrolltop = $(window).scrollTop(),
            elementHalfHeight = $(elm).outerHeight() / 2,
            y = $(elm).offset().top;
        
        if(eval == 'object visible') return ((y < (viewportHalfHeight + scrolltop)) && (y > (scrolltop - elementHalfHeight)));
        if(eval == 'above') return ((y < (viewportHalfHeight + scrolltop)));
    }
});