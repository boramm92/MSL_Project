/* MINDsLab. NBR. 20210604 */
$(document).ready(function(){
    // tool menu active func
    var toolMenuBtn = $('.menu_list li button');
    var classBox = $('.menu_list li .classBox');

    toolMenuBtn.on('click', function(){
        var thisClassBox = $(this).next('.classBox');

        if($(this).hasClass('active')){
            $(this).removeClass('active open');
            thisClassBox.removeClass('active');
        }else{
            toolMenuBtn.removeClass('active');
            classBox.removeClass('active');
            thisClassBox.addClass('active'); 
            if($(this).next('.classBox').length){
                $(this).addClass('active open'); 
            }else{
                $(this).addClass('active'); 
            }           
        }
    });

    // aside expand func
    $('.btn_expand').on('click', function(){
        $('.aside').toggleClass('on');
    });    

    // comments slide toggle & tab height 
    $('.comments .tit').on('click', function(){
        $('.cmt_box').slideToggle(200);
    });

    // aside tab
    var asideTabBtn = $('.tabWrap .tab_btn > button');
    var asideTabCont = $('.tabWrap .tab_cont > ul');

    asideTabCont.eq(0).show();
    asideTabBtn.on('click',function(){
        var index = $(this).index();
        asideTabBtn.removeClass('active');
        $(this).addClass('active');
        asideTabCont.css('display','none');
        asideTabCont.eq(index).css('display','block');
    });

    // 
    $('.tabWrap .tab_cont > ul li').on('click', function(){
        if($(this).is('.active')){
            $(this).removeClass('active');
        }else{
            $('.tabWrap .tab_cont > ul li').removeClass('active');
            $(this).addClass('active');
        }
    });
    $('.tabWrap .tab_cont > ul li .select').on('click', function(e){
        e.stopPropagation();
    });
});