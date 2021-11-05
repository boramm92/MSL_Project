/* MINDsLab. UX/UI Team. NBR. 20211104 */

$(document).ready(function(){
    // fixed header scroll
    $(window).scroll(function(){
		$('#header').css('left', 0 - $(this).scrollLeft());
	});

    // sub nav
    var windowWidth = $(window).width();

    function pcChkFunc(){
        console.log('pc')

        $('.gnb .nav > li > a').on('mouseenter', function(){
            var subNav = $(this).parent('li').find('.sub');
    
            if(subNav.length == 1){
                $('#header').addClass('hover');
                setTimeout(function(){
                    subNav.addClass('open');
                }, 100);
            }else{
                $('#header').removeClass('hover');
                $('.sub').removeClass('open');
            }
        });

        $('#header').on('mouseleave', function(){
            $('#header').removeClass('hover');
            $('.sub').removeClass('open');
        })
    }

    function mobileChkFunc(){
        console.log('mobile')
    }

    if(windowWidth > 768){
        pcChkFunc();
    }else if(windowWidth <= 768){
        mobileChkFunc();
    }

    // $('.gnb .nav > li > a').on('mouseenter', function(){
    //     var subNav = $(this).parent('li').find('.sub');

    //     if(windowWidth > 768 && subNav.length == 1){
    //         $('#header').addClass('hover');
    //         setTimeout(function(){
    //             subNav.addClass('open');
    //         }, 100);
    //     }else{
    //         $('#header').removeClass('hover');
    //         $('.sub').removeClass('open');
    //     }
    // });
    // $('.gnb .nav > li > a').on('click', function(){

    // });
    // $('#header').on('mouseleave', function(){
    //     $('#header').removeClass('hover');
    //     $('.sub').removeClass('open');
    // });



    $(window).resize(function(){
        if(windowWidth > 768){
            pcChkFunc();
        }else if(windowWidth <= 768){
            mobileChkFunc();
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