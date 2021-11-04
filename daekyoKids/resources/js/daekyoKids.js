/* MINDsLab. UX/UI Team. NBR. 20211104 */

$(document).ready(function(){
    // fixed header scroll
    $(window).scroll(function(){
		$('#header').css('left', 0 - $(this).scrollLeft());
	});

    // sub nav
    var windowWidth = $(window).width();

    if(windowWidth >= 768){
        $('.gnb .nav > li > a').on('mouseenter', function(){
            var subNav = $(this).parent('li').find('.sub');
    
            if(subNav.length == 1){
                $('#header').addClass('hover');
                setTimeout(function(){
                    subNav.css('display', 'flex');
                }, 100);
            }else{
                $('#header').removeClass('hover');
                $('.sub').css('display', 'none');
            }
        });
        $('#header').on('mouseleave', function(){
            $('#header').removeClass('hover');
            $('.sub').css('display', 'none');
        });
    }

    $(window).resize(function(){
        if(windowWidth >= 768){
            $('.gnb .nav > li > a').on('mouseenter', function(){
                var subNav = $(this).parent('li').find('.sub');
        
                if(subNav.length == 1){
                    $('#header').addClass('hover');
                    setTimeout(function(){
                        subNav.css('display', 'flex');
                    }, 100);
                }else{
                    $('#header').removeClass('hover');
                    $('.sub').css('display', 'none');
                }
            });
            $('#header').on('mouseleave', function(){
                $('#header').removeClass('hover');
                $('.sub').css('display', 'none');
            });
        }
    });

    // header 모바일 메뉴 햄버거 버튼
    var hamBtn = $('.btn_ham'),
        sta = $('.sta'),
        clicked = false;

    hamBtn.on('click', function(){
        if(!hamBtn.hasClass('active')){
            hamBtn.addClass('active');
            sta.addClass('active');
            $('html').css('overflow', 'hidden');       
            $('<div class="bg_dim"></div>').prependTo('#header');
            clicked = true;

            $('.bg_dim').on('click', function(){
                hamBtn.removeClass('active');
                sta.removeClass('active');
                $('html').css('overflow', '');
                $('.bg_dim').remove();
                clicked = false;
            });
        }else if(hamBtn.hasClass('active')){
            hamBtn.removeClass('active');
            sta.removeClass('active');
            $('html').css('overflow', '');
            $('.bg_dim').remove();
            clicked = false;
        }
    });
});