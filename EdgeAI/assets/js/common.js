// MINDsLab. YMJ. 20190830
// MINDsLab. CSJ. 20210403

function story(){
    $(".btn_more button").on("click", function(){
        $box = $(".story_slider_cont");
        if( $box.css("height") === "214px" ) {
            $box.animate({
                height:"565px"
            }, 200);
            $(this).parent().addClass("on").find("span").text('접기');
        } else {
            $box.animate({
                height:"214px"
            }, 200);
            $(this).parent().removeClass("on").find("span").text('더보기');
        }
    });
}

function go(){
    var url = window.location.href;
    var pram = location.search;
    var path = location.pathname;
    // console.log(pram);
    // var service = document.getElementsByClassName('go_service');
    if(path == '/'){
        scroll();
    }else {
        // scroll();
        window.location.href="/?lang=ko#service_position";
        // $('.lyr_service').fadeIn();
    }
}

// 20.04.07 NBR 수정
function header(){
    var scroll = document.documentElement.scrollTop;
    var container = $('#container');

    if( scroll>0 && container.hasClass('view') == false ){
        $("#header").addClass("on");
        $("#header .maum_sta h1 a").css("background-image","url('../assets/images/logo_Edge_bk.svg')");
    } else if ( scroll==0 && container.hasClass('view') == false ) {
        $("#header").removeClass("on");
        $("#header .maum_sta h1 a").css("background-image","url('../assets/images/logo_Edge_w.svg')");
    } else if ( container.is('view') ) {
        $("#header").addClass("on");
        $("#header .maum_sta h1 a").css("background-image","url('../assets/images/logo_Edge_bk.svg')");
    } 
}

function tab(){
    $(".tab_btn_area .tab_btn").click(function(e) {
        $(".tab_cnt").hide().removeClass("active");
        var activeTab = $(this).attr("rel");
        $("#"+activeTab).fadeIn().addClass("active");

        $(".tab_slider_area li").removeClass("on");
        $(this).addClass("on");
        
        if ($(this).hasClass("slider")) {
            return;
        }

        var whatTab = $(this).index();
        
        var howFar = $(".tab_btn").width()* whatTab;
        $(".slider").css({
            left: howFar + "px"
        });

        $(".ripple").remove();

        var posX = $(this).offset().left,
             posY = $(this).offset().top,
             buttonWidth = $(this).width(),
             buttonHeight = $(this).height();

        $(this).prepend("<span class='ripple'></span>");

        if (buttonWidth >= buttonHeight) {
            buttonHeight = buttonWidth;
        } else {
            buttonWidth = buttonHeight;
        }

        var x = e.pageX - posX - buttonWidth / 2;
        var y = e.pageY - posY - buttonHeight / 2;

        $(".ripple").css({
            width: buttonWidth,
            height: buttonHeight,
            top: y + 'px',
            left: x + 'px'
        }).addClass("rippleEffect");
    });
}

function aside(){
    var scroll = document.documentElement.scrollTop;
    $('.btn_maum_ham').click(function(){
        if($(".mbl_aside").hasClass("on")){
            $(this).removeClass('active');
            $(".mbl_aside").removeClass("on")
            $(".mbl_aside").addClass("off");
            $("#header").removeClass("mobile_menu");
            $('body').css({overflow : ''});
            if( $("#header").hasClass("on")) {
                $("#header .maum_sta h1 a").css({"background-image":"url('../assets/images/logo_Edge_bk.svg"});
            } else {
                $("#header .maum_sta h1 a").css("background-image","url('../assets/images/logo_Edge_w.svg");
            }
        }else{
            $(this).addClass('active');
            $(".mbl_aside").removeClass("off")
            $(".mbl_aside").addClass("on");
            
            $("#header").addClass("mobile_menu");
            $("#header .maum_sta h1 a").css("background-image","url('../assets/images/logo_Edge_bk.svg");

            $("body").css({overflow :"hidden"});
        }
    });

    $('.m_nav').find('> ul > li').on('click',function(){
        if(!$(this).hasClass('active')){
            $(this).siblings().removeClass('active');
            $(this).siblings().find('> ul').slideUp();
            $(this).addClass('active');
            $(this).find('> ul').slideDown();
        }else{
            $(this).removeClass('active');
            $(this).find('> ul').slideUp();
        }
    })

    if($(".mbl_aside_btm ul").hasClass("dn")) {
        $(".mbl_aside_mid").css("height","calc(100vh - 192px)");
    }
}

