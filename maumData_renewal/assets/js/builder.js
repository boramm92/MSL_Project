/* MINDsLab. NBR. 20210604 */
$(document).ready(function(){
    // header scrollX func
    $(window).scroll(function () {
		$('#header').css('left', 0 - $(this).scrollLeft());
	});

    // tool menu active func
    var toolMenuBtn = $('.menu_list li button');
    var classBox = $('.menu_list li .classBox');

    toolMenuBtn.on('click', function(){
        var thisClassBox = $(this).next('.classBox');

        if($(this).hasClass('active')){
            $(this).removeClass('active');
            thisClassBox.removeClass('active');
            setTimeout(function(){
                thisClassBox.css('display', 'none');
            },200);
        }else{
            toolMenuBtn.removeClass('active');
            classBox.removeClass('active');
            $(this).addClass('active');
            thisClassBox.css('display', 'block');
            setTimeout(function(){                
                thisClassBox.addClass('active');
            },200);            
        }
    });

    // aside expand func
    $('.btn_expand').on('click', function(){
        $('.aside').toggleClass('on');
    });    
});