/* MINDsLab. NBR. 20210604 */
$(document).ready(function(){
    // aside 영역 확장 버튼
    $('.aside .btn_expand').on('click', function(){
        $('.aside').toggleClass('on');
        
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
    });  

    // videoArea width 조절
    function handleVideoAreaWidth(){
        var contentWidth = $('.content').outerWidth(),
            asideWidth = $('.aside').width(),
            videoAreaWidth = $('.videoArea').outerWidth();

        if($('.aside').hasClass('on') == true){
            videoAreaWidth = contentWidth - asideWidth;
            $('.videoArea').css('width', videoAreaWidth);
        }else{
            videoAreaWidth = contentWidth;
            $('.videoArea').css('width', videoAreaWidth);
        }
    }
    handleVideoAreaWidth();

    // videoFrameArea width 조절 - resize 시
    $(window).resize(function(){
        handleVideoAreaWidth();
    });

    // script height 조절
    function handleScriptHeight(){
        var asideHeight = $('.aside').outerHeight();
        var heightSum = 0;

        if($('.aside .script .script_box').css('display') == 'block'){
            $('.aside > div').not('.script').each(function(){
                heightSum = heightSum + $(this).outerHeight(); 
            });       
            $('.aside .script').css({height: asideHeight - heightSum});
        }else{
            $('.aside > div').not('.tabWrap').each(function(){
                heightSum = heightSum + $(this).outerHeight(); 
            });       
            $('.aside .tabWrap .tab_cont > ul').css({height: asideHeight - heightSum - 50});
        }       
    } 
    handleScriptHeight();  

    // script height 조절 - resize 시
    $(window).resize(function(){
        handleScriptHeight();
    });

    // comments 클릭 시 박스 슬라이드 & height 조절
    $('.comments .tit').on('click', function(){
        var commentsHeight = $('.aside .comments').outerHeight(), 
            commentBoxHeight = $('.aside .comments .cmt_box').outerHeight(), 
            tapContHeight = $('.aside .tabWrap .tab_cont > ul').outerHeight(),
            scriptHeight = $('.aside .script').outerHeight();   
            
        if($('.aside .script .script_box').css('display') == 'block'){
            if(commentsHeight < 55){  
                $('.comments .cmt_box').slideDown(200);
                $('.aside .script').animate({height: scriptHeight - commentBoxHeight}, 200);
            }else{    
                $('.comments .cmt_box').slideUp(200);  
                $('.aside .script').animate({height: scriptHeight + commentBoxHeight}, 200);         
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
    });

    // script 클릭 시 박스 슬라이드 & height 조절
    $('.script .tit').on('click', function(){
        var asideHeight = $('.aside').outerHeight(),
            currentFileHeight = $('.aside .currentFile').outerHeight(),
            guideFileHeight = $('.aside .guideFile').outerHeight(), 
            commentsHeight = $('.aside .comments').outerHeight(), 
            commentBoxHeight = $('.aside .comments .cmt_box').outerHeight(),
            tapWrapHeight = $('.aside .tabWrap').outerHeight(),
            tapContHeight = $('.aside .tabWrap .tab_cont > ul').outerHeight(),   
            scriptHeight = $('.aside .script').outerHeight(),
            scriptBoxHeight = $('.aside .script .script_box').outerHeight(),         
            deleteBoxHeight = $('.aside .deleteBox').outerHeight();                  

        if($('.aside .script .script_box').css('display') == 'none'){

            $('.aside .script .script_box').slideDown(200);
            // $('.aside .tabWrap .tab_cont > ul').addClass('short');
            $('.aside .tabWrap .tab_cont > ul').animate({height: 246}, 200);
            $('.aside .script').animate({height: tapContHeight - 196}, 200);    
            
        }else{

            $('.aside .script .script_box').slideUp(200);
            $('.aside .tabWrap .tab_cont > ul').removeClass('short');
            $('.aside .script').css('height', 'auto');
            $('.aside .tabWrap .tab_cont > ul').animate({height: tapContHeight + scriptBoxHeight}, 200);       
        }
    });

    // script 검색 기능 - keyboard trigger    
    $('.script_box .srch_box .ipt_txt').keydown(function(key){
        if(key.keyCode == 13){
            $('.script_box .srch_box .btn_srch').trigger('click');
        }else if(key.keyCode == 38){
            $('.script_box .btn_txt_prev').trigger('click');
        }else if(key.keyCode == 40){
            $('.script_box .btn_txt_next').trigger('click');
        }
    });

    // script 검색 기능 - click
    $('.script_box .srch_box .btn_srch').on('click',function(){
        var findTxtField = $('.script_box .srch_box .ipt_txt').val();

        // 검색어 갯수, 검색어 활성화 reset 
        $('.srch_txt_index span').remove();

        $('.scrt_txt').find('span.findElement').queue(function() {
            $(this).removeClass('findElement');
            $(this).attr('id', '');
        });

        //검색 단어 표시
        $('.scrt_txt:contains("'+ findTxtField +'")').each(function(){
            var regex = new RegExp(findTxtField, 'gi');

            $(this).html(
                $(this).text().replace(regex, '<span class="findElement">'+ findTxtField +'</span>')
            );
            // 검색 단어 ID 선언
            $(this).find('.findElement').each(function(){
                var findElementIndex = $(this).index();

                findElementIndex = parseInt(findElementIndex) + 1;
                $(this).attr('id', 'findElement'+ findElementIndex);
            });
        });

        if(findTxtField != '' && $('#findElement1').text() == findTxtField){
            // 검색어 갯수 표시
            var findElementAllNum = $('.findElement').length,
                page_prev_num = 1,
                page_next_num = 2;

            $('.srch_txt_index').html('\
                <span class="current">'+ page_prev_num + '</span>\
                &sol;\
                <span class="total">'+ findElementAllNum + '</span>\
            ');

            // 첫번째 검색어에 스크롤 이동
            $('.scrt_txt').animate({
                scrollTop: $('#findElement1').offset().top - $('.scrt_txt').offset().top * 2 + $('.scrt_txt').scrollTop() + 650
            }, 200);

            $('.findElement').removeClass('selected');
            $('#findElement1').addClass('selected');

            // next button
            $('.script_box .btn_txt_next').on('click',function(e){
                if(findElementAllNum > page_prev_num){
                    e.preventDefault();

                    page_prev_num++;
                    page_next_num++;

                    $('.srch_txt_index .current').text(page_prev_num);
                    $('.script_box .btn_txt_prev').attr('href', '#findElement' + page_prev_num + '');
                    $('.script_box .btn_txt_next').attr('href', '#findElement' + page_next_num + '');

                    $('.findElement').removeClass('selected');
                    $('#findElement' + page_prev_num + '').addClass('selected');
                    
                    var findElementOffset = $('.selected').offset().top,
                        scriptOffsetTop = $('.scrt_txt').offset().top,
                        scriptScrollTop = $('.scrt_txt').scrollTop();

                    $('.scrt_txt').animate({
                        scrollTop: findElementOffset - scriptOffsetTop * 2 + scriptScrollTop + 650
                    }, 200);                    
                }
            });

            // prev button
            $('.script_box .btn_txt_prev').on('click',function(e){
                if(1 < page_prev_num){
                    e.preventDefault();

                    page_prev_num--;
                    page_next_num--;

                    $('.srch_txt_index .current').text(page_prev_num);
                    $('.script_box .btn_txt_prev').attr('href', '#findElement' + page_prev_num + '');
                    $('.script_box .btn_txt_next').attr('href', '#findElement' + page_next_num + '');

                    $('.findElement').removeClass('selected');
                    $('#findElement' + page_prev_num + '').addClass('selected');
                    
                    var findElementOffset = $('.selected').offset().top,
                        scriptOffsetTop = $('.scrt_txt').offset().top,
                        scriptScrollTop = $('.scrt_txt').scrollTop();

                    $('.scrt_txt').animate({
                        scrollTop: findElementOffset - scriptOffsetTop * 2 + scriptScrollTop + 650
                    }, 200);                   
                }
            });
        }else{
            $('.srch_txt_index').html('\
                <span class="current">0</span>\
                &sol;\
                <span class="total">0</span>\
            ');
        }
    });
});

