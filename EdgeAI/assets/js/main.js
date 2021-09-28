// [D] 21.09.27 NBR 추가
function scsCaseSlider() {
    var breakpointMobile = 768, 
        isChanging = false,
        isFiltered = false;
    $estimateSlider = $(".scs_case_lst");
    
    $estimateSlider.on('init breakpoint', function(e, slick){
        if(!isChanging){
            isChanging = true;
            if(slick.activeBreakpoint && slick.activeBreakpoint <= breakpointMobile){
                if(!isFiltered){
                    slick.slickFilter(':not(.pc)');
                    isFiltered = true;
                }
            }else{
                if(isFiltered){
                    slick.slickUnfilter();
                    isFiltered = false;
                }
            }
            isChanging = false;
        }
    }).slick({
        slide: 'li',
        slidesToShow: 2,
        slidesToScroll: 2,
        speed: 1000,
        arrows: true,
        draggable: false,
        prevArrow: '<button type="button" class="slick-prev"></button>',
		nextArrow: '<button type="button" class="slick-next"></button>',
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                draggable: true,
                arrows: false,
                dots: true,
                customPaging: function(slider, i) {
                    return '<span class="dot"></span>';
                },
            }
        }] 
    });
}
// //[D] 21.09.27 NBR 추가

function sequenceSlider() {
    $estimateSlider = $(".sequence_slider");
    
    $estimateSlider.slick({
        unslick:true,
        responsive: [{
            breakpoint: 9999,
            settings: "unslick"
        },{
            breakpoint: 768,
            settings: {
                // variableWidth : true,
                centerPadding: 0,
                centerMode: false,
                accessibility: false,
                infinite: false,
                draggable: true,
                autoplay: false,
                speed: 1000,
                pauseOnHover:false,
                arrows: false,
                mobileFirst: true,
                slidesToShow:1,
                slidesToScroll:1,
                dots:false,
                // customPaging: function(slider, i) {
                //     return '<span class="dot"></span>';
                // },
            }
        }] 
    });
}

function estimateSlider() {
    $estimateSlider = $(".estimate_wrap");
    
    $estimateSlider.slick({
        unslick:true,
        responsive: [{
            breakpoint: 9999,
            settings: "unslick"
        },{
            breakpoint: 768,
            settings: {
                // variableWidth : true,
                centerPadding: "20px",
                centerMode: true,
                accessibility: false,
                infinite: false,
                draggable: true,
                autoplay: false,
                speed: 1000,
                pauseOnHover:false,
                arrows: false,
                mobileFirst: true,
                slidesToShow:1,
                slidesToScroll:1,
                dots:true,
                customPaging: function(slider, i) {
                    return '<span class="dot"></span>';
                },
            }
        }] 
    });
}

function service(){
    $(".btn_service").on({
        click: function(){
            $(".btn_service").removeClass("on");
            $(this).addClass("on");
            $(".kind_list").removeClass("on");
            var resource = $(this).attr('data-resource');
            $(".kind_"+resource).addClass('on');
            
            $(this).off('mouseleave');
        },
        mouseover: function(){
            if( $(window).width() > 768 ){
                $(".btn_service, .kind_list").removeClass("on");
                $(".kind_list").removeClass("on");
                var resource = $(this).attr('data-resource');
                $(".kind_"+resource).addClass('on');
            } else {
                var resource = $(this).attr('data-resource');
                $(".kind_"+resource).addClass('');
            }
        },
        mouseout: function(){
            if( $(window).width() > 768 ){
                if( $(this).hasClass("on") ){ 
                } else{
                    $(".btn_service, .kind_list").removeClass("on");
                }
            }
        }
    });

    $(".kind_area").hover(function(){
        $(".btn_service, .kind_list").removeClass("on");
        var src = $(this).parents(".kind_list").attr("data-resource");
        $(".btn_"+src).addClass('on');
        $(this).parents(".kind_list").addClass("on");
    }, function(){
        $(".btn_service, .kind_list").removeClass("on");
        $(this).parents(".kind_list").removeClass("on");
    });

    $(".service_close").on("click", function(){
            $(".btn_service, .kind_list").removeClass("on");
    })
}

$(document).ready(function(){  
    // [D] 21.09.27 NBR 추가
    scsCaseSlider();
    // //[D] 21.09.27 NBR 추가  
    estimateSlider();
    sequenceSlider();
    service();

    TweenMax.to($(".ico_gps"), 1.5, {rotationY:"360", ease:Linear.easeNone, repeat:-1});

    $(window).on("resize orientationchange", function() {
        $(".sequence_slider").slick("resize");
        $(".estimate_wrap").slick("resize");
    });
});

$(window).on({
    "load":function(){
        service();
    },
    "resize":function(){
        service();
    },
    "scroll":function(){
    }
});
