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

    window.addEventListener('scroll', function(){
        var stickyItem;
        var boundingRect;

        for(var i = 0; i < allIndexItem.length; i++){
            stickyItem = allIndexItem[i];
            boundingRect = stickyItem.getBoundingClientRect();

            if(boundingRect.top > window.innerHeight * 0.1 && boundingRect.top < window.innerHeight * 0.9){
                inactivate();
                currentStickyItem = allStickyItem[stickyItem.dataset.index];
                activate();        
            }

            console.log(currentStickyItem)

            if(currentStickyItem.dataset.index == 0 && boundingRect.top > window.innerHeight * 0.5){
                $('.scroll_area').addClass('fixed');
            }
            // else if(currentStickyItem.dataset.index == 4 && boundingRect.top > window.innerHeight * 0.9){
            //     $('.scroll_area').removeClass('fixed');
            // }
        }
    });
    activate();

    // if(document.currentScript === undefined){
    //     // IE 에서만 돌아갈 내용
    // }
});        


