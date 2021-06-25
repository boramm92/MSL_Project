/* MINDsLab. NBR. 20210604 */
$(document).ready(function(){
    // aside 영역 확장 버튼
    $('.aside .btn_expand').on('click', function(){
        $('.aside').toggleClass('on');
        handleVideoAreaWidth();
    });
    
    // videoArea width 조절
    function handleVideoAreaWidth(){
        var contentWidth = $('.content').outerWidth(),
            asideWidth = $('.aside').outerWidth(),
            videoAreaWidth = $('.videoArea').outerWidth();

        if($('.aside').hasClass('on') == true){
            videoAreaWidth = videoAreaWidth - asideWidth;
            $('.videoArea').animate({width: videoAreaWidth}, 300);
        }else{
            videoAreaWidth = contentWidth;
            $('.videoArea').animate({width: videoAreaWidth}, 300);
        }
    }
    handleVideoAreaWidth();

    // videoArea width 조절 - resize 시
    $(window).resize(function(){
        handleVideoAreaWidth();
    });

    // comments or script 클릭 시 박스 슬라이드 & height 조절
    // $('.tit').on('click', function(){
    //     var asideHeight = $('.aside').outerHeight(),
    //         currentFileHeight = $('.aside .currentFile').outerHeight(),
    //         guideFileHeight = $('.aside .guideFile').outerHeight(), 
    //         commentsHeight = $('.aside .comments').outerHeight(), 
    //         commentBoxHeight = $('.aside .comments .cmt_box').outerHeight(),            
    //         deleteBoxHeight = $('.aside .deleteBox').outerHeight();

    //     if(commentsHeight < 55){
    //         var height = currentFileHeight + guideFileHeight + commentsHeight + commentBoxHeight + deleteBoxHeight;

    //         $('.comments .cmt_box').slideDown(200);
    //         $('.aside .tabWrap').animate({height: asideHeight - height}, 200);
    //     }else{
    //         var height = currentFileHeight + guideFileHeight + commentsHeight + deleteBoxHeight - commentBoxHeight;

    //         $('.comments .cmt_box').slideUp(200);  
    //         $('.aside .tabWrap').animate({height: asideHeight - height}, 200);         
    //     }
    // }); 

    $('.tit').on('click', function(){
        var 
        var asideHeight = $('.aside').outerHeight(),
            currentFileHeight = $('.aside .currentFile').outerHeight(),
            guideFileHeight = $('.aside .guideFile').outerHeight(), 
            commentsHeight = $('.aside .comments').outerHeight(), 
            commentBoxHeight = $('.aside .comments .cmt_box').outerHeight(),            
            deleteBoxHeight = $('.aside .deleteBox').outerHeight(),
            scriptHeight = $('aside .script').outerHeight(),
            scriptBoxHeight = $('aside .script .script_box').outerHeight();

        if($(this).parent().is('.comments')){
            console.log('comments');

            
            if(commentsHeight < 55){
                $('.comments .cmt_box').slideDown(200);
            }else{
                $('.comments .cmt_box').slideUp(200);      
            }
        }else if($(this).parent().is('.script')){
            console.log('script');

            if(scriptHeight < 55){
                $('.script .script_box').slideDown(200);
            }else{
                $('.script .script_box').slideUp(200);      
            }
        }
    }); 
});