$(document).ready(function(){
    
    aside();
    header();

    //서비스 구조 보기 웹
    $('.layer_btn').on('click', function () {
        $('.lyr_service').fadeIn();
        $('body').css({
            'overflow': 'hidden'
        });

    });

    //서비스 구조 보기 모바일
    $('.layer_m_btn').on('click', function () {

        $('.lyr_service').fadeIn().css('visibility', 'visible');
        $('.btn_header_ham').removeClass('active');
        $('.mbl_aside').animate({
            width: '0'
        }, {duration: 200, queue: false});

        $('.bg_aside').animate({
            opacity: 0,
            display: 'none',
        }, {duration: 150, queue: false});
        // $('.bg_aside').css({
        // 	display : 'none',
        // });
        $('body').css({
            'overflow': 'hidden'
        });

    });

    //etc layer open
    $('.maum_etc .nav>li>a.btn_ico').on('click',function(){
        $(this).parent().toggleClass('active');
        return false;
    });
    
    $(document).mouseup(function (e){
        var container = $('.maum_etc .nav>li.active');
        if( container.has(e.target).length === 0){
            container.removeClass('active');
        }
    });

    $('.btn_lyrWrap_close, .lyr_consultant_bg, .lyr_service_bg').on('click', function () {
        $('.lyr_info').hide();
        $('.lyr_service').fadeOut();
        $('.lyr_consultant').hide();
        $('#info_name').val("");
        $('#info_company').val("");
        $('#info_email').val("");
        $('#info_phone').val("");
        $('body').css({
            'overflow': ''
        });
        clicked = true;
    });

        
    $('.btn_sign').on('click',function(){
        var stateVal = uuidv4();

        location.href = $SsoUrl+"/maum/oauthLoginMain" + "?response_type=code&client_id=" + $ClientId + "&redirect_uri=" + encodeURIComponent($RedirectUri);
            // + "&state=" + stateVal;

        //$('.lyr_login').fadeIn();
        //$('.lyr_login .lyrWrap').fadeIn();
        //$('.lyr_password').fadeOut();
    });

    var $ClientId = "maum.ai";
    var $RedirectUri = "https://maum.ai/";
    var $SsoUrl = "https://sso.maum.ai";

    // function uuidv4() {
    //     return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    //         (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    //     );
    // }

    $(".btn_lyr_video").on("click", function () {
        var resource = $(this).attr('data-resource');
        $('body').css('overflow', 'hidden');

        $('body').append(
                '<div class="lyr_bg_dim"></div>\
                  <div id="lyr_video_player" class="lyrPlayBox">\
                    <div class="lyr_ct">\
                      <iframe width="1237" height="696"\
                      src="' + resource + '"\
              title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\
            </div>\
            <button type="button" class="btn_lyr_close" title="닫기버튼">\
              <em class="html_code">&#215;</em>\
            </button>\
          </div>');

        $('.lyr_bg_dim, .btn_lyr_close').on('click', function () {
            $('body').css('overflow', '');
            $('.lyr_bg_dim').remove();
            $('#lyr_video_player').remove();
        });
    });
});

$(window).on({
    "load":function(){
        header();
    },
    "resize":function(){
        if( $(window).width() > 768) {
            $(".mbl_aside").removeClass("off");
        }
    },
    "scroll":function(){
        header();
    }
});