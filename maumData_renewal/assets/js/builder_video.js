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

    // // videoArea width 조절 - resize 시
    // $(window).resize(function(){
    //     handleVideoAreaWidth();
    // });

    // tabWrap height 조절
    function handleTabWrapHeight(){
        var asideHeight = $('.aside').outerHeight();
        var heightSum = 0;

        $('.aside > div').not('.script').each(function(){
            heightSum = heightSum + $(this).outerHeight();            
        });       
        $('.aside .script').css({height: asideHeight - heightSum});

        console.log(heightSum)
    } 
    handleTabWrapHeight();  

    // tabWrap height 조절 - resize 시
    $(window).resize(function(){
        handleTabWrapHeight();
    });

    // comments 클릭 시 박스 슬라이드 & height 조절
    $('.comments .tit').on('click', function(){
        var commentsHeight = $('.aside .comments').outerHeight(), 
            commentBoxHeight = $('.aside .comments .cmt_box').outerHeight(), 
            tapContHeight = $('.aside .tabWrap .tab_cont > ul').outerHeight(),
            scriptBoxHeight = $('.aside .script .script_box').outerHeight();   
            
        if($('.script_box').css('display') == 'block'){
            if(commentsHeight < 55){  
                $('.comments .cmt_box').slideDown(200);
                $('.aside .script .script_box').animate({height: scriptBoxHeight - commentBoxHeight}, 200);
            }else{    
                $('.comments .cmt_box').slideUp(200);  
                $('.aside .script .script_box').animate({height: scriptBoxHeight + commentBoxHeight}, 200);         
            }
        }else{
            if(commentsHeight < 55){   
                $('.comments .cmt_box').slideDown(200);
                $('.aside .tabWrap .tab_cont > ul').animate({height: tapContHeight - commentBoxHeight}, 200);
            }else{    
                $('.comments .cmt_box').slideUp(200);  
                $('.aside .tabWrap .tab_cont > ul').animate({height: tapContHeight + commentBoxHeight}, 200);         
            }
        } 
        
        // $('.script .tit').on('click', function(){
        //     // var asideHeight = $('.aside').outerHeight(),
        //     //     currentFileHeight = $('.aside .currentFile').outerHeight(),
        //     //     guideFileHeight = $('.aside .guideFile').outerHeight(), 
        //     //     commentsHeight = $('.aside .comments').outerHeight(), 
        //     //     commentBoxHeight = $('.aside .comments .cmt_box').outerHeight(),
        //     //     tapContHeight = $('.aside .tabWrap .tab_cont > ul').outerHeight(),   
        //     //     scriptHeight = $('.aside .script').outerHeight(),
        //     //     scriptBoxHeight = $('.aside .script .script_box').outerHeight(),         
        //     //     deleteBoxHeight = $('.aside .deleteBox').outerHeight();                  
    
        //     if(scriptHeight < 55){
        //         var height = currentFileHeight + guideFileHeight + commentsHeight + tapContHeight + deleteBoxHeight + 50;
    
        //         $('.aside .script .script_box').slideDown(200);
        //         // $('.aside .script').animate({height: asideHeight - height}, 200);    
        //         $('.aside .tabWrap .tab_cont > ul').animate({height: tapContHeight - scriptBoxHeight}, 200);                                  
        //     }else{
        //         // $('.aside .script').css('height', 'auto');
        //         $('.aside .script .script_box').slideUp(200);  
        //         $('.aside .tabWrap .tab_cont > ul').animate({height: tapContHeight + scriptBoxHeight}, 200);         
        //     }
        // });
    });

    // script 클릭 시 박스 슬라이드 & height 조절
    $('.script .tit').on('click', function(){
        var asideHeight = $('.aside').outerHeight(),
            currentFileHeight = $('.aside .currentFile').outerHeight(),
            guideFileHeight = $('.aside .guideFile').outerHeight(), 
            commentsHeight = $('.aside .comments').outerHeight(), 
            commentBoxHeight = $('.aside .comments .cmt_box').outerHeight(),
            tapContHeight = $('.aside .tabWrap .tab_cont > ul').outerHeight(),   
            scriptHeight = $('.aside .script').outerHeight(),
            scriptBoxHeight = $('.aside .script .script_box').outerHeight(),         
            deleteBoxHeight = $('.aside .deleteBox').outerHeight();                  

        if(scriptHeight < 55){
            var height = currentFileHeight + guideFileHeight + commentsHeight + tapContHeight + deleteBoxHeight;

            handleTabWrapHeight();
            $('.aside .script .script_box').slideDown(200);
            $('.aside .tabWrap .tab_cont > ul').animate({height: tapContHeight - scriptBoxHeight}, 200);                                  
        }else{
            $('.aside .script').css('height', 'auto');
            $('.aside .script .script_box').slideUp(200);  
            $('.aside .tabWrap .tab_cont > ul').animate({height: tapContHeight + scriptBoxHeight}, 200);         
        }
    });
});

