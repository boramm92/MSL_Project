/* MINDsLab. UX/UI Team. NBR. 20211104 */

$(document).ready(function(){
    // visual stn swiper
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
            delay: 3000,
            disableOnInteraction: false
        },
        breakpoints: {
			768: {
				touchRatio: 1
			}
		}
	});

    // fixed header scroll
    $(window).scroll(function(){
		$('#header').css('left', 0 - $(this).scrollLeft());
	});

    // pc / mobile sub nav
    function handlePcSubnav(){
        console.log('pc');

        
    }

    function handleMobileSubnav(){
        console.log('mobile');

        
    }

    var windowWidth = $(window).width();

    if(windowWidth <= 768){
        handleMobileSubnav();
    }else{
        handlePcSubnav();
    }

    $(window).resize(function(){
        var windowWidth = $(window).width();

        if(windowWidth <= 768){
            handleMobileSubnav();
        }else{
            handlePcSubnav();
        }
    });

    // header mobile ham button
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