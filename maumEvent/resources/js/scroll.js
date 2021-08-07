$(document).ready(function(){
    var allIndexItem = document.querySelectorAll('.index_item');
    var allStickyItem = document.querySelectorAll('.scroll_item');
    var currentStickyItem = allStickyItem[0];

    for(var i = 0; i < allIndexItem.length; i++){
        allIndexItem[i].dataset.index = i;
        allStickyItem[i].dataset.index = i;
    }

    function activate(){       
        currentStickyItem.classList.add('visible');       
    }

    function inactivate(){
        currentStickyItem.classList.remove('visible');        
    }

    function fixed(){
        currentStickyItem.classList.remove('static');
        currentStickyItem.classList.add('fixed');
    }

    function static(){
        currentStickyItem.classList.remove('fixed');
        currentStickyItem.classList.add('static');
    }

    window.addEventListener('scroll', function(){
        var stickyItem;
        var boundingRect;

        for(var i = 0; i < allIndexItem.length; i++){
            stickyItem = allIndexItem[i];
            boundingRect = stickyItem.getBoundingClientRect();

            if(boundingRect.top > window.innerHeight * 0.2 && boundingRect.top < window.innerHeight * 0.8){
                inactivate();
                static();
                currentStickyItem = allStickyItem[stickyItem.dataset.index];
                activate();
                fixed();
            }
        }
    });
    activate();


    // function animationSpeech() {
    //     $('.speechBox').removeClass('active');
    //     setTimeout(function(){
    //         $('.speechBox').addClass('active');
    //     }, 100);
    // }

    // if($(window).outerWidth() <= 768){
    //     setInterval(animationSpeech, 6100);
    // }

    // $(window).resize(function(){
    //     if($(window).outerWidth() <= 768){
    //         setInterval(animationSpeech, 6100);
    //     }
    // });
});

