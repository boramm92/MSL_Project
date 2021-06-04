/* MINDsLab. NBR. 20210604 */
$(document).ready(function(){
    // tool menu active func
    var toolMenuBtn = $('.tool_list li button');

    toolMenuBtn.on('click', function(){
        var classBox = $(this).siblings('.classBox');  
             
        if($(this).is('.active')){
            $(this).removeClass('active');
            classBox.removeClass('open'); 
            setTimeout(function(){                 
                classBox.css('display', 'none');              
            },200);
        }else{
            toolMenuBtn.removeClass('active');
            $(this).addClass('active');            
            classBox.css('display', 'block');
            setTimeout(function(){
                classBox.addClass('open');
            },200);           
        }
    });

    // aside expand func
    $('.btn_expand').on('click', function(){
        $('.aside').toggleClass('on');
    });    
});